#!/usr/bin/env python3
"""
local-skill-creator.py — Pinned helper for jx-local:create-skill operations.

Subcommands:
  validate-name <name>                                    Validate a skill name
  check-collision <name> <project_root>                   Check for naming collisions
  check-triggers <name> <effective_triggers> <project_root>  Check for trigger overlap
  scaffold <name> <project_root> --description "..." [--triggers "..."] [--allowed-tools "..."] [--argument-hint "..."] [--extras "..."]
  verify <name> <project_root> [--extras "..."]           Verify scaffolded artifacts

All paths validated: must be within project root, no shell metacharacters.
Stdlib-only — no external dependencies.
"""

import sys
import os
import re
import json
import argparse
import shutil
import tempfile
from pathlib import Path

SHELL_META = re.compile(r'[;|&`$(){}!\\\n\r]')
SKILL_NAME_RE = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
MAX_SKILL_NAME_LEN = 50
VALID_EXTRAS = {'evals', 'scripts', 'templates', 'references'}
FRONTMATTER_RE = re.compile(r'^---\s*\n(.*?)\n---\s*\n', re.DOTALL)
TRIGGER_LINE_RE = re.compile(
    r'(?:Also\s+)?[Tt]riggers?\s+on:?\s*(.+?)(?:\.\s*Do not|\.$|\.\s*$)',
    re.DOTALL,
)
USE_WHEN_RE = re.compile(r'Use when\b(.+?)(?:\.|$)', re.IGNORECASE)


# --- Shared utilities ---

def validate_path(path_str):
    if SHELL_META.search(path_str):
        output_error(f"path contains shell metacharacters: {path_str!r}")


def confine_under(base, candidate):
    resolved = Path(candidate).resolve()
    base_resolved = Path(base).resolve()
    try:
        resolved.relative_to(base_resolved)
    except ValueError:
        output_error(f"path escapes allowed root: {str(resolved)}")
    return resolved


def confine_to_project_root(user_path):
    validate_path(str(user_path))
    resolved = Path(user_path).resolve()
    if not resolved.is_dir():
        output_error(f"project root is not an existing directory: {str(resolved)}")
    return resolved


def output_json(data):
    print(json.dumps(data, indent=2))
    sys.exit(0)


def output_error(message):
    print(json.dumps({"error": message}))
    sys.exit(1)


# --- Frontmatter serialization (stdlib-only) ---

def yaml_escape_value(value):
    """Single-quote wrap values that contain YAML-sensitive characters."""
    if not value:
        return '""'
    needs_quoting = re.search(r'[:\#\"\'\[\]\{\}]|^\s|---|\s$', value)
    if needs_quoting:
        escaped = value.replace("'", "''")
        return f"'{escaped}'"
    return value


def build_frontmatter(name, description, triggers=None, allowed_tools=None,
                      argument_hint=None):
    lines = ['---']
    lines.append(f'name: {name}')
    lines.append('user-invocable: true')

    if argument_hint:
        escaped_hint = argument_hint.replace("'", "''")
        lines.append(f"argument-hint: '{escaped_hint}'")

    desc_text = description.strip()
    if triggers:
        trigger_list = [t.strip() for t in triggers.split(',') if t.strip()]
        formatted = ', '.join(f'"{t}"' for t in trigger_list)
        formatted += f', /{name}'
        desc_text += f'\n  Triggers on: {formatted}.'
        desc_text += '\n  Do not trigger for: <placeholder>.'
    else:
        desc_text += f'\n  Use when the user wants to {_derive_use_when(name, description)}.'

    lines.append('description: >')
    for desc_line in desc_text.split('\n'):
        lines.append(f'  {desc_line.strip()}')

    if allowed_tools:
        lines.append('allowed-tools: >')
        for tool_chunk in allowed_tools.split(','):
            stripped = tool_chunk.strip()
            if stripped:
                lines.append(f'  {stripped}')

    lines.append('---')
    return '\n'.join(lines) + '\n'


def _derive_use_when(name, description):
    words = name.replace('-', ' ')
    desc_lower = description.strip().rstrip('.').lower()
    if desc_lower.startswith(('scaffold', 'create', 'generate', 'build', 'run')):
        return desc_lower
    return f'{words} — {desc_lower}'


# --- Frontmatter parsing ---

