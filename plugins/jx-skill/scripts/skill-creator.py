#!/usr/bin/env python3
"""
skill-creator.py — Pinned helper for jx-skill:create operations.

Subcommands:
  validate-name <name>                          Validate a skill name
  check-collision <name> <plugins_root>         Check for naming collisions
  check-triggers <triggers_csv> <plugins_root>  Check for trigger overlap
  scaffold <name> <plugin_path> --description "..." --triggers "..." [--argument-hint "..."]
  list-skills <plugins_root>                    List all skills across plugins
  self-test <plugins_root>                      Validate trigger extraction for all skills

All paths validated: must be within project root, no shell metacharacters.
Stdlib-only — no external dependencies.
"""

import sys
import os
import re
import json
import argparse
import shutil
from pathlib import Path

SHELL_META = re.compile(r'[;|&`$(){}!\\\n\r]')
SKILL_NAME_RE = re.compile(r'^[a-z][a-z0-9-]*$')
TRIGGER_LINE_RE = re.compile(
    r'(?:Also\s+)?[Tt]riggers?\s+on:?\s*(.+?)(?:\.\s*Do not|\.$|\.\s*$)',
    re.DOTALL,
)
MAX_SKILL_NAME_LEN = 50
FRONTMATTER_RE = re.compile(r'^---\s*\n(.*?)\n---\s*\n', re.DOTALL)


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
    if not resolved.exists():
        output_error(f"path does not exist: {str(resolved)}")
    return resolved


def output_json(data):
    print(json.dumps(data, indent=2))
    sys.exit(0)


def output_error(message):
    print(json.dumps({"error": message}))
    sys.exit(1)


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
                current_value = val
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


def extract_description(fields):
    return fields.get('description', '')


def unfold_yaml_description(text):
    m = FRONTMATTER_RE.match(text)
    if not m:
        return ''
    fields = parse_frontmatter(text)
    if not fields:
        return ''
    return fields.get('description', '')


def extract_triggers_from_description(description):
    if not description:
        return []
    m = TRIGGER_LINE_RE.search(description)
    if not m:
        return []
    raw_triggers = m.group(1)
    parts = raw_triggers.split(',')
    triggers = []
    for part in parts:
        cleaned = part.strip().strip('"').strip("'").strip()
        if not cleaned:
            continue
        if cleaned.startswith('/'):
            continue
        if re.search(r'/', cleaned) and re.search(r'/[a-z]+-?[a-z]*:[a-z]', cleaned):
            continue
        if re.match(r'^or any ', cleaned, re.IGNORECASE):
            continue
        if re.match(r'^or\s+/', cleaned, re.IGNORECASE):
            continue
        triggers.append(cleaned.lower())
    return triggers


def scan_all_skills(plugins_root):
    results = []
    plugins_path = Path(plugins_root)
    if not plugins_path.is_dir():
        return results
    for plugin_dir in sorted(plugins_path.iterdir()):
        if not plugin_dir.is_dir():
            continue
        skills_dir = plugin_dir / 'skills'
        if not skills_dir.is_dir():
            continue
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
            description = extract_description(fields)
            triggers = extract_triggers_from_description(description)
            user_invocable = fields.get('user-invocable', 'true').lower() == 'true'
            command_exists = (plugin_dir / 'commands' / f'{skill_dir.name}.md').is_file()
            evals_exist = (skill_dir / 'evals' / 'evals.json').is_file()
            results.append({
                'plugin': plugin_dir.name,
                'skill': skill_dir.name,
                'user_invocable': user_invocable,
                'triggers': triggers,
                'has_command': command_exists,
                'has_evals': evals_exist,
                'path': str(skill_md),
            })
    return results


def cmd_validate_name(args):
    name = args.name
    if len(name) > MAX_SKILL_NAME_LEN:
        output_json({"valid": False, "error": f"name exceeds {MAX_SKILL_NAME_LEN} characters"})
    if not SKILL_NAME_RE.match(name):
        output_json({"valid": False, "error": "name must match ^[a-z][a-z0-9-]*$"})
    if name.startswith('-') or name.endswith('-'):
        output_json({"valid": False, "error": "name must not start or end with a hyphen"})
    output_json({"valid": True, "name": name})


