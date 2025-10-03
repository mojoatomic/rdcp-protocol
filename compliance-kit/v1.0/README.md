# RDCP Compliance Kit (v1.0)

This kit helps implementers validate conformance to the RDCP v1.0 protocol using portable JSON fixtures and curl. It is language‑agnostic and versioned with the protocol.

What you can do now (Phase 1)
- Validate that example responses conform to the published JSON Schemas
- Send critical positive and negative requests to your server using curl
- Run a simple behavior sequence: enable a category then verify status

Setup
- Choose your base URL: export BASE_URL=https://localhost:3000
- Choose auth (one):
  - export RDCP_API_KEY=rdcp_dev_basic_XXXX   # API key
  - or export RDCP_BEARER_TOKEN=...           # Bearer token (JWT)
- Optional tenant: export TENANT_ID=acme-dev

Quick checks (curl)
```bash
# Well‑known
curl -fsS -H 'Accept: application/json' "$BASE_URL/.well-known/rdcp" | jq .

# Discovery
curl -fsS -H 'Accept: application/json' -H "X-RDCP-Tenant-ID: ${TENANT_ID:-acme-dev}" \
  "$BASE_URL/rdcp/v1/discovery" | jq .

# Control enable
curl -fsS -X POST "$BASE_URL/rdcp/v1/control" \
  -H 'Content-Type: application/json' \
  -H "X-RDCP-API-Key: ${RDCP_API_KEY}" \
  --data @fixtures/control/request-enable-valid.json | jq .

# Status
curl -fsS -H 'Accept: application/json' -H "X-RDCP-API-Key: ${RDCP_API_KEY}" \
  "$BASE_URL/rdcp/v1/status" | jq .
```

Behavior sequence: enable‑and‑verify
- See sequences/enable-and-verify.json for the two calls and expected outcome (DATABASE=true in status).

Validating fixtures (CI or local)
- This repo includes a workflow to validate fixtures against schemas.
- Locally, run:
```bash
node scripts/validate-fixtures.js
```

Notes
- Fixtures are examples; server responses may include additional fields. Conformance focuses on status codes and required fields/shapes.
- Negative cases check that invalid inputs are rejected with appropriate error status and ErrorResponse envelope.
