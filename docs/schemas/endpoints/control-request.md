# Control Request Schema

Defines the request body for `POST /rdcp/v1/control`.

- Canonical: https://mojoatomic.github.io/rdcp-protocol/schema/v1/endpoints/control-request.json
- Repository: schema/v1/endpoints/control-request.json

Key fields
- action: "enable" | "disable" | "toggle" | "reset" | "status"
- categories: string or array of categoryName
- options: { temporary, duration, reason }

Sample request

```json
{
  "action": "enable",
  "categories": ["DATABASE", "API_ROUTES"],
  "options": { "temporary": true, "duration": "15m", "reason": "Investigating issue" }
}
```

Validation tip
- Use the common schema first to satisfy `$ref` resolutions, then compile this schema.