def cmd_check_collision(args):
    name = args.name
    plugins_root = args.plugins_root
    validate_path(plugins_root)
    root = confine_to_project_root(plugins_root)

    if not root.is_dir():
        output_error(f"plugins root not found: {str(root)}")

    for plugin_dir in root.iterdir():
        if not plugin_dir.is_dir():
            continue
        skill_dir = plugin_dir / 'skills' / name
        if skill_dir.is_dir():
            output_json({
                "collision": True,
                "existing_plugin": plugin_dir.name,
                "existing_path": str(skill_dir),
            })
        command_file = plugin_dir / 'commands' / f'{name}.md'
        if command_file.is_file():
            output_json({
                "collision": True,
                "existing_plugin": plugin_dir.name,
                "existing_path": str(command_file),
            })

    output_json({"collision": False})


def cmd_check_triggers(args):
    triggers_csv = args.triggers_csv
    plugins_root = args.plugins_root
    validate_path(plugins_root)
    root = confine_to_project_root(plugins_root)

    new_triggers = []
    for t in triggers_csv.split(','):
        cleaned = t.strip().strip('"').strip("'").strip().lower()
        if cleaned and not cleaned.startswith('/') and not re.match(r'^or any ', cleaned, re.IGNORECASE):
            new_triggers.append(cleaned)

    all_skills = scan_all_skills(str(root))
    conflicts = []

    for new_trigger in new_triggers:
        if not new_trigger:
            continue
        for skill_info in all_skills:
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
                        "plugin": skill_info['plugin'],
                        "skill": skill_info['skill'],
                        "match_type": match_type,
                    })

    output_json({"conflicts": conflicts})


def cmd_scaffold(args):
    name = args.name
    if not SKILL_NAME_RE.match(name) or len(name) > MAX_SKILL_NAME_LEN or name.endswith('-'):
        output_error(f"invalid skill name: {name!r}")
    plugin_path = args.plugin_path
    description = args.description
    triggers = args.triggers
    argument_hint = args.argument_hint or ''

    validate_path(plugin_path)
    plugin_resolved = confine_to_project_root(plugin_path)

    if not plugin_resolved.is_dir():
        output_error(f"plugin path not found: {str(plugin_resolved)}")

    plugin_name = plugin_resolved.name

    skill_dir = plugin_resolved / 'skills' / name
    skill_md_path = skill_dir / 'SKILL.md'
    command_path = plugin_resolved / 'commands' / f'{name}.md'
    evals_path = skill_dir / 'evals' / 'evals.json'

    for p in [skill_dir, skill_md_path, command_path, evals_path]:
        confined = confine_under(plugin_resolved, p)
        if confined.exists():
            output_error(f"target already exists: {str(confined)}")

    trigger_list = [t.strip() for t in triggers.split(',') if t.strip()]
    formatted_triggers = ', '.join(f'"{t}"' for t in trigger_list)
    formatted_triggers += f', /{plugin_name}:{name}'

    title_case_name = ' '.join(word.capitalize() for word in name.split('-'))

    skill_md_content = f"""---
name: {name}
user-invocable: true
argument-hint: "{argument_hint}"
description: >
  {description}
  Triggers on: {formatted_triggers}.
  Do not trigger for: <placeholder>.
---

# {title_case_name}

{description}

## Arguments

| Argument | Required | Default | Notes |
|----------|----------|---------|-------|

## Phase 1: <placeholder>

## Phase 2: <placeholder>
"""

    command_md_content = f"""---
description: {description}
argument-hint: "{argument_hint}"
allowed-tools: Read
---

{description} using the `{plugin_name}:{name}` skill.

$ARGUMENTS
"""

    evals_content = '[]'

    staging_dir = plugin_resolved / f'.scaffold-tmp-{name}'
    created_finals = []

    try:
        staging_dir.mkdir(parents=True, exist_ok=False)

        staged_skill_dir = staging_dir / 'skills' / name
        staged_skill_dir.mkdir(parents=True)
        (staged_skill_dir / 'SKILL.md').write_text(skill_md_content, encoding='utf-8')

        staged_evals_dir = staged_skill_dir / 'evals'
        staged_evals_dir.mkdir(parents=True)
        (staged_evals_dir / 'evals.json').write_text(evals_content, encoding='utf-8')

        staged_commands_dir = staging_dir / 'commands'
        staged_commands_dir.mkdir(parents=True)
        (staged_commands_dir / f'{name}.md').write_text(command_md_content, encoding='utf-8')

        (plugin_resolved / 'commands').mkdir(parents=True, exist_ok=True)

        evals_final_dir = skill_dir / 'evals'
        skill_dir.mkdir(parents=True, exist_ok=True)
        created_finals.append(str(skill_dir))

        shutil.move(
            str(staged_skill_dir / 'SKILL.md'),
            str(skill_md_path),
        )
        created_finals.append(str(skill_md_path))

        evals_final_dir.mkdir(parents=True, exist_ok=True)
        created_finals.append(str(evals_final_dir))

        shutil.move(
            str(staged_evals_dir / 'evals.json'),
            str(evals_path),
        )
        created_finals.append(str(evals_path))

        shutil.move(
            str(staged_commands_dir / f'{name}.md'),
            str(command_path),
        )
        created_finals.append(str(command_path))

        shutil.rmtree(str(staging_dir), ignore_errors=True)

        output_json({
            "success": True,
            "files_created": [
                str(skill_md_path),
                str(evals_path),
                str(command_path),
            ],
        })

    except Exception as e:
        rollback_paths = []
        for final_path in reversed(created_finals):
            p = Path(final_path)
            try:
                if p.is_file():
                    p.unlink()
                    rollback_paths.append(str(p))
                elif p.is_dir() and not any(p.iterdir()):
                    p.rmdir()
                    rollback_paths.append(str(p))
            except Exception:
                pass

        if skill_dir.is_dir():
            try:
                shutil.rmtree(str(skill_dir))
                rollback_paths.append(str(skill_dir))
            except Exception:
                pass

        shutil.rmtree(str(staging_dir), ignore_errors=True)

        print(json.dumps({
            "success": False,
            "error": str(e),
            "rolled_back": rollback_paths,
        }))
        sys.exit(1)