def parse_frontmatter(text):
    m = FRONTMATTER_RE.match(text)
    if not m:
        return None
    raw = m.group(1)
    fields = {}
    current_key = None
    current_value = None
    is_folded = False

    for line in raw.split('\n'):
        if not line.startswith(' ') and not line.startswith('\t') and ':' in line:
            if current_key is not None:
                fields[current_key] = current_value.strip() if current_value else ''
            key, _, val = line.partition(':')
            current_key = key.strip()
            val = val.strip()
            if val in ('>', '>-'):
                is_folded = True
                current_value = ''
            else:
                is_folded = False
                current_value = val.strip("'\"")
        elif is_folded and current_key and (line.startswith('  ') or line.startswith('\t')):
            if current_value:
                current_value += ' ' + line.strip()
            else:
                current_value = line.strip()
        else:
            if current_key is not None:
                fields[current_key] = current_value.strip() if current_value else ''
                current_key = None
                current_value = None
                is_folded = False

    if current_key is not None:
        fields[current_key] = current_value.strip() if current_value else ''

    return fields


# --- Trigger extraction ---

def extract_positive_triggers(description):
    """Extract positive trigger phrases from a skill description.

    Sources: 'Triggers on:' lines and 'Use when' sentences.
    Ignores: 'Do not trigger for:' text and slash commands.
    """
    if not description:
        return []

    triggers = []

    m = TRIGGER_LINE_RE.search(description)
    if m:
        raw_triggers = m.group(1)
        for part in raw_triggers.split(','):
            cleaned = part.strip().strip('"').strip("'").strip()
            if not cleaned:
                continue
            if cleaned.startswith('/'):
                continue
            if re.match(r'^or any ', cleaned, re.IGNORECASE):
                continue
            if re.match(r'^or\s+/', cleaned, re.IGNORECASE):
                continue
            triggers.append(cleaned.lower())

    m = USE_WHEN_RE.search(description)
    if m:
        use_when_text = m.group(1).strip().lower()
        if use_when_text and len(use_when_text) > 5:
            triggers.append(use_when_text)

    return triggers


def scan_local_skills(project_root):
    results = []
    skills_dir = Path(project_root) / '.claude' / 'skills'
    if not skills_dir.is_dir():
        return results
    for skill_dir in sorted(skills_dir.iterdir()):
        if not skill_dir.is_dir():
            continue
        skill_md = skill_dir / 'SKILL.md'
        if not skill_md.is_file():
            continue
        try:
            text = skill_md.read_text(encoding='utf-8')
        except Exception:
            continue
        fields = parse_frontmatter(text)
        if not fields:
            continue
        description = fields.get('description', '')
        triggers = extract_positive_triggers(description)
        results.append({
            'skill': skill_dir.name,
            'triggers': triggers,
            'path': str(skill_md),
        })
    return results


# --- Subcommands ---

def cmd_validate_name(args):
    name = args.name
    if len(name) > MAX_SKILL_NAME_LEN:
        output_json({"valid": False, "error": f"name exceeds {MAX_SKILL_NAME_LEN} characters"})
    if not SKILL_NAME_RE.match(name):
        output_json({"valid": False, "error": "name must match ^[a-z0-9]+(?:-[a-z0-9]+)*$"})
    output_json({"valid": True, "name": name})


def cmd_check_collision(args):
    name = args.name
    project_root = args.project_root
    validate_path(project_root)
    root = confine_to_project_root(project_root)

    collisions = []

    skill_dir = root / '.claude' / 'skills' / name
    if skill_dir.is_dir():
        collisions.append({"type": "skill", "path": str(skill_dir)})

    command_file = root / '.claude' / 'commands' / f'{name}.md'
    if command_file.is_file():
        collisions.append({"type": "command", "path": str(command_file)})

    output_json({
        "collision": len(collisions) > 0,
        "collisions": collisions,
    })


def cmd_check_triggers(args):
    name = args.name
    effective_triggers = args.effective_triggers
    project_root = args.project_root
    validate_path(project_root)
    root = confine_to_project_root(project_root)

    new_triggers = []
    for t in effective_triggers.split(','):
        cleaned = t.strip().strip('"').strip("'").strip().lower()
        if cleaned and not cleaned.startswith('/'):
            new_triggers.append(cleaned)

    existing_skills = scan_local_skills(str(root))
    conflicts = []

    for new_trigger in new_triggers:
        if not new_trigger:
            continue
        for skill_info in existing_skills:
            if skill_info['skill'] == name:
                continue
            for existing_trigger in skill_info['triggers']:
                if not existing_trigger:
                    continue
                match_type = None
                if new_trigger == existing_trigger:
                    match_type = 'exact'
                elif new_trigger in existing_trigger or existing_trigger in new_trigger:
                    match_type = 'substring'
                if match_type:
                    conflicts.append({
                        "new_trigger": new_trigger,
                        "existing_trigger": existing_trigger,
                        "skill": skill_info['skill'],
                        "match_type": match_type,
                    })

    output_json({"conflicts": conflicts})


