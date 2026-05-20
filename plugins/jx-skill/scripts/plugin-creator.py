#!/usr/bin/env python3
"""
plugin-creator.py - Pinned helper for jx-skill:create-plugin operations.

Subcommands:
  validate-name <plugin>                                  Validate a plugin name
  check-collision <plugin> <repo_root>                    Check plugin and marketplace collisions
  scaffold <plugin> <repo_root> --description "..."      Create plugin skeleton and marketplace entry
      [--category productivity|knowledge|core] [--author "..."]
  verify <plugin> <repo_root>                             Verify scaffolded v1 artifacts

Stdlib-only. All generated paths are confined to the repository root.
"""

import argparse
import json
import os
import re
import shutil
import sys
from pathlib import Path

SHELL_META = re.compile(r'[;|&`$(){}!\\\n\r]')
PLUGIN_NAME_RE = re.compile(r'^jx-[a-z0-9]+(?:-[a-z0-9]+)*$')
VALID_CATEGORIES = {'productivity', 'knowledge', 'core'}
COMPONENT_DIRS = ['commands', 'skills', 'scripts', 'agents', 'hooks', 'prompts', 'schemas']
DEFAULT_AUTHOR = 'Jairosoft'
DEFAULT_CATEGORY = 'productivity'
DEFAULT_VERSION = '1.0.0'


def output_json(data):
    print(json.dumps(data, indent=2))
    sys.exit(0)


def output_error(message):
    print(json.dumps({"error": message}))
    sys.exit(1)


def validate_path_text(path_str):
    if SHELL_META.search(path_str):
        output_error(f"path contains shell metacharacters: {path_str!r}")


def validate_one_line(value, field_name, max_len=500):
    if value is None or not str(value).strip():
        output_error(f"{field_name} is required")
    text = str(value).strip()
    if any(ch in text for ch in ('\n', '\r')):
        output_error(f"{field_name} must be a single line")
    if len(text) > max_len:
        output_error(f"{field_name} exceeds {max_len} characters")
    return text


def validate_plugin_name(name):
    if not PLUGIN_NAME_RE.match(name):
        return False, "plugin name must match ^jx-[a-z0-9]+(?:-[a-z0-9]+)*$"
    return True, None


def resolve_repo_root(repo_root):
    validate_path_text(repo_root)
    root = Path(repo_root).resolve()
    if not root.is_dir():
        output_error(f"repo root not found: {str(root)}")
    marketplace = root / '.claude-plugin' / 'marketplace.json'
    plugins_dir = root / 'plugins'
    if not marketplace.is_file():
        output_error(f"marketplace not found: {str(marketplace)}")
    if not plugins_dir.is_dir():
        output_error(f"plugins directory not found: {str(plugins_dir)}")
    return root


def confine_under(base, candidate):
    resolved = Path(candidate).resolve()
    base_resolved = Path(base).resolve()
    try:
        resolved.relative_to(base_resolved)
    except ValueError:
        output_error(f"path escapes allowed root: {str(resolved)}")
    return resolved


def load_json(path):
    try:
        return json.loads(path.read_text(encoding='utf-8'))
    except json.JSONDecodeError as exc:
        output_error(f"invalid JSON in {str(path)}: {exc}")


def atomic_write_text(path, text):
    tmp_path = path.with_name(f'.{path.name}.tmp')
    try:
        tmp_path.write_text(text, encoding='utf-8')
        os.replace(str(tmp_path), str(path))
    finally:
        if tmp_path.exists():
            try:
                tmp_path.unlink()
            except OSError:
                pass


def atomic_write_json(path, data):
    atomic_write_text(path, json.dumps(data, indent=2) + '\n')


def marketplace_path(repo_root):
    return repo_root / '.claude-plugin' / 'marketplace.json'


def plugins_dir(repo_root):
    return repo_root / 'plugins'


def marketplace_source_for(plugin):
    return f'./plugins/{plugin}'


def source_resolves_to(source, repo_root, plugin):
    if not isinstance(source, str) or not source:
        return False
    expected = (repo_root / 'plugins' / plugin).resolve()
    candidate = (repo_root / source).resolve()
    return candidate == expected


def find_collisions(plugin, repo_root):
    collisions = []
    plugin_dir = plugins_dir(repo_root) / plugin

    if plugin_dir.exists():
        collisions.append({
            "type": "plugin_directory",
            "path": str(plugin_dir),
        })

    marketplace = load_json(marketplace_path(repo_root))
    validate_marketplace_shape(marketplace)
    for index, entry in enumerate(marketplace.get('plugins', [])):
        if entry.get('name') == plugin:
            collisions.append({
                "type": "marketplace_name",
                "index": index,
                "source": entry.get('source'),
            })
        if source_resolves_to(entry.get('source'), repo_root, plugin):
            collisions.append({
                "type": "marketplace_source",
                "index": index,
                "name": entry.get('name'),
                "source": entry.get('source'),
            })

    return collisions


