# Runtime Debug Control Protocol (RDCP) Specification v1.0

**Status**: Draft  
**Date**: 2025-09-17  
**Purpose**: Formal protocol specification for runtime debug control across distributed systems

---

## Abstract

The Runtime Debug Control Protocol (RDCP) is an HTTP-based protocol that enables dynamic control of debug logging in distributed systems without requiring application restarts or redeployment. RDCP provides standardized endpoints for discovering debug categories, enabling or disabling logging at runtime, monitoring system health, and tracking configuration changes through an audit trail. The protocol supports multiple security levels ranging from basic API key authentication for development environments to enterprise-grade mutual TLS for regulated industries. Multi-tenancy capabilities allow isolated configuration management across organizational boundaries. This specification defines the protocol architecture, message formats, authentication mechanisms, error handling, and compliance requirements for interoperable implementations across programming languages and platforms.

## 1. Protocol Overview

### 1.1 Scope
RDCP defines a standardized HTTP-based protocol for controlling debug logging in distributed applications at runtime. This specification is language and framework agnostic.

### 1.2 Conformance Requirements
The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

### 1.3 Terminology

- Debug Category: A named collection of debug instrumentation points that can be collectively enabled or disabled.
- Tenant: An isolated configuration context, typically representing an organization or customer in a multi-tenant system.
- Temporary Control: A time-limited debug configuration that automatically expires after a specified duration.
- Security Level: A tier of authentication and authorization requirements (basic, standard, or enterprise).

---

## 2. Protocol Architecture

### 2.1 Transport
- Protocol: HTTP/1.1 or HTTP/2
- Content-Type: application/json
- Character Encoding: UTF-8

### 2.2 Required Endpoints

Compliant implementations MUST expose these endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/.well-known/rdcp` | GET | Protocol discovery |
| `/rdcp/v1/discovery` | GET | Debug system discovery |
| `/rdcp/v1/control` | POST | Runtime control |
| `/rdcp/v1/status` | GET | Current status |
| `/rdcp/v1/health` | GET | System health |

### 2.3 Optional Endpoints

Implementations MAY expose:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/rdcp/v1/metrics` | GET | Performance metrics |
| `/rdcp/v1/tenants` | GET | Multi-tenant discovery |
| `/rdcp/v1/audit` | GET | Audit trail |

---

## 3. Authentication & Authorization

### 3.1 Security Levels

Implementations MUST declare their security level and support appropriate methods:

| Level | Use Case | Required Methods | Features |
|-------|----------|-----------------|----------|
| `basic` | Development/Internal | API Key | Simple shared secrets |
| `standard` | Production SaaS | Bearer Token (JWT/OAuth2) | User identity, expiration |
| `enterprise` | Regulated Industries | mTLS + Token | Certificate validation, full audit |

### 3.2 Authentication Headers

#### Required Headers (All Levels)
```http
X-RDCP-Auth-Method: api-key | bearer | mtls | hybrid
X-RDCP-Client-ID: <client-identifier>
X-RDCP-Request-ID: <unique-request-id>  # For audit trail
```

#### Method-Specific Headers

**Basic (API Key):**
```http
X-RDCP-API-Key: rdcp_[env]_[type]_[random]
X-RDCP-Key-Version: v1  # For key rotation
```

**Standard (Bearer Token):**
```http
Authorization: Bearer <jwt-token>
X-RDCP-Token-Type: jwt | oauth2 | custom
```

**Enterprise (mTLS):**
```http
X-Client-Cert: <certificate-fingerprint>
X-RDCP-Cert-Subject: CN=client.example.com
```

### 3.3 Scopes and Permissions

Implementations MUST support standard scopes:

| Scope | Operations | Description |
|-------|------------|-------------|
| `discovery` | GET endpoints | Read system information |
| `status` | Status/Health | Monitor system state |
| `control` | POST control | Modify debug settings |
| `admin` | All operations | Full access + audit trail |

### 3.4 Authentication Response

#### Success Context
Auth validation MUST provide:
```json
{
  "authenticated": true,
  "method": "bearer",
  "userId": "user@example.com",
  "tenantId": "org_123",
  "scopes": ["discovery", "status", "control"],
  "sessionId": "sess_abc123",
  "expiresAt": "2025-09-17T12:00:00Z"  # If applicable
}
```

