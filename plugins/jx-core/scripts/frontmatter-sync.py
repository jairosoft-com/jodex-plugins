#!/usr/bin/env python3
"""Merge ado_sync data into PRD YAML frontmatter (atomic write)."""
import json, os, re, sys, tempfile, yaml

if len(sys.argv) < 3:
    print("Usage: frontmatter-sync.py <prd-path> <ado-sync-json>", file=sys.stderr)
    sys.exit(1)

prd_path = sys.argv[1]
try:
    ado_data = json.loads(sys.argv[2])
except json.JSONDecodeError as e:
    print(f"Invalid JSON: {e}", file=sys.stderr)
    sys.exit(1)

with open(prd_path, encoding="utf-8") as f:
    content = f.read()

FM_RE = re.compile(r"^---\n(.*?\n)---\n", re.DOTALL)
match = FM_RE.match(content)

if match:
    fm = yaml.safe_load(match.group(1)) or {}
    body = content[match.end():]
else:
    fm = {}
    body = content

existing = fm.get("ado_sync", {})
if isinstance(existing, dict):
    existing.update(ado_data)
else:
    existing = ado_data
fm["ado_sync"] = existing

new_fm = yaml.dump(fm, default_flow_style=False, sort_keys=False, allow_unicode=True)
output = f"---\n{new_fm}---\n{body}"

dir_name = os.path.dirname(os.path.abspath(prd_path))
fd, tmp = tempfile.mkstemp(dir=dir_name, suffix=".tmp")
try:
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        f.write(output)
    os.replace(tmp, prd_path)
except Exception:
    os.unlink(tmp)
    raise

print(json.dumps(fm.get("ado_sync", {})))
