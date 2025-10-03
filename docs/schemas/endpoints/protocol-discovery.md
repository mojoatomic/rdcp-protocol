# Protocol Discovery

The Protocol Discovery document is returned by the well-known endpoint `/.well-known/rdcp` and describes the RDCP protocol version, endpoint locations, capabilities, and security configuration.

- HTTP method: GET
- Path: `/.well-known/rdcp`
- Canonical: https://mojoatomic.github.io/rdcp-protocol/schema/v1/endpoints/protocol-discovery.json
- Repository: schema/v1/endpoints/protocol-discovery.json

## Example response

```json path=null start=null
{
  "protocol": "rdcp/1.0",
  "endpoints": {
    "discovery": "/rdcp/v1/discovery",
    "control": "/rdcp/v1/control",
    "status": "/rdcp/v1/status",
    "health": "/rdcp/v1/health"
  },
  "capabilities": {
    "multiTenancy": true,
    "performanceMetrics": true,
    "temporaryControls": true,
    "auditTrail": true
  },
  "security": {
    "level": "standard",
    "methods": ["api-key", "bearer"],
    "scopes": ["discovery", "status", "control", "admin"],
    "required": true,
    "keyRotation": true,
    "tokenRefresh": true
  }
}
```

## Validation

You can validate discovery responses using the JSON schema above with your preferred validator (e.g., AJV):

```bash path=null start=null
npx ajv -s schema/v1/endpoints/protocol-discovery.json -d discovery.json --valid
```
