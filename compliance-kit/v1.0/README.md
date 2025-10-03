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

## Running Validation Locally
```bash
# Install dependencies
npm install

# Validate all fixtures
node scripts/validate-fixtures.js
```
If validation fails, check:
- Fixture conforms to schema structure
- Error codes match defined values in error-codes.md
- Field names match exactly (e.g., callsTotal not totalCalls)

**Skip:**
- Detailed AJV configuration docs (implementation detail)
- JSON linting workflow (nice-to-have, not essential)
- Heavy CONTRIBUTING guide (you don't have external contributors yet)

**The compliance kit needs:**
- README with "how to use" (curl examples, validation)
- MANIFEST.json explaining test expectations
- Clear fixture organization

Notes
- Fixtures are examples; server responses may include additional fields. Conformance focuses on status codes and required fields/shapes.
- Negative cases check that invalid inputs are rejected with appropriate error status and ErrorResponse envelope.