#### Failure Response
```json
{
  "error": {
    "code": "RDCP_AUTH_FAILED",
    "message": "Authentication failed",
    "method": "bearer",
    "details": {
      "reason": "token_expired" | "invalid_key" | "insufficient_scopes",
      "requiredScopes": ["control"],
      "providedScopes": ["status"]
    },
    "protocol": "rdcp/1.0"
  }
}
```

Status Codes:
- `401 Unauthorized`: No valid credentials
- `403 Forbidden`: Valid credentials, insufficient permissions

### 3.5 Key Rotation and Management

**API Keys:**
- MUST support multiple active keys
- SHOULD include version in key format
- MUST allow gradual key rotation

**Tokens:**
- MUST validate expiration
- SHOULD support refresh tokens
- MUST validate issuer and audience

### 3.6 Auth Validation Interface

Implementations MUST provide consistent auth validation regardless of method:

```javascript
// Pseudo-code interface (language agnostic)
interface AuthValidationResult {
  valid: boolean
  method: "api-key" | "bearer" | "mtls" | "hybrid"
  userId?: string           // Required for standard/enterprise
  tenantId?: string         // Required if multi-tenant
  scopes: string[]          // Granted permissions
  sessionId?: string        // For audit correlation
  expiresAt?: timestamp     // For time-limited access
  metadata?: {              // Additional context
    clientId: string
    clientVersion: string
    ipAddress: string
  }
}
```

### 3.7 Auth Method Selection

Clients SHOULD select auth method based on deployment:

```javascript
// Client discovers server capabilities
GET /.well-known/rdcp

// Client selects appropriate method
if (environment === "development") {
  use "api-key" with X-RDCP-API-Key header
} else if (environment === "production") {
  use "bearer" with Authorization header
} else if (environment === "regulated") {
  use "mtls" with client certificates
}
```

### 3.8 Audit Requirements

Based on security level:

| Level | Audit Requirements |
|-------|-------------------|
| `basic` | Optional logging |
| `standard` | User identity + actions |
| `enterprise` | Full audit trail with compliance metadata |

---

## 4. Multi-Tenancy

### 4.1 Tenant Context Headers

When multi-tenancy is supported, implementations MUST accept:

```http
X-RDCP-Tenant-ID: <tenant-identifier>
X-RDCP-Isolation-Level: global|process|namespace|organization
X-RDCP-Tenant-Name: <human-readable-name>  # OPTIONAL
```

### 4.2 Isolation Levels

| Level | Description | Scope |
|-------|-------------|-------|
| `global` | No isolation | All tenants share configuration |
| `process` | Process isolation | Configuration per process |
| `namespace` | Namespace isolation | Configuration per namespace |
| `organization` | Full isolation | Complete tenant separation |

### 4.3 Tenant Context in Responses

All responses in multi-tenant mode MUST include:

```json
{
  "protocol": "rdcp/1.0",
  "tenant": {
    "id": "<tenant-id>",
    "isolationLevel": "<level>",
    "scope": "global|tenant-isolated"
  }
}
```

---

## 5. Endpoint Specifications

### 5.1 Protocol Discovery

**Request:**
```http
GET /.well-known/rdcp HTTP/1.1
```

**Response:**
```json
{
  "protocol": "rdcp/1.0",
  "endpoints": {
    "discovery": "/rdcp/v1/discovery",
    "control": "/rdcp/v1/control",
    "status": "/rdcp/v1/status",
    "health": "/rdcp/v1/health"
  },
  "capabilities": {
    "multiTenancy": true|false,
    "performanceMetrics": true|false,
    "temporaryControls": true|false,
    "auditTrail": true|false
  },
  "security": {
    "level": "basic" | "standard" | "enterprise",
    "methods": ["api-key", "bearer", "mtls"],
    "scopes": ["discovery", "status", "control", "admin"],
    "required": true|false,
    "keyRotation": true|false,
    "tokenRefresh": true|false
  }
}
```

### 5.2 Debug System Discovery

**Request:**
```http
GET /rdcp/v1/discovery HTTP/1.1
X-RDCP-Tenant-ID: <tenant-id>  # If multi-tenant
```

**Response:**
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
      "metrics": {
        "callsTotal": 1234,
        "callsPerSecond": 2.3
      }
    }
  ],
  "performance": {
    "totalCalls": 45678,
    "callsPerSecond": 2.3,
    "categoryBreakdown": { "DATABASE": 1234 }
  }
}
```

### 5.3 Runtime Control

**Request:**
```json
POST /rdcp/v1/control HTTP/1.1
Content-Type: application/json

