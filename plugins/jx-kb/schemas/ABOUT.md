# Schemas

JSON Schema files defining structured output contracts for commands and skills.

## Format

Standard JSON Schema (draft-07 or later):

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": ["field1", "field2"],
  "properties": {
    "field1": { "type": "string" },
    "field2": { "type": "number" }
  }
}
```

## When to use

- Validate wiki page frontmatter structure
- Type lint report output for programmatic consumption
- Define ingest plan table schema

## Note

This directory is for JSON Schema validation files for the jx-kb plugin's structured outputs.
The wiki's own configuration document (`_schema.md`) lives in the user's wiki directory, not here.

## Reference

See jx-qa plugin's `schemas/ABOUT.md` for format details.