def cmd_list_skills(args):
    plugins_root = args.plugins_root
    validate_path(plugins_root)
    root = confine_to_project_root(plugins_root)
    skills = scan_all_skills(str(root))
    output_json(skills)


def cmd_self_test(args):
    plugins_root = args.plugins_root
    validate_path(plugins_root)
    root = confine_to_project_root(plugins_root)
    all_skills = scan_all_skills(str(root))

    failures = []
    details = []
    tested = 0

    for skill_info in all_skills:
        if not skill_info['user_invocable']:
            details.append({
                "plugin": skill_info['plugin'],
                "skill": skill_info['skill'],
                "status": "skipped",
                "reason": "user-invocable: false",
            })
            continue

        tested += 1
        trigger_count = len(skill_info['triggers'])

        if trigger_count == 0:
            failures.append({
                "plugin": skill_info['plugin'],
                "skill": skill_info['skill'],
                "error": "user-invocable skill has zero extracted triggers",
                "path": skill_info['path'],
            })
            details.append({
                "plugin": skill_info['plugin'],
                "skill": skill_info['skill'],
                "status": "failed",
                "triggers_found": 0,
            })
        else:
            details.append({
                "plugin": skill_info['plugin'],
                "skill": skill_info['skill'],
                "status": "passed",
                "triggers_found": trigger_count,
                "triggers": skill_info['triggers'],
            })

    if failures:
        print(json.dumps({
            "passed": False,
            "skills_tested": tested,
            "failures": failures,
            "details": details,
        }, indent=2))
        sys.exit(1)
    else:
        output_json({
            "passed": True,
            "skills_tested": tested,
            "details": details,
        })


def main():
    parser = argparse.ArgumentParser(description='Skill creator helper for jx-skill plugin')
    subparsers = parser.add_subparsers(dest='command')

    p_validate = subparsers.add_parser('validate-name')
    p_validate.add_argument('name')

    p_collision = subparsers.add_parser('check-collision')
    p_collision.add_argument('name')
    p_collision.add_argument('plugins_root')

    p_triggers = subparsers.add_parser('check-triggers')
    p_triggers.add_argument('triggers_csv')
    p_triggers.add_argument('plugins_root')

    p_scaffold = subparsers.add_parser('scaffold')
    p_scaffold.add_argument('name')
    p_scaffold.add_argument('plugin_path')
    p_scaffold.add_argument('--description', required=True)
    p_scaffold.add_argument('--triggers', required=True)
    p_scaffold.add_argument('--argument-hint', default='')

    p_list = subparsers.add_parser('list-skills')
    p_list.add_argument('plugins_root')

    p_test = subparsers.add_parser('self-test')
    p_test.add_argument('plugins_root')

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        sys.exit(1)

    dispatch = {
        'validate-name': cmd_validate_name,
        'check-collision': cmd_check_collision,
        'check-triggers': cmd_check_triggers,
        'scaffold': cmd_scaffold,
        'list-skills': cmd_list_skills,
        'self-test': cmd_self_test,
    }

    dispatch[args.command](args)


if __name__ == '__main__':
    main()