def cmd_scaffold(args):
    name = args.name
    project_root = args.project_root
    description = args.description
    triggers = args.triggers or ''
    allowed_tools = args.allowed_tools or ''
    argument_hint = args.argument_hint or ''
    extras_csv = args.extras or ''

    if not SKILL_NAME_RE.match(name) or len(name) > MAX_SKILL_NAME_LEN:
        output_error(f"invalid skill name: {name!r}")

    if not description or not description.strip():
        output_error("--description must be non-blank")

    validate_path(project_root)
    root = confine_to_project_root(project_root)

    extras = set()
    if extras_csv.strip():
        for item in extras_csv.split(','):
            item = item.strip()
            if item not in VALID_EXTRAS:
                output_error(
                    f"unknown extra '{item}'. Valid: {', '.join(sorted(VALID_EXTRAS))}"
                )
            extras.add(item)

    skills_dir = root / '.claude' / 'skills'
    skill_dir = skills_dir / name
    skills_dir_existed = skills_dir.is_dir()

    confine_under(root, skill_dir)

    if skill_dir.exists():
        output_error(f"target already exists: {str(skill_dir)}")

    frontmatter = build_frontmatter(
        name=name,
        description=description,
        triggers=triggers if triggers else None,
        allowed_tools=allowed_tools if allowed_tools else None,
        argument_hint=argument_hint if argument_hint else None,
    )

    title_case_name = ' '.join(word.capitalize() for word in name.split('-'))

    skill_md_content = f"""{frontmatter}
# {title_case_name}

{description}

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|

## Phase 1: <placeholder>

## Phase 2: <placeholder>
"""

    lock_path = None
    lock_acquired = False
    staging_dir = None
    created_dirs = []

    try:
        skills_dir.mkdir(parents=True, exist_ok=True)
        if not skills_dir_existed:
            claude_dir = root / '.claude'
            created_dirs.append(str(claude_dir))
            created_dirs.append(str(skills_dir))

        lock_path = skills_dir / f'{name}.lock'
        lock_fd = os.open(str(lock_path), os.O_CREAT | os.O_EXCL | os.O_WRONLY)
        os.close(lock_fd)
        lock_acquired = True

        if skill_dir.exists():
            os.unlink(str(lock_path))
            output_error(f"target already exists: {str(skill_dir)}")

        staging_dir = Path(tempfile.mkdtemp(
            prefix=f'.scaffold-{name}-',
            dir=str(root / '.claude'),
        ))

        staged_skill = staging_dir / name
        staged_skill.mkdir(parents=True)
        (staged_skill / 'SKILL.md').write_text(skill_md_content, encoding='utf-8')

        if 'evals' in extras:
            evals_dir = staged_skill / 'evals'
            evals_dir.mkdir()
            (evals_dir / 'evals.json').write_text('[]', encoding='utf-8')

        for extra in ('scripts', 'templates', 'references'):
            if extra in extras:
                extra_dir = staged_skill / extra
                extra_dir.mkdir()
                (extra_dir / '.gitkeep').write_text('', encoding='utf-8')

        shutil.move(str(staged_skill), str(skill_dir))

        os.unlink(str(lock_path))
        lock_path = None

        if staging_dir.exists():
            shutil.rmtree(str(staging_dir), ignore_errors=True)
            staging_dir = None

        files_created = [str(skill_dir / 'SKILL.md')]
        if 'evals' in extras:
            files_created.append(str(skill_dir / 'evals' / 'evals.json'))
        for extra in ('scripts', 'templates', 'references'):
            if extra in extras:
                files_created.append(str(skill_dir / extra / '.gitkeep'))

        output_json({
            "success": True,
            "skill": name,
            "files_created": files_created,
            "skills_dir_created": not skills_dir_existed,
        })

    except SystemExit:
        raise
    except Exception as e:
        rolled_back = []
        left_in_place = []

        if lock_acquired and lock_path and Path(lock_path).exists():
            try:
                os.unlink(str(lock_path))
                rolled_back.append(str(lock_path))
            except Exception:
                left_in_place.append(str(lock_path))

        if staging_dir and staging_dir.exists():
            try:
                shutil.rmtree(str(staging_dir))
                rolled_back.append(str(staging_dir))
            except Exception:
                left_in_place.append(str(staging_dir))

        if skill_dir.exists():
            try:
                shutil.rmtree(str(skill_dir))
                rolled_back.append(str(skill_dir))
            except Exception:
                left_in_place.append(str(skill_dir))

        for dir_path in reversed(created_dirs):
            p = Path(dir_path)
            try:
                if p.is_dir() and not any(p.iterdir()):
                    p.rmdir()
                    rolled_back.append(dir_path)
                else:
                    left_in_place.append(dir_path)
            except Exception:
                left_in_place.append(dir_path)

        print(json.dumps({
            "success": False,
            "error": str(e),
            "rolled_back": rolled_back,
            "left_in_place": left_in_place,
        }))
        sys.exit(1)


