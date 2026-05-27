# jx-local

this is a plugin to create local skills and local prompts in the user's project directory.

## Status

This is a plugin skeleton. It contains package metadata, placeholder component directories, and a marketplace entry only.

## Next Step

Add the first real skill with:

```bash
/jx-plugin:create-skill --plugin jx-local
```

## Local Development

```bash
claude --plugin-dir /path/to/jodex-plugins/plugins/jx-local
claude plugin marketplace add /path/to/jodex-plugins --scope project
claude plugin install jx-local@jodex-plugins
```

## Metadata

- Category: productivity
- Author: ramon
