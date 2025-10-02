# Common Definitions

Shared type definitions used across endpoint schemas.

- Canonical: https://mojoatomic.github.io/rdcp-protocol/schema/v1/common/rdcp-common.json
- Repository: schema/v1/common/rdcp-common.json

This schema defines reusable elements such as:
- protocolVersion (const: "rdcp/1.0")
- timestamp (ISO 8601)
- categoryName (uppercase + underscores)
- tenantContext (id, isolationLevel, scope)
- securityLevel, authMethod
- metrics (callsTotal, callsPerSecond)

Example usage (Node + Ajv):

```javascript
// Load and add the common schema by its canonical $id first
```
