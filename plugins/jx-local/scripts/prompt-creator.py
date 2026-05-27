#!/usr/bin/env python3
"""Prompt file helper for jx-local:create-prompt skill.

Subcommands: validate-name, check-collision, list, write.
Stdlib-only. All subcommands resolve project root internally.
"""

import json
import os
import re
import subprocess
import sys
from pathlib import Path

NAME_RE = re.compile(r'^[a-z][a-z0-9]*(-[a-z0-9]+)*$')
TAG_RE = re.compile(r'^[a-z0-9]+(-[a-z0-9]+)*$')
MAX_NAME_LEN = 50
MAX_DESC_LEN = 200
PROMPTS_DIR = '.agent/prompts'


def resolve_root():
    try:
        result = subprocess.run(
            ['git', 'rev-parse', '--show-toplevel'],
            capture_output=True, text=True, timeout=5
        )
        if result.returncode == 0 and result.stdout.strip():
            return Path(result.stdout.strip())
    except (subprocess.TimeoutExpired, FileNotFoundError):
        pass
    return Path.cwd()


def prompts_dir():
    return resolve_root() / PROMPTS_DIR


def yaml_quote(value):
    escaped = value.replace("'", "''")
    return f"'{escaped}'"


def yaml_tags(tags):
    if not tags:
        return '[]'
    return '[' + ', '.join(yaml_quote(t) for t in tags) + ']'


def parse_frontmatter(filepath):
    try:
        text = filepath.read_text(encoding='utf-8')
    except (OSError, UnicodeDecodeError):
        return None
    lines = text.split('\n')
    if not lines or lines[0].strip() != '---':
        return None
    end = -1
    for i in range(1, len(lines)):
        if lines[i].strip() == '---':
            end = i
            break
    if end < 0:
        return None
    fm = {}
    for line in lines[1:end]:
        if ':' in line:
            key, _, val = line.partition(':')
            fm[key.strip()] = val.strip()
    name = fm.get('name', '').strip('\'"')
    desc = fm.get('description', '').strip('\'"')
    tags_raw = fm.get('tags', '[]')
    tags_raw = tags_raw.strip()
    if tags_raw.startswith('[') and tags_raw.endswith(']'):
        inner = tags_raw[1:-1]
        tags = [t.strip().strip('\'"') for t in inner.split(',') if t.strip()] if inner.strip() else []
    else:
        tags = []
    return {'name': name, 'description': desc, 'tags': tags}


def cmd_validate_name(args):
    if len(args) < 1:
        json.dump({'valid': False, 'name': '', 'error': 'no name provided'}, sys.stderr)
        print('', file=sys.stderr)
        return 1
    name = args[0]
    if len(name) > MAX_NAME_LEN:
        json.dump({'valid': False, 'name': name, 'error': f'exceeds {MAX_NAME_LEN} chars'}, sys.stderr)
        print('', file=sys.stderr)
        return 1
    if not NAME_RE.match(name):
        json.dump({'valid': False, 'name': name, 'error': 'must match ^[a-z][a-z0-9]*(-[a-z0-9]+)*$ (lowercase, hyphens between segments, no leading/trailing hyphens)'}, sys.stderr)
        print('', file=sys.stderr)
        return 1
    json.dump({'valid': True, 'name': name}, sys.stdout)
    print()
    return 0


def cmd_check_collision(args):
    if len(args) < 1:
        json.dump({'collision': True, 'name': '', 'path': ''}, sys.stderr)
        print('', file=sys.stderr)
        return 1
    name = args[0]
    target = prompts_dir() / f'{name}.md'
    if target.exists():
        json.dump({'collision': True, 'name': name, 'path': str(target.resolve())}, sys.stderr)
        print('', file=sys.stderr)
        return 1
    json.dump({'collision': False, 'name': name}, sys.stdout)
    print()
    return 0


def cmd_list(_args):
    pd = prompts_dir()
    results = []
    if pd.is_dir():
        for f in sorted(pd.glob('*.md')):
            fm = parse_frontmatter(f)
            if fm is None:
                print(f'WARNING: skipping {f.name}: malformed frontmatter', file=sys.stderr)
                continue
            results.append(fm)
    json.dump(results, sys.stdout, indent=2)
    print()
    return 0


def cmd_ensure_dir(_args):
    pd = prompts_dir()
    pd.mkdir(parents=True, exist_ok=True)
    json.dump({'path': str(pd.resolve())}, sys.stdout)
    print()
    return 0


