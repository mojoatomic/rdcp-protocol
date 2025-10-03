# RDCP OpenAPI (v1)

This page renders the RDCP OpenAPI contract for version 1.

!!! note "Multi-tenancy header and server hostname"
    - X-RDCP-Tenant-ID: Optional header used in multi-tenant deployments to scope discovery, control, status and metrics to a specific tenant.
    - Format: an opaque string up to 255 chars matching `^[a-zA-Z0-9._-]{1,255}$`.
    - Supported endpoints: `/rdcp/v1/discovery`, `/rdcp/v1/control`, `/rdcp/v1/status`, `/rdcp/v1/metrics`.
    - Servers: the spec defines a templated server `https://{hostname}` with default `localhost:3000`. Replace `{hostname}` with your deployment's host.

```redoc
spec-url: ./v1/openapi.json
hide-download-button: true
```

Example (curl):

```bash path=null start=null
HOST=rdcp.example.com
TENANT=acme-prod
curl -fsS \
  -H "X-RDCP-Tenant-ID: $TENANT" \
  "https://$HOST/rdcp/v1/status"
```
