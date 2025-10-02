# Error Response Schema

Defines the standard error response envelope used across endpoints.

- Canonical: https://mojoatomic.github.io/rdcp-protocol/schema/v1/responses/error.json
- Repository: schema/v1/responses/error.json

Key fields
- error: { code, message, details?, protocol }

Sample response

```json
{
  "error": {
    "code": "RDCP_VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": { "field": "categories" },
    "protocol": "rdcp/1.0"
  }
}
```