{
  "action": "enable|disable|toggle|reset|status",
  "categories": ["DATABASE", "API_ROUTES"]  // or a single string "DATABASE"
  ,
  "options": {
    "temporary": true,
    "duration": "15m",  // number (seconds) or duration string (e.g., "15m")
    "reason": "Investigating issue #1234"
  }
}
```

**Response:**
```json
{
  "protocol": "rdcp/1.0",
  "timestamp": "2025-09-17T10:30:00Z",
  "action": "enable",
  "categories": ["DATABASE"],
  "status": "success", // "partial" or "failed"
  "message": "Enabled categories",
  "changes": [
    {
      "category": "DATABASE",
      "previousState": false,
      "newState": true,
      "temporary": true,
      "effectiveAt": "2025-09-17T10:30:00Z",
      "expiresAt": "2025-09-17T10:45:00Z"
    }
  ]
}
```

### 5.4 Status Monitoring

**Request:**
```http
GET /rdcp/v1/status HTTP/1.1
```

**Response:**
```json
{
  "protocol": "rdcp/1.0",
  "timestamp": "2025-09-17T10:30:00Z",
  "enabled": true,
  "categories": { "DATABASE": true, "API_ROUTES": false },
  "performance": { "totalCalls": 45678, "callsPerSecond": 2.3 }
}
```

### 5.5 Health Check

**Request:**
```http
GET /rdcp/v1/health HTTP/1.1
```

**Response:**
```json
{
  "protocol": "rdcp/1.0",
  "timestamp": "2025-09-17T10:30:00Z",
  "status": "healthy",
  "checks": [
    { "name": "redis", "status": "pass", "duration": "5ms" },
    { "name": "db", "status": "pass", "duration": "8ms" }
  ]
}
```

---

## 6. Error Handling

### 6.1 Standard Error Format

All errors MUST follow:

```json
{
  "error": {
    "code": "RDCP_ERROR_CODE",
    "message": "Human-readable message",
    "details": {},  # OPTIONAL
    "protocol": "rdcp/1.0"
  }
}
```

### 6.2 Standard Error Codes

For the complete, source-of-truth list of protocol error codes and their HTTP mappings, see: docs/error-codes.md

---

## 7. Performance Metrics

### 7.1 Metric Representation

When reporting metrics, implementations MUST use:

```json
{
  "value": <numeric-value>,
  "unit": "<unit-string>",
  "measured": true|false,  # false indicates placeholder
  "timestamp": "2025-09-17T10:30:00Z"
}
```

### 7.2 Standard Units

| Metric | Unit | Example |
|--------|------|---------|
| CPU Usage | `percent` | 0.1 |
| Memory | `bytes` | 1048576 |
| Rate | `per_second` | 2.3 |
| Count | `count` | 1234 |
| Duration | `milliseconds` | 50 |

### 7.3 Placeholder Values

When actual metrics are unavailable:
- Set `"measured": false`
- Provide reasonable estimates
- Document in response that values are estimated

---

## 8. Security Considerations

### 8.1 Threat Model
RDCP controls application behavior and may expose sensitive diagnostic information. The following threats are considered:

In Scope:
- Unauthorized access to debug controls
- Information disclosure through debug output
- Denial of service through resource exhaustion
- Privilege escalation through scope manipulation
- Replay attacks using captured credentials
- Audit trail tampering

Out of Scope:
- Protection of debug output after it leaves the application
- Network-level attacks (assumed TLS/mTLS provides transport security)
- Host-level compromise (operating system security)

### 8.2 Authentication Security

Credential Strength:
 API keys MUST be cryptographically random with minimum entropy of 128 bits
- Keys MUST be compared using constant-time comparison to prevent timing attacks
- Bearer tokens MUST use industry-standard formats (JWT with HS256/RS256, OAuth2)
- Token validation MUST verify signature, issuer, audience, and expiration

Credential Storage:
- Servers MUST NOT log credentials in plaintext
- Clients SHOULD store credentials in secure storage (keychains, vaults)
- API keys SHOULD be rotatable without service interruption

### 8.3 Authorization and Scopes
Principle of Least Privilege:
- Clients SHOULD request minimum necessary scopes
- Servers MUST validate scopes for each operation
- Control operations MUST require explicit "control" scope
- Status/discovery MAY use broader "discovery" scope

Scope Validation:
- Servers MUST reject operations when required scopes are absent
- Scope elevation MUST NOT be possible through protocol manipulation
- Multi-tenant systems MUST enforce tenant isolation in scope validation

### 8.4 Transport Security
TLS Requirements:
- Production deployments MUST use TLS; TLS 1.3 is RECOMMENDED
- TLS 1.2 MAY be used only where TLS 1.3 is unavailable
- Development MAY use HTTP only on localhost (127.0.0.1/::1)
- Servers SHOULD use HSTS headers to enforce HTTPS

Certificate Validation:
- Clients MUST validate server certificates
- mTLS deployments MUST validate client certificates
- Certificate pinning MAY be used for enhanced security
- Self-signed certificates MUST NOT be used in production

### 8.5 Denial of Service Protection
Rate Limiting:
- Control endpoints SHOULD limit requests to 60/minute per client
- Status endpoints MAY allow higher rates (e.g., 600/minute)
- Rate limits SHOULD be enforced per authenticated identity
- 429 Too Many Requests response MUST include Retry-After header

Resource Exhaustion:
- Temporary controls MUST have maximum duration limits (24 hours RECOMMENDED)
- Server SHOULD limit concurrent temporary controls per tenant
- Discovery responses SHOULD limit category list size
- Request timeouts SHOULD be enforced (30 seconds RECOMMENDED)

### 8.6 Replay Attack Prevention
Request Uniqueness:
- Clients SHOULD include unique X-RDCP-Request-ID header
- Servers MAY implement request deduplication (5-minute window RECOMMENDED)
- Timestamp validation SHOULD reject requests with clock skew >5 minutes
- Nonces MAY be required for high-security deployments

### 8.7 Audit Trail Security
Tamper Evidence:
- Audit logs SHOULD use append-only storage
- Enterprise deployments SHOULD use cryptographic hashing (e.g., SHA-256)
- Log entries SHOULD include previous entry hash for chain validation
- External audit systems MAY be used for compliance requirements

Audit Content:
- Logs MUST include timestamp, authenticated identity, action, affected categories
- Logs SHOULD include client IP address and user agent
- Logs MUST NOT include credentials or sensitive payload data
- Retention policies SHOULD align with compliance requirements (90 days minimum)

### 8.8 Privacy Considerations
Personal Information:
- User identifiers in audit logs constitute PII under GDPR/CCPA
- Implementations SHOULD provide audit log anonymization options
- Debug output MAY contain sensitive data; access controls are essential
- Multi-tenant systems MUST prevent cross-tenant information leakage

Data Minimization:
- Status endpoints SHOULD NOT expose internal system details unnecessarily
- Error messages SHOULD NOT leak implementation details
- Discovery responses SHOULD provide only essential category information

### 8.9 Multi-Tenancy Security
Tenant Isolation:
- Tenant ID MUST be validated against authenticated identity
- Cross-tenant operations MUST be explicitly denied
- Tenant isolation MUST be enforced at the storage layer
- Global operations (admin) MUST require elevated privileges

Tenant Context Injection:
- Servers MUST validate tenant headers match authentication context
- Clients MUST NOT be able to impersonate other tenants
- Tenant switching MUST require re-authentication

---

## 9. IANA Considerations

### 9.1 Well-Known URI Registration
This document registers the following well-known URI in the "Well-Known URIs" registry as defined by RFC 8615:

- URI suffix: rdcp
- Change controller: IETF
- Specification document: This document
- Status: permanent
- Related information: Used for RDCP protocol discovery. Returns JSON describing RDCP endpoints and capabilities.

### 9.2 Media Type Registration
Type name: application

Subtype name: vnd.rdcp.v1+json

Required parameters: None

Optional parameters:
- charset: MUST be UTF-8 if specified

Encoding considerations: binary (JSON text in UTF-8)

Security considerations: See Section 8 of this document

Interoperability considerations: Follows JSON syntax (RFC 8259)

Published specification: This document

Applications that use this media type: Distributed systems using RDCP for debug control

Fragment identifier considerations: None

Additional information:
- Magic number(s): None
- File extension(s): .json
- Macintosh file type code(s): TEXT

Person & email address to contact: [Your Name] <your.email@example.com>

Intended usage: COMMON

Restrictions on usage: None

Author: [Your Name]

Change controller: IETF

### 9.3 Error Code Registry
IANA is requested to create and maintain a registry titled "RDCP Error Codes" with the following initial entries (aligned with the RDCP specification and schema):

| Error Code | HTTP Status | Description | Reference |
|------------|-------------|-------------|-----------|
| RDCP_AUTH_REQUIRED | 401 | Authentication required | Section 3.4 |
| RDCP_FORBIDDEN | 403 | Insufficient permissions | Section 3.4 |
| RDCP_MALFORMED_REQUEST | 400 | Malformed request | Section 6.2 |
| RDCP_CATEGORY_NOT_FOUND | 404 | Category does not exist | Section 6.2 |
| RDCP_NOT_FOUND | 404 | Resource does not exist | Section 6.2 |
| RDCP_RATE_LIMITED | 429 | Too many requests | Section 8.5 |
| RDCP_SERVER_ERROR | 500 | Server error | Section 6.2 |
| RDCP_UNAVAILABLE | 503 | Service temporarily unavailable | Section 6.2 |

Registration Procedure: Specification Required

Expert Review: Designated experts should ensure:
1. Error codes follow naming convention: RDCP_[CONTEXT]_[CONDITION]
2. HTTP status codes are appropriate for the error type
3. Descriptions are clear and unambiguous
4. No conflicts with existing codes

Change Procedure: New entries require IETF review or IESG approval

### 9.4 Authentication Method Registry
IANA is requested to create and maintain a registry titled "RDCP Authentication Methods":

| Method | Description | Reference |
|--------|-------------|-----------|
| api-key | Shared secret API key | Section 3.2 |
| bearer | JWT or OAuth2 bearer token | Section 3.2 |
| mtls | Mutual TLS with client certificates | Section 3.2 |
| hybrid | Combination of mtls + bearer | Section 3.2 |

Registration Procedure: Specification Required

Expert Review: Designated experts should verify:
1. Method is standards-based or widely adopted
2. Security properties are documented
3. Interoperability considerations are addressed

### 9.5 Scope Registry
IANA is requested to create and maintain a registry titled "RDCP Authorization Scopes":

| Scope | Operations | Description | Reference |
|-------|------------|-------------|-----------|
| discovery | GET endpoints | Read system information | Section 3.3 |
| status | Status/Health | Monitor system state | Section 3.3 |
| control | POST control | Modify debug settings | Section 3.3 |
| admin | All operations | Full access + audit trail | Section 3.3 |

Registration Procedure: Specification Required

Expert Review: Review should ensure scopes follow principle of least privilege

---

## 10. Compatibility

### 10.1 Version Negotiation

Clients MUST include protocol version:
```http
Accept: application/vnd.rdcp.v1+json
```

Servers MUST respond with:
```http
Content-Type: application/vnd.rdcp.v1+json
```

### 10.2 Backward Compatibility

Future versions:
- MUST maintain backward compatibility for 2 major versions
- MUST use version in URL path (`/rdcp/v2/...`)
- SHOULD provide version negotiation

---

## 11. Extensibility

### 11.1 Custom Categories

Implementations MAY add custom debug categories:
- MUST prefix with `X-` (e.g., `X-CUSTOM-FEATURE`)
- MUST document in discovery endpoint

### 11.2 Vendor Extensions

Vendors MAY extend responses with additional fields:
- MUST prefix with vendor identifier
- MUST NOT break standard clients

Example:
```json
{
  "protocol": "rdcp/1.0",
  "categories": [...],
  "_vendor_secflo": {
    "customField": "value"
  }
}
```

---

## 12. Compliance Levels

### Level 1: Basic
- Implements all required endpoints
- Security level: `basic` (API key authentication)
- Returns proper error codes
- Single-tenant or global configuration
- Optional audit logging

### Level 2: Standard
- All Level 1 requirements
- Security level: `standard` (Bearer tokens with scopes)
- Multi-tenancy support with isolation
- Performance metrics (may use placeholders)
- User identity in audit trail
- Key rotation support

### Level 3: Enterprise
- All Level 2 requirements
- Security level: `enterprise` (mTLS + tokens)
- Real performance metrics (measured, not estimated)
- Temporary controls with automatic expiration
- Rate limiting with configurable thresholds
- Full audit trail with compliance metadata
- Token refresh capability
- Multiple active keys per client

---

## 13. References

### 13.1 Normative References
- RFC 2119: Key words for use in RFCs
- RFC 8174: Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words
- RFC 8259: JSON Data Interchange Format
- RFC 8615: Well-Known Uniform Resource Identifiers (URIs)
- RFC 3339: Date and Time on the Internet: Timestamps
- RFC 9110: HTTP Semantics
- RFC 9112: HTTP/1.1
- RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3

### 13.2 Informative References
- RFC 7807: Problem Details for HTTP APIs
- RFC 7519: JSON Web Token (JWT)
- RFC 6749: The OAuth 2.0 Authorization Framework

---

## Appendix A: Implementation Notes

This specification defines the protocol, not the implementation. Implementations:
- MAY use any programming language
- MAY use any storage mechanism
- MAY implement additional features
- MUST maintain protocol compliance for claimed level

---

## Appendix B: Change Log

- v1.0 (2025-09-17): Initial specification

---

## Appendix C: Data Type Definitions

This protocol uses standard JSON primitives (string, number, boolean, object, array) with the following domain-specific constraints.

### Timestamp
- Type: string (RFC 3339 / ISO 8601 in UTC)
- Format: `YYYY-MM-DDTHH:mm:ss.sssZ` (milliseconds are REQUIRED; UTC 'Z' is REQUIRED)
- Example: `"2025-09-17T10:30:00.000Z"`
- Validation: timezone offsets other than `Z` are not permitted

### Duration
- Type: number or string
- Number: integer seconds (e.g., `900`)
- String: `<number><unit>` where unit ∈ `s|m|h|d` (e.g., `"15m"`, `"2h"`, `"30s"`)
- Canonicalization (server responses): prefer string form with the smallest unit that divides evenly (e.g., `900` → `"15m"`)

### CategoryName
- Type: string
- Pattern: `^[A-Z][A-Z0-9_]{0,63}$`
- Length: 1–64
- Case: uppercase with underscores
- Examples: `DATABASE`, `API_ROUTES`, `QUERY_CACHE`

### Identifier (TenantId, ClientId, RequestId)
- Type: string
- Pattern: `^[a-zA-Z0-9._-]{1,255}$`
- Length: 1–255
- Notes:
  - Intended for headers and path params (e.g., `X-RDCP-Tenant-ID`)
  - Must not contain whitespace
  - Use URL-safe characters only

### ErrorCode
- Type: string
- Pattern: `^[A-Z0-9_]{3,64}$`
- Examples: `UNAUTHORIZED`, `TENANT_NOT_FOUND`, `RATE_LIMITED`

### Metric Numbers
Use context-specific types:
- CounterNumber: non-negative; for counts and totals
- RateNumber: non-negative; for per-second and throughput metrics
- GaugeNumber: finite number; may be negative if semantically valid

### CategoryList
- Type: array of CategoryName
- Constraints:
  - `uniqueItems: true` (no duplicates)
  - `minItems: 1`
- Example: `["DATABASE", "API_ROUTES"]`

---

*End of RDCP Protocol Specification v1.0*

---

## Appendix D: Authors' Addresses

[Your Name]
[Your Organization]
Email: [your.email@example.com]
URI: https://your-website.com

---

## Appendix E: Acknowledgments

The authors would like to thank contributors and reviewers for their valuable feedback and contributions to this specification.

---

## Status of This Memo (Template)

This document is an Internet-Draft and is subject to all provisions of Section 3 of RFC 2026. Internet-Drafts are working documents of the Internet Engineering Task Force (IETF). Note that other groups may also distribute working documents as Internet-Drafts. The list of current Internet-Drafts is at https://datatracker.ietf.org/drafts/current/.

Internet-Drafts are draft documents valid for a maximum of six months and may be updated, replaced, or obsoleted by other documents at any time. It is inappropriate to use Internet-Drafts as reference material or to cite them other than as "work in progress."

---

## Copyright Notice (Template)

Copyright (c) 2025 IETF Trust and the persons identified as the document authors. All rights reserved.

This document is subject to BCP 78 and the IETF Trust's Legal Provisions Relating to IETF Documents (https://trustee.ietf.org/license-info) in effect on the date of publication of this document. Please review these documents carefully, as they describe your rights and restrictions with respect to this document.
