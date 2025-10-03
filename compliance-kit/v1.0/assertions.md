# Assertions and Coverage (v1.0)

This document explains what each fixture/sequence is asserting against the RDCP v1.0 specification.

## Endpoints

- `/.well-known/rdcp` → WellKnownResponse
  - Asserts required fields: protocol, endpoints, capabilities, security
- `/rdcp/v1/discovery` → DiscoveryResponse
  - Asserts timestamp format, categories array, performance object
  - Negative: invalid `X-RDCP-Tenant-ID` fails with 400 ErrorResponse
- `/rdcp/v1/control` → ControlRequest/ControlResponse
  - Valid: action=enable + categories=["DATABASE"] returns 200 ControlResponse
  - Negative: invalid action, invalid category pattern, missing categories → 400 ErrorResponse
- `/rdcp/v1/status` → StatusResponse
  - Asserts enabled flag and categories map

## Behavior sequence

- `enable-and-verify`:
  1) POST control (enable DATABASE)
  2) GET status → categories.DATABASE === true

## Error conditions

- 401 Unauthorized: protected endpoints with missing/invalid auth
- 403 Forbidden: insufficient scopes/permissions
- 404 Not Found: unknown category

## Schema references

- Common: schema/v1/common/rdcp-common.json
- Well-known: schema/v1/endpoints/protocol-discovery.json
- Discovery: schema/v1/endpoints/discovery-response.json
- Control (request/response): schema/v1/endpoints/control-request.json, control-response.json
- Status: schema/v1/endpoints/status-response.json
- Error envelope: schema/v1/responses/error.json
