#!/usr/bin/env python3
import hashlib, re, sys

if len(sys.argv) < 2:
    print("Usage: feedback-fingerprint.py <file>", file=sys.stderr)
    sys.exit(1)

with open(sys.argv[1], encoding="utf-8") as f:
    text = f.read()

normalized = re.sub(r"\s+", " ", text.strip()).lower()
print(hashlib.sha256(normalized.encode("utf-8")).hexdigest())
