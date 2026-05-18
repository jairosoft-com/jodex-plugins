#!/usr/bin/env python3
"""Merge ado_sync data into PRD YAML frontmatter (atomic write). Stdlib only."""
import json, os, re, sys, tempfile

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

def yaml_val(v):
    if isinstance(v, bool):
        return "true" if v else "false"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, dict):
        return None
    s = str(v)
    if any(c in s for c in ":{}\n[]#&*!|>',\"@`"):
        return json.dumps(s)
    return s

def render_ado_sync(data, indent=2):
    lines = []
    prefix = " " * indent
    for k, v in data.items():
        if isinstance(v, dict):
            lines.append(f"{prefix}{k}:")
            for sk, sv in v.items():
                rendered = yaml_val(sv)
                if rendered is not None:
                    lines.append(f"{prefix}  {sk}: {rendered}")
                elif isinstance(sv, dict):
                    lines.append(f"{prefix}  {sk}:")
                    for ssk, ssv in sv.items():
                        lines.append(f"{prefix}    {ssk}: {yaml_val(ssv)}")
        else:
            rendered = yaml_val(v)
            if rendered is not None:
                lines.append(f"{prefix}{k}: {rendered}")
    return "\n".join(lines)

if match:
    fm_text = match.group(1)
    body = content[match.end():]
    ado_re = re.compile(r"^ado_sync:\n(?:  .*\n)*", re.MULTILINE)
    ado_match = ado_re.search(fm_text)

    new_ado = "ado_sync:\n" + render_ado_sync(ado_data) + "\n"

    if ado_match:
        fm_text = fm_text[:ado_match.start()] + new_ado + fm_text[ado_match.end():]
    else:
        fm_text = fm_text + new_ado
    output = f"---\n{fm_text}---\n{body}"
else:
    fm_text = "ado_sync:\n" + render_ado_sync(ado_data) + "\n"
    output = f"---\n{fm_text}---\n{content}"

dir_name = os.path.dirname(os.path.abspath(prd_path))
fd, tmp = tempfile.mkstemp(dir=dir_name, suffix=".tmp")
try:
    with os.fdopen(fd, "w", encoding="utf-8") as f:
        f.write(output)
    os.replace(tmp, prd_path)
except Exception:
    os.unlink(tmp)
    raise

print(json.dumps(ado_data))