def cmd_verify(args):
    name = args.name
    project_root = args.project_root
    extras_csv = args.extras or ''

    validate_path(project_root)
    root = confine_to_project_root(project_root)

    extras = set()
    if extras_csv.strip():
        for item in extras_csv.split(','):
            extras.add(item.strip())

    skill_dir = root / '.claude' / 'skills' / name
    errors = []

    expected_files = ['SKILL.md']
    if 'evals' in extras:
        expected_files.append('evals/evals.json')
    for extra in ('scripts', 'templates', 'references'):
        if extra in extras:
            expected_files.append(f'{extra}/.gitkeep')

    if not skill_dir.is_dir():
        output_json({
            "valid": False,
            "skill": name,
            "errors": [f"skill directory not found: {str(skill_dir)}"],
            "expected_files": expected_files,
        })

    for rel_path in expected_files:
        full_path = skill_dir / rel_path
        if not full_path.is_file():
            errors.append(f"missing file: {rel_path}")

    skill_md = skill_dir / 'SKILL.md'
    if skill_md.is_file():
        text = skill_md.read_text(encoding='utf-8')
        fields = parse_frontmatter(text)
        if not fields:
            errors.append("SKILL.md: could not parse frontmatter")
        else:
            for required in ('name', 'description', 'user-invocable'):
                if required not in fields or not fields[required]:
                    errors.append(f"SKILL.md: missing or empty field '{required}'")
            if fields.get('name', '') != name:
                errors.append(
                    f"SKILL.md: name field '{fields.get('name', '')}' "
                    f"does not match '{name}'"
                )

    evals_file = skill_dir / 'evals' / 'evals.json'
    if evals_file.is_file():
        try:
            json.loads(evals_file.read_text(encoding='utf-8'))
        except json.JSONDecodeError as e:
            errors.append(f"evals.json: invalid JSON — {e}")

    output_json({
        "valid": len(errors) == 0,
        "skill": name,
        "errors": errors,
        "expected_files": expected_files,
    })


def main():
    parser = argparse.ArgumentParser(
        description='Local skill creator helper for jx-local plugin'
    )
    subparsers = parser.add_subparsers(dest='command')

    p_validate = subparsers.add_parser('validate-name')
    p_validate.add_argument('name')

    p_collision = subparsers.add_parser('check-collision')
    p_collision.add_argument('name')
    p_collision.add_argument('project_root')

    p_triggers = subparsers.add_parser('check-triggers')
    p_triggers.add_argument('name')
    p_triggers.add_argument('effective_triggers')
    p_triggers.add_argument('project_root')

    p_scaffold = subparsers.add_parser('scaffold')
    p_scaffold.add_argument('name')
    p_scaffold.add_argument('project_root')
    p_scaffold.add_argument('--description', required=True)
    p_scaffold.add_argument('--triggers', default='')
    p_scaffold.add_argument('--allowed-tools', default='')
    p_scaffold.add_argument('--argument-hint', default='')
    p_scaffold.add_argument('--extras', default='')

    p_verify = subparsers.add_parser('verify')
    p_verify.add_argument('name')
    p_verify.add_argument('project_root')
    p_verify.add_argument('--extras', default='')

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    dispatch = {
        'validate-name': cmd_validate_name,
        'check-collision': cmd_check_collision,
        'check-triggers': cmd_check_triggers,
        'scaffold': cmd_scaffold,
        'verify': cmd_verify,
    }

    dispatch[args.command](args)


if __name__ == '__main__':
    main()
