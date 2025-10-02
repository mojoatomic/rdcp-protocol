# Discovery Response Schema

Defines the response body for `GET /rdcp/v1/discovery`.

- Canonical: https://mojoatomic.github.io/rdcp-protocol/schema/v1/endpoints/discovery-response.json
- Repository: schema/v1/endpoints/discovery-response.json

Key fields
- protocol, timestamp
- categories[]: name, description, enabled, temporary, metrics
- performance: totalCalls, callsPerSecond, categoryBreakdown

Sample response

```json
{
  "protocol": "rdcp/1.0",
  "timestamp": "2025-09-17T10:30:00Z",
  "categories": [
    {
      "name": "DATABASE",
      "description": "Database operations",
      "enabled": true,
      "temporary": false,
      "metrics": { "callsTotal": 1234, "callsPerSecond": 2.3 }
    }
  ],
  "performance": {
    "totalCalls": 45678,
    "callsPerSecond": 2.3,
    "categoryBreakdown": { "DATABASE": 1234 }
  }
}
```