def expected_files(plugin):
    files = {
        '.claude-plugin/plugin.json',
        'README.md',
    }
    files.update(f'{component}/ABOUT.md' for component in COMPONENT_DIRS)
    return files


def about_text(plugin, component):
    create_command = f'/jx-skill:create --plugin {plugin}'
    texts = {
        'commands': (
            '# Commands\n\n'
            'User-facing slash command wrappers for this plugin.\n\n'
            f'Add the first command by creating a skill with `{create_command}`.\n'
        ),
        'skills': (
            '# Skills\n\n'
            'Skill folders with SKILL.md instructions and optional evals.\n\n'
            f'Add the first skill with `{create_command}`.\n'
        ),
        'scripts': (
            '# Scripts\n\n'
            'Pinned helper scripts used by commands and skills. Keep permissions narrow and prefer stdlib-only helpers when practical.\n'
        ),
        'agents': (
            '# Agents\n\n'
            'Optional custom subagents with their own prompts, model choices, and tool restrictions.\n'
        ),
        'hooks': (
            '# Hooks\n\n'
            'Optional lifecycle hooks for this plugin.\n'
        ),
        'prompts': (
            '# Prompts\n\n'
            'Optional reusable prompt fragments for this plugin.\n'
        ),
        'schemas': (
            '# Schemas\n\n'
            'Optional JSON Schema files or other structured contracts for this plugin.\n'
        ),
    }
    return texts[component]


def readme_text(plugin, description, category, author):
    return f"""# {plugin}

{description}

## Status

This is a plugin skeleton. It contains package metadata, placeholder component directories, and a marketplace entry only.

## Next Step

Add the first real skill with:

```bash
/jx-skill:create --plugin {plugin}
```

## Local Development

```bash
claude --plugin-dir /path/to/jodex-plugins/plugins/{plugin}
claude plugin marketplace add /path/to/jodex-plugins --scope project
claude plugin install {plugin}@jodex-plugins
```

## Metadata

- Category: {category}
- Author: {author}
"""


def write_plugin_skeleton(staging_dir, plugin, description, category, author):
    plugin_json = {
        "name": plugin,
        "version": DEFAULT_VERSION,
        "description": description,
        "author": {
            "name": author,
        },
    }

    manifest_dir = staging_dir / '.claude-plugin'
    manifest_dir.mkdir(parents=True)
    (manifest_dir / 'plugin.json').write_text(json.dumps(plugin_json, indent=2) + '\n', encoding='utf-8')

    (staging_dir / 'README.md').write_text(
        readme_text(plugin, description, category, author),
        encoding='utf-8',
    )

    for component in COMPONENT_DIRS:
        component_dir = staging_dir / component
        component_dir.mkdir(parents=True)
        (component_dir / 'ABOUT.md').write_text(about_text(plugin, component), encoding='utf-8')


def validate_marketplace_shape(data):
    if not isinstance(data, dict):
        output_error("marketplace JSON must be an object")
    plugins = data.get('plugins')
    if not isinstance(plugins, list):
        output_error("marketplace JSON must contain a plugins array")


def append_marketplace_entry(repo_root, plugin, description, category, author):
    path = marketplace_path(repo_root)
    data = load_json(path)
    validate_marketplace_shape(data)
    data['plugins'].append({
        "name": plugin,
        "description": description,
        "author": {
            "name": author,
        },
        "category": category,
        "source": marketplace_source_for(plugin),
    })
    atomic_write_json(path, data)


def cmd_validate_name(args):
    valid, error = validate_plugin_name(args.plugin)
    if not valid:
        output_json({"valid": False, "error": error})
    output_json({"valid": True, "plugin": args.plugin})


def cmd_check_collision(args):
    valid, error = validate_plugin_name(args.plugin)
    if not valid:
        output_error(error)
    root = resolve_repo_root(args.repo_root)
    collisions = find_collisions(args.plugin, root)
    output_json({
        "collision": bool(collisions),
        "collisions": collisions,
    })


