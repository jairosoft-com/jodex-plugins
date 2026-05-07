#!/usr/bin/env python3
"""
wiki-tools.py — Pinned helper for LLM Wiki operations.

Subcommands:
  snapshot <source_path> <wiki_path>   Copy source into wiki/raw/sources/<sha256_prefix>-<filename>
  fingerprint <file_path>              Compute SHA-256 hash + size without copying
  orphans <wiki_path>                  Pages with zero inbound wikilinks
  broken-links <wiki_path>             Wikilinks pointing to non-existent pages
  backlinks <wiki_path>                Full backlink map {page: [pages linking to it]}
  wikilinks <path>                     Extract all [[wikilinks]] from file or directory
  frontmatter-check <wiki_path>        Pages with missing/malformed YAML frontmatter
  page-list <wiki_path>                All .md pages (excluding _-prefixed system files)

All paths validated: must be within project root, no shell metacharacters.
Stdlib-only — no external dependencies.
"""

import sys
import os
import re
import json
import hashlib
import shutil
from pathlib import Path

SHELL_META = re.compile(r'[;|&`$(){}!\\\n\r]')
WIKILINK_RE = re.compile(r'\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?]]')
FRONTMATTER_RE = re.compile(r'^---\s*\n(.*?)\n---\s*\n', re.DOTALL)
FENCED_BLOCK_RE = re.compile(r'```[^\n]*\n.*?\n```', re.DOTALL)
REQUIRED_FRONTMATTER = {'title', 'type', 'tags', 'created', 'updated'}


def validate_path(path):
    if SHELL_META.search(path):
        print(json.dumps({"error": f"path contains shell metacharacters: {path!r}"}))
        sys.exit(1)


def confine_to_project_root(user_path):
    candidate = Path(user_path).resolve()
    project_root = Path.cwd().resolve()
    try:
        candidate.relative_to(project_root)
    except ValueError:
        print(json.dumps({"error": f"path escapes project root: {str(candidate)}"}))
        sys.exit(1)
    return candidate


