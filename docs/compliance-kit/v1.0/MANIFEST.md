# Compliance Kit Test Manifest (v1.0)

This page summarizes the tests and sequences defined in MANIFEST.json.

## Tests

| ID | Name | Method | Path | Expected | Schema |
|---|---|---|---|---|---|
| well-known-200 | Well-known discovery returns protocol info | GET | /.well-known/rdcp | 200 | schema/v1/endpoints/protocol-discovery.json |
| discovery-200 | Discovery lists categories | GET | /rdcp/v1/discovery | 200 | schema/v1/endpoints/discovery-response.json |
| discovery-tenant-invalid-400 | Discovery rejects invalid tenant header | GET | /rdcp/v1/discovery | 400 | schema/v1/responses/error.json |
| control-enable-200 | Control enable DATABASE succeeds | POST | /rdcp/v1/control | 200 | schema/v1/endpoints/control-response.json |
| control-invalid-action-400 | Control invalid action rejected | POST | /rdcp/v1/control | 400 | schema/v1/responses/error.json |
| control-invalid-category-400 | Control invalid category rejected | POST | /rdcp/v1/control | 400 | schema/v1/responses/error.json |
| control-missing-categories-400 | Control missing categories rejected | POST | /rdcp/v1/control | 400 | schema/v1/responses/error.json |
| status-200 | Status endpoint returns current states | GET | /rdcp/v1/status | 200 | schema/v1/endpoints/status-response.json |
| errors-401 | Protected endpoints require auth | GET | /rdcp/v1/status | 401 | schema/v1/responses/error.json |
| errors-403 | Insufficient scope rejected | POST | /rdcp/v1/control | 403 | schema/v1/responses/error.json |
| errors-404 | Unknown category returns 404 | POST | /rdcp/v1/control | 404 | schema/v1/responses/error.json |

## Sequences

- enable-and-verify — Enable DATABASE then verify via status
  1. POST /rdcp/v1/control (enable)
  2. GET /rdcp/v1/status → expect categories.DATABASE === true