def cmd_scaffold(args):
    plugin = args.plugin
    valid, error = validate_plugin_name(plugin)
    if not valid:
        output_error(error)

    root = resolve_repo_root(args.repo_root)
    description = validate_one_line(args.description, 'description')
    author = validate_one_line(args.author or DEFAULT_AUTHOR, 'author', max_len=120)
    category = args.category or DEFAULT_CATEGORY
    if category not in VALID_CATEGORIES:
        output_error(f"category must be one of: {', '.join(sorted(VALID_CATEGORIES))}")

    validate_marketplace_shape(load_json(marketplace_path(root)))
    collisions = find_collisions(plugin, root)
    if collisions:
        output_error(f"plugin collision detected: {json.dumps(collisions)}")

    root_plugins = plugins_dir(root)
    target_dir = confine_under(root, root_plugins / plugin)
    staging_dir = confine_under(root, root_plugins / f'.plugin-scaffold-tmp-{plugin}')
    if staging_dir.exists():
        output_error(f"staging directory already exists: {str(staging_dir)}")

    marketplace_file = marketplace_path(root)
    marketplace_original = marketplace_file.read_text(encoding='utf-8')
    target_created = False
    marketplace_written = False

    try:
        staging_dir.mkdir(parents=True)
        write_plugin_skeleton(staging_dir, plugin, description, category, author)

        shutil.move(str(staging_dir), str(target_dir))
        target_created = True

        append_marketplace_entry(root, plugin, description, category, author)
        marketplace_written = True

        verification = verify_scaffold(plugin, root)
        if verification['errors']:
            raise RuntimeError(f"verification failed: {verification['errors']}")

        output_json({
            "success": True,
            "plugin": plugin,
            "files_created": [str(target_dir / rel) for rel in sorted(expected_files(plugin))],
            "marketplace_updated": str(marketplace_file),
        })
    except Exception as exc:
        rolled_back = []
        if marketplace_written:
            try:
                atomic_write_text(marketplace_file, marketplace_original)
                rolled_back.append(str(marketplace_file))
            except Exception:
                pass
        if target_created and target_dir.exists():
            try:
                shutil.rmtree(str(target_dir))
                rolled_back.append(str(target_dir))
            except Exception:
                pass
        if staging_dir.exists():
            try:
                shutil.rmtree(str(staging_dir))
                rolled_back.append(str(staging_dir))
            except Exception:
                pass
        print(json.dumps({
            "success": False,
            "error": str(exc),
            "rolled_back": rolled_back,
        }, indent=2))
        sys.exit(1)


def verify_scaffold(plugin, repo_root):
    errors = []
    root_plugins = plugins_dir(repo_root)
    plugin_dir = confine_under(repo_root, root_plugins / plugin)
    expected = expected_files(plugin)

    if not plugin_dir.is_dir():
        return {"valid": False, "errors": [f"plugin directory missing: {str(plugin_dir)}"]}

    actual = set()
    for path in plugin_dir.rglob('*'):
        if path.is_file():
            actual.add(str(path.relative_to(plugin_dir)))

    missing = sorted(expected - actual)
    unexpected = sorted(actual - expected)
    if missing:
        errors.append({"missing_files": missing})
    if unexpected:
        errors.append({"unexpected_files": unexpected})

    manifest_path = plugin_dir / '.claude-plugin' / 'plugin.json'
    if manifest_path.is_file():
        manifest = load_json(manifest_path)
        if manifest.get('name') != plugin:
            errors.append({"manifest_name": manifest.get('name')})
        if not manifest.get('description'):
            errors.append("manifest description is missing")
        author = manifest.get('author')
        if not isinstance(author, dict) or not author.get('name'):
            errors.append("manifest author.name is missing")

    marketplace = load_json(marketplace_path(repo_root))
    entries = [
        entry for entry in marketplace.get('plugins', [])
        if entry.get('name') == plugin or source_resolves_to(entry.get('source'), repo_root, plugin)
    ]
    exact_entries = [
        entry for entry in entries
        if entry.get('name') == plugin and entry.get('source') == marketplace_source_for(plugin)
    ]
    if len(exact_entries) != 1:
        errors.append({"marketplace_entries": entries})
    else:
        entry = exact_entries[0]
        if entry.get('category') not in VALID_CATEGORIES:
            errors.append({"marketplace_category": entry.get('category')})
        author = entry.get('author')
        if not isinstance(author, dict) or not author.get('name'):
            errors.append("marketplace author.name is missing")

    return {
        "valid": not errors,
        "plugin": plugin,
        "errors": errors,
        "expected_files": sorted(expected),
    }


def cmd_verify(args):
    valid, error = validate_plugin_name(args.plugin)
    if not valid:
        output_error(error)
    root = resolve_repo_root(args.repo_root)
    result = verify_scaffold(args.plugin, root)
    if result['valid']:
        output_json(result)
    print(json.dumps(result, indent=2))
    sys.exit(1)


def main():
    parser = argparse.ArgumentParser(description='Plugin creator helper for jx-skill plugin')
    subparsers = parser.add_subparsers(dest='command')

    p_validate = subparsers.add_parser('validate-name')
    p_validate.add_argument('plugin')

    p_collision = subparsers.add_parser('check-collision')
    p_collision.add_argument('plugin')
    p_collision.add_argument('repo_root')

    p_scaffold = subparsers.add_parser('scaffold')
    p_scaffold.add_argument('plugin')
    p_scaffold.add_argument('repo_root')
    p_scaffold.add_argument('--description', required=True)
    p_scaffold.add_argument('--category', default=DEFAULT_CATEGORY)
    p_scaffold.add_argument('--author', default=DEFAULT_AUTHOR)

    p_verify = subparsers.add_parser('verify')
    p_verify.add_argument('plugin')
    p_verify.add_argument('repo_root')

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        sys.exit(1)

    dispatch = {
        'validate-name': cmd_validate_name,
        'check-collision': cmd_check_collision,
        'scaffold': cmd_scaffold,
        'verify': cmd_verify,
    }
    dispatch[args.command](args)


if __name__ == '__main__':
    main()