def sha256_file(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            h.update(chunk)
    return h.hexdigest()


def extract_wikilinks_from_text(text):
    without_fenced = FENCED_BLOCK_RE.sub('', text)
    return list(set(WIKILINK_RE.findall(without_fenced)))


def extract_frontmatter(text):
    m = FRONTMATTER_RE.match(text)
    if not m:
        return None
    raw = m.group(1)
    fields = {}
    for line in raw.split('\n'):
        line = line.strip()
        if ':' in line:
            key, _, val = line.partition(':')
            fields[key.strip()] = val.strip()
    return fields


def get_wiki_pages(wiki_path):
    pages = {}
    for root, _, files in os.walk(str(wiki_path)):
        for f in files:
            if f.endswith('.md') and not f.startswith('_'):
                full = Path(root) / f
                rel = full.relative_to(wiki_path)
                name = f[:-3]
                pages[name] = str(rel)
    return pages


def cmd_snapshot(args):
    if len(args) != 2:
        print(json.dumps({"error": "Usage: wiki-tools.py snapshot <source_path> <wiki_path>"}))
        sys.exit(1)
    source_path, wiki_path = args
    validate_path(source_path)
    validate_path(wiki_path)
    source = confine_to_project_root(source_path)
    wiki = confine_to_project_root(wiki_path)

    if not source.is_file():
        print(json.dumps({"error": f"source not found: {str(source)}"}))
        sys.exit(1)

    raw_dir = wiki / 'raw' / 'sources'
    raw_dir.mkdir(parents=True, exist_ok=True)

    content_hash = sha256_file(source)
    prefix = content_hash[:8]
    dest_name = f"{prefix}-{source.name}"
    dest = raw_dir / dest_name

    if dest.exists():
        existing_hash = sha256_file(dest)
        if existing_hash == content_hash:
            print(json.dumps({
                "dest": str(dest),
                "sha256": content_hash,
                "size": dest.stat().st_size,
                "status": "already_exists"
            }))
            return

    shutil.copy2(str(source), str(dest))
    print(json.dumps({
        "dest": str(dest),
        "sha256": content_hash,
        "size": dest.stat().st_size,
        "status": "copied"
    }))


def cmd_fingerprint(args):
    if len(args) != 1:
        print(json.dumps({"error": "Usage: wiki-tools.py fingerprint <file_path>"}))
        sys.exit(1)
    file_path = args[0]
    validate_path(file_path)
    fp = confine_to_project_root(file_path)

    if not fp.is_file():
        print(json.dumps({"error": f"file not found: {str(fp)}"}))
        sys.exit(1)

    content_hash = sha256_file(fp)
    stat = fp.stat()
    print(json.dumps({
        "sha256": content_hash,
        "size": stat.st_size,
        "name": fp.name
    }))


def cmd_orphans(args):
    if len(args) != 1:
        print(json.dumps({"error": "Usage: wiki-tools.py orphans <wiki_path>"}))
        sys.exit(1)
    validate_path(args[0])
    wiki = confine_to_project_root(args[0])
    pages = get_wiki_pages(wiki)

    inbound = {name: set() for name in pages}

    for name, rel_path in pages.items():
        full = wiki / rel_path
        try:
            text = full.read_text(encoding='utf-8')
        except Exception:
            continue
        links = extract_wikilinks_from_text(text)
        for link in links:
            link_stripped = link.strip()
            if link_stripped in inbound:
                inbound[link_stripped].add(name)

    orphans = [name for name, refs in inbound.items() if len(refs) == 0]
    print(json.dumps(sorted(orphans)))


def cmd_broken_links(args):
    if len(args) != 1:
        print(json.dumps({"error": "Usage: wiki-tools.py broken-links <wiki_path>"}))
        sys.exit(1)
    validate_path(args[0])
    wiki = confine_to_project_root(args[0])
    pages = get_wiki_pages(wiki)
    page_names = set(pages.keys())

    broken = []
    for name, rel_path in pages.items():
        full = wiki / rel_path
        try:
            text = full.read_text(encoding='utf-8')
        except Exception:
            continue
        links = extract_wikilinks_from_text(text)
        for link in links:
            link_stripped = link.strip()
            if link_stripped not in page_names:
                broken.append({"source": name, "target": link_stripped})

    print(json.dumps(broken))


def cmd_backlinks(args):
    if len(args) != 1:
        print(json.dumps({"error": "Usage: wiki-tools.py backlinks <wiki_path>"}))
        sys.exit(1)
    validate_path(args[0])
    wiki = confine_to_project_root(args[0])
    pages = get_wiki_pages(wiki)

    backlink_map = {name: [] for name in pages}

    for name, rel_path in pages.items():
        full = wiki / rel_path
        try:
            text = full.read_text(encoding='utf-8')
        except Exception:
            continue
        links = extract_wikilinks_from_text(text)
        for link in links:
            link_stripped = link.strip()
            if link_stripped in backlink_map:
                backlink_map[link_stripped].append(name)

    for key in backlink_map:
        backlink_map[key] = sorted(set(backlink_map[key]))

    print(json.dumps(backlink_map))


def cmd_wikilinks(args):
    if len(args) != 1:
        print(json.dumps({"error": "Usage: wiki-tools.py wikilinks <path>"}))
        sys.exit(1)
    validate_path(args[0])
    target = confine_to_project_root(args[0])

    all_links = set()

    if target.is_file():
        try:
            text = target.read_text(encoding='utf-8')
            all_links.update(extract_wikilinks_from_text(text))
        except Exception:
            pass
    elif target.is_dir():
        for root, _, files in os.walk(str(target)):
            for f in files:
                if f.endswith('.md'):
                    full = Path(root) / f
                    try:
                        text = full.read_text(encoding='utf-8')
                        all_links.update(extract_wikilinks_from_text(text))
                    except Exception:
                        continue

    print(json.dumps(sorted(all_links)))


def cmd_frontmatter_check(args):
    if len(args) != 1:
        print(json.dumps({"error": "Usage: wiki-tools.py frontmatter-check <wiki_path>"}))
        sys.exit(1)
    validate_path(args[0])
    wiki = confine_to_project_root(args[0])
    pages = get_wiki_pages(wiki)

    issues = []
    for name, rel_path in pages.items():
        full = wiki / rel_path
        try:
            text = full.read_text(encoding='utf-8')
        except Exception:
            issues.append({"page": name, "path": str(rel_path), "issue": "unreadable"})
            continue

        fm = extract_frontmatter(text)
        if fm is None:
            issues.append({"page": name, "path": str(rel_path), "issue": "no frontmatter"})
            continue

        missing = REQUIRED_FRONTMATTER - set(fm.keys())
        if missing:
            issues.append({
                "page": name,
                "path": str(rel_path),
                "issue": "missing fields",
                "missing": sorted(missing)
            })

    print(json.dumps(issues))


def cmd_page_list(args):
    if len(args) != 1:
        print(json.dumps({"error": "Usage: wiki-tools.py page-list <wiki_path>"}))
        sys.exit(1)
    validate_path(args[0])
    wiki = confine_to_project_root(args[0])
    pages = get_wiki_pages(wiki)

    result = []
    for name, rel_path in sorted(pages.items()):
        result.append({"name": name, "path": str(rel_path)})

    print(json.dumps(result))


COMMANDS = {
    'snapshot': cmd_snapshot,
    'fingerprint': cmd_fingerprint,
    'orphans': cmd_orphans,
    'broken-links': cmd_broken_links,
    'backlinks': cmd_backlinks,
    'wikilinks': cmd_wikilinks,
    'frontmatter-check': cmd_frontmatter_check,
    'page-list': cmd_page_list,
}


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in COMMANDS:
        print(json.dumps({"error": f"Usage: wiki-tools.py <{'|'.join(sorted(COMMANDS))}> [args...]"}))
        sys.exit(1)
    COMMANDS[sys.argv[1]](sys.argv[2:])


if __name__ == '__main__':
    main()
