# API Documentation

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0) · [Download OpenAPI v1 (JSON)](v1/openapi.json)

Use one of these views:
- [API Reference](reference.md) — clean, readable documentation
- [API Playground](playground.md) — interactive "Try it out" testing

Both views use the same OpenAPI specification: [openapi.json](v1/openapi.json)

---

## Quick start

Want to test RDCP quickly?

1) Choose your server URL (hostname + port) where RDCP endpoints are exposed. Example: `rdcp.example.com:8080` or `localhost:3000`.
2) Open the [API Playground](playground.md). In the top Server selector, set the server to `https://{hostname}` and enter your host value for the `hostname` variable.
3) Try Discovery:

```bash
# Replace HOST with your server hostname:port
HOST=localhost:3000
curl -fsS -H 'Accept: application/json' "https://$HOST/.well-known/rdcp"
```

4) List categories:

```bash
HOST=localhost:3000
TENANT=acme-dev     # omit if not using multi-tenancy
curl -fsS -H 'Accept: application/json' -H "X-RDCP-Tenant-ID: $TENANT" "https://$HOST/rdcp/v1/discovery"
```

5) Enable a category temporarily (15 minutes):

```bash
HOST=localhost:3000
TENANT=acme-dev
curl -fsS -X POST "https://$HOST/rdcp/v1/control" \
  -H 'Content-Type: application/json' \
  -H "X-RDCP-Tenant-ID: $TENANT" \
  --data '{"action":"enable","categories":["DATABASE"],"options":{"temporary":true,"duration":"15m"}}'
```

6) Check status:

```bash
HOST=localhost:3000
TENANT=acme-dev
curl -fsS -H 'Accept: application/json' -H "X-RDCP-Tenant-ID: $TENANT" "https://$HOST/rdcp/v1/status"
```

## Authentication setup

RDCP supports multiple security levels. For basic testing, use one of:

- API Key (Basic):
  - Header: `X-RDCP-API-Key: rdcp_dev_basic_XXXX`
  - Example:
    ```bash
    curl -fsS -H 'X-RDCP-API-Key: rdcp_dev_basic_XXXX' "https://$HOST/rdcp/v1/status"
    ```
- Bearer Token (Standard):
  - Header: `Authorization: Bearer <JWT>`
  - Example:
    ```bash
    curl -fsS -H 'Authorization: Bearer eyJhbGciOi...' "https://$HOST/rdcp/v1/status"
    ```

Consult your deployment for how to provision keys/tokens. For multi-tenant setups, add `X-RDCP-Tenant-ID` as shown in the examples.

## Common use cases

- Testing discovery endpoint — [Playground](playground.md) (GET `/.well-known/rdcp`, GET `/rdcp/v1/discovery`)
- Enabling debug categories — [Playground](playground.md) (POST `/rdcp/v1/control`)
- Checking status — [Playground](playground.md) (GET `/rdcp/v1/status`)
- Health checks — [Playground](playground.md) (GET `/rdcp/v1/health`)

## Troubleshooting

- CORS in browsers: If the Playground runs in your browser and your RDCP server is on a different origin, enable CORS on the server (allow `GET, POST` for the RDCP paths; allow headers `Authorization, X-RDCP-API-Key, X-RDCP-Tenant-ID, Content-Type`).
- 401/403 errors: Ensure your API key or bearer token is valid and your scopes allow the operation.
- 404 category not found: Verify the category exists in `/rdcp/v1/discovery` and that the name matches exactly (e.g., `DATABASE`).
- "Loading…" stuck in Reference: ensure the spec is reachable at `../v1/openapi.json` from the Reference page (it is preconfigured); hard refresh can help bypass caches.

---

Licensed under the Apache License, Version 2.0. You may obtain a copy at http://www.apache.org/licenses/LICENSE-2.0
