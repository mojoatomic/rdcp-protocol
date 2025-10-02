# Control Response Schema

Defines the response body for `POST /rdcp/v1/control`.

- Canonical: https://mojoatomic.github.io/rdcp-protocol/schema/v1/endpoints/control-response.json
- Repository: schema/v1/endpoints/control-response.json

Key fields
- protocol, timestamp, action, categories, status, message
- changes[]: category, previousState, newState, temporary, effectiveAt, expiresAt

Sample response

```json
{
  "protocol": "rdcp/1.0",
  "timestamp": "2025-09-17T10:30:00Z",
  "action": "enable",
  "categories": ["DATABASE"],
  "status": "success",
  "message": "Enabled categories",
  "changes": [
    {
      "category": "DATABASE",
      "previousState": false,
      "newState": true,
      "temporary": true,
      "effectiveAt": "2025-09-17T10:30:00Z",
      "expiresAt": "2025-09-17T10:45:00Z"
    }
  ]
}
```
