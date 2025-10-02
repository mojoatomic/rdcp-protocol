# JSON Schemas

The RDCP protocol publishes versioned JSON Schemas for all request and response message types. These schemas provide a precise, machine‑readable definition of message structure for implementers.

- Canonical base URL: https://mojoatomic.github.io/rdcp-protocol/schema/v1/
- Meta‑schema: http://json-schema.org/draft-07/schema

Schema categories

- Common Types
  - Shared type definitions used across endpoints
- Endpoints
  - Request/response schemas for all RDCP endpoints
- Response Types
  - Standard error response format

Usage

- Programmatic validation (e.g., Ajv, python-jsonschema)
- CI validation of example payloads
- Code generation for strongly typed clients/servers

See also:
- How to validate locally: scripts/validate-schemas.js
- Full usage examples (Node, Python, Go, Java): schema/README.md
