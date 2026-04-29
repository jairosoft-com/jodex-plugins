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

- Validate command outputs (e.g., extract classification results)
- Type structured review results
- Define test plan row structure for programmatic validation

## Reference

See Codex plugin's `schemas/review-output.schema.json` for a working example.
