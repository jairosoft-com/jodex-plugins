#!/usr/bin/env python3
"""
read-doc.py — Pinned, READ-ONLY helper for reading markdown documents.

Subcommands:
  read <path>    Read a .md file and print its text to stdout

The path is validated: must be a single token ending in .md, must not contain
shell metacharacters, and must be an existing file. This helper has NO write,
fork, append, or other mutating subcommand of any kind.
"""

import sys
import os
import re

SHELL_META = re.compile(r'[;|&`$(){}!\\\n\r]')
ALLOWED_EXT = '.md'


def validate_path(path, must_exist=True):
    if SHELL_META.search(path):
        print(f"ERROR: path contains shell metacharacters: {path!r}", file=sys.stderr)
        sys.exit(1)
    if not path.lower().endswith(ALLOWED_EXT):
        print(f"ERROR: only .md files supported, got: {path!r}", file=sys.stderr)
        sys.exit(1)
    if must_exist and not os.path.isfile(path):
        print(f"ERROR: file not found: {path!r}", file=sys.stderr)
        sys.exit(1)
    # Confine reads to the project tree (reject ../ traversal / absolute escapes).
    real = os.path.realpath(path)
    cwd = os.path.realpath(os.getcwd())
    if real != cwd and not real.startswith(cwd + os.sep):
        print(f"ERROR: path escapes the project directory: {path!r}", file=sys.stderr)
        sys.exit(1)


def cmd_read(args):
    if len(args) != 1:
        print("Usage: read-doc.py read <file.md>", file=sys.stderr)
        sys.exit(1)
    doc_path = args[0]
    validate_path(doc_path, must_exist=True)

    with open(doc_path, 'r', encoding='utf-8') as f:
        sys.stdout.write(f.read())


COMMANDS = {
    'read': cmd_read,
}


def main():
    if len(sys.argv) < 2 or sys.argv[1] not in COMMANDS:
        print(f"Usage: read-doc.py <{'|'.join(COMMANDS)}> [args...]", file=sys.stderr)
        sys.exit(1)
    COMMANDS[sys.argv[1]](sys.argv[2:])


if __name__ == '__main__':
    main()