def cmd_write(args):
    metadata_file = None
    body_file = None
    i = 0
    while i < len(args):
        if args[i] == '--metadata-file' and i + 1 < len(args):
            metadata_file = args[i + 1]
            i += 2
        elif args[i] == '--body-file' and i + 1 < len(args):
            body_file = args[i + 1]
            i += 2
        else:
            i += 1

    if not metadata_file or not body_file:
        _write_error('io', '--metadata-file and --body-file are required')
        return 1

    try:
        with open(metadata_file, 'r', encoding='utf-8') as f:
            metadata = json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        _write_error('io', f'cannot read metadata file: {e}')
        return 1

    try:
        with open(body_file, 'r', encoding='utf-8') as f:
            body = f.read()
    except OSError as e:
        _write_error('body-file', f'cannot read body file: {e}')
        return 1

    name = metadata.get('name', '')
    description = metadata.get('description', '')
    tags = metadata.get('tags', [])

    if not NAME_RE.match(name) or len(name) > MAX_NAME_LEN:
        _write_error('name', f'invalid name: must match ^[a-z][a-z0-9]*(-[a-z0-9]+)*$ and be <= {MAX_NAME_LEN} chars')
        return 1

    if not isinstance(description, str) or '\n' in description or len(description) > MAX_DESC_LEN:
        _write_error('description', f'must be single-line string, max {MAX_DESC_LEN} chars')
        return 1

    if not isinstance(tags, list):
        _write_error('tags', 'must be an array')
        return 1
    for tag in tags:
        if not isinstance(tag, str) or not TAG_RE.match(tag):
            _write_error('tags', f'invalid tag "{tag}": must match ^[a-z0-9]+(-[a-z0-9]+)*$')
            return 1

    root = resolve_root()
    pd = root / PROMPTS_DIR
    pd.mkdir(parents=True, exist_ok=True)

    target = pd / f'{name}.md'
    real_target = target.resolve()
    real_pd = pd.resolve()
    if not str(real_target).startswith(str(real_pd) + os.sep):
        _write_error('path-escape', f'resolved path {real_target} escapes prompts directory')
        return 1

    content = f'---\nname: {name}\ndescription: {yaml_quote(description)}\ntags: {yaml_tags(tags)}\n---\n\n{body}'
    if not content.endswith('\n'):
        content += '\n'

    tmp_path = pd / f'.{name}.{os.getpid()}.tmp'
    try:
        fd = os.open(str(tmp_path), os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o644)
        try:
            os.write(fd, content.encode('utf-8'))
        finally:
            os.close(fd)

        try:
            os.link(str(tmp_path), str(target))
        except FileExistsError:
            _write_error('collision', f'prompt already exists at {real_target}')
            return 1
        finally:
            try:
                os.unlink(str(tmp_path))
            except OSError:
                pass

    except FileExistsError:
        _write_error('io', f'temp file already exists: {tmp_path}')
        return 1
    except OSError as e:
        try:
            os.unlink(str(tmp_path))
        except OSError:
            pass
        _write_error('io', str(e))
        return 1

    for staging in (metadata_file, body_file):
        staging_path = Path(staging).resolve()
        if str(staging_path).startswith(str(real_pd) + os.sep) and staging_path.name.startswith('.'):
            try:
                os.unlink(str(staging_path))
            except OSError:
                pass

    json.dump({'created': True, 'path': str(real_target)}, sys.stdout)
    print()
    return 0


def _write_error(field, error):
    json.dump({'created': False, 'error': error, 'field': field}, sys.stderr)
    print('', file=sys.stderr)


def main():
    if len(sys.argv) < 2:
        print('Usage: prompt-creator.py <subcommand> [args]', file=sys.stderr)
        print('Subcommands: validate-name, check-collision, list, ensure-dir, write', file=sys.stderr)
        return 1

    cmd = sys.argv[1]
    args = sys.argv[2:]

    if cmd == 'validate-name':
        return cmd_validate_name(args)
    elif cmd == 'check-collision':
        return cmd_check_collision(args)
    elif cmd == 'list':
        return cmd_list(args)
    elif cmd == 'ensure-dir':
        return cmd_ensure_dir(args)
    elif cmd == 'write':
        return cmd_write(args)
    else:
        print(f'Unknown subcommand: {cmd}', file=sys.stderr)
        return 1


if __name__ == '__main__':
    sys.exit(main())
