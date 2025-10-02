# Health Response Schema

Defines the response body for `GET /rdcp/v1/health`.

- Canonical: https://mojoatomic.github.io/rdcp-protocol/schema/v1/endpoints/health-response.json
- Repository: schema/v1/endpoints/health-response.json

Key fields
- protocol, timestamp, status: "healthy" | "degraded" | "unhealthy"
- checks[]: name, status, duration

Sample response

```json
{
  "protocol": "rdcp/1.0",
  "timestamp": "2025-09-17T10:30:00Z",
  "status": "healthy",
  "checks": [
    { "name": "redis", "status": "pass", "duration": "5ms" },
    { "name": "db", "status": "pass", "duration": "8ms" }
  ]
}
```