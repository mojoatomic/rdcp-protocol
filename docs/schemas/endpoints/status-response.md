# Status Response Schema

Defines the response body for `GET /rdcp/v1/status`.

- Canonical: https://mojoatomic.github.io/rdcp-protocol/schema/v1/endpoints/status-response.json
- Repository: schema/v1/endpoints/status-response.json

Key fields
- protocol, timestamp, enabled
- categories: map of categoryName -> boolean
- performance: callsTotal, callsPerSecond

Sample response

```json
{
  "protocol": "rdcp/1.0",
  "timestamp": "2025-09-17T10:30:00Z",
  "enabled": true,
  "categories": { "DATABASE": true, "API_ROUTES": false },
  "performance": { "callsTotal": 45678, "callsPerSecond": 2.3 }
}
```