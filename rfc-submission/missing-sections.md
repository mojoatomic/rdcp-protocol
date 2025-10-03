# RDCP RFC Missing Sections (Draft)

This document holds RFC-ready content that feeds into rdcp-spec.xml (xml2rfc v3). Once finalized, copy/merge into the XML source.

## Abstract

The Runtime Debug Control Protocol (RDCP) is an HTTP-based protocol that enables dynamic control of debug logging in distributed systems without requiring application restarts or redeployment. RDCP provides standardized endpoints for discovering debug categories, enabling or disabling logging at runtime, monitoring system health, and tracking configuration changes through an audit trail. The protocol supports multiple security levels ranging from basic API key authentication for development environments to enterprise-grade mutual TLS for regulated industries. Multi-tenancy capabilities allow isolated configuration management across organizational boundaries. This specification defines the protocol architecture, message formats, authentication mechanisms, error handling, and compliance requirements for interoperable implementations across programming languages and platforms.

---

## 1. Introduction

### 1.1 Motivation

Modern distributed systems often require runtime observability without the operational overhead of redeployment. Traditional logging approaches require either always-on verbose logging (impacting performance and costs) or application restarts to change log levels (causing service disruption). RDCP addresses this gap by providing a standardized protocol for runtime control of debug instrumentation.

### 1.2 Terminology

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in [RFC2119].

Debug Category: A named collection of debug instrumentation points that can be collectively enabled or disabled.

Tenant: An isolated configuration context, typically representing an organization or customer in a multi-tenant system.

Temporary Control: A time-limited debug configuration that automatically expires after a specified duration.

Security Level: A tier of authentication and authorization requirements (basic, standard, or enterprise).

---

## 8. Security Considerations (EXPANDED)

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
- API keys MUST be cryptographically random with minimum entropy of 128 bits
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
- Status/discovery MAY use broader "read" or "discovery" scope

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
- Enterprise deployments SHOULD use cryptographic hashing (SHA-256)
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

This document registers the following well-known URI in the "Well-Known URIs" registry as defined by [RFC8615]:

URI suffix: rdcp

Change controller: IETF

Specification document: This document

Status: permanent

Related information: Used for RDCP protocol discovery. Returns JSON document describing RDCP endpoints and capabilities.

### 9.2 Media Type Registration

This document registers the following media type in the "Media Types" registry:

Type name: application

Subtype name: vnd.rdcp.v1+json

Required parameters: None

Optional parameters:
- charset: MUST be UTF-8 if specified

Encoding considerations: binary (JSON text in UTF-8)

Security considerations: See Section 8 of this document

Interoperability considerations: Follows JSON syntax [RFC8259]

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

## 10. References

### 10.1 Normative References

[RFC2119] Bradner, S., "Key words for use in RFCs to Indicate Requirement Levels", BCP 14, RFC 2119, DOI 10.17487/RFC2119, March 1997, <https://www.rfc-editor.org/info/rfc2119>.

[RFC8174] Leiba, B., "Ambiguity of Uppercase vs Lowercase in RFC 2119 Key Words", BCP 14, RFC 8174, DOI 10.17487/RFC8174, May 2017, <https://www.rfc-editor.org/info/rfc8174>.

[RFC8259] Bray, T., Ed., "The JavaScript Object Notation (JSON) Data Interchange Format", STD 90, RFC 8259, DOI 10.17487/RFC8259, December 2017, <https://www.rfc-editor.org/info/rfc8259>.

[RFC8615] Nottingham, M., "Well-Known Uniform Resource Identifiers (URIs)", RFC 8615, DOI 10.17487/RFC8615, May 2019, <https://www.rfc-editor.org/info/rfc8615>.

[RFC3339] Klyne, G. and C. Newman, "Date and Time on the Internet: Timestamps", RFC 3339, DOI 10.17487/RFC3339, July 2002, <https://www.rfc-editor.org/info/rfc3339>.

[RFC9110] Fielding, R., Nottingham, M., Reschke, J., et al., "HTTP Semantics", RFC 9110, DOI 10.17487/RFC9110, June 2022, <https://www.rfc-editor.org/info/rfc9110>.

[RFC9112] Nottingham, M., Thomson, M., et al., "HTTP/1.1", RFC 9112, DOI 10.17487/RFC9112, June 2022, <https://www.rfc-editor.org/info/rfc9112>.

[RFC8446] Rescorla, E., "The Transport Layer Security (TLS) Protocol Version 1.3", RFC 8446, DOI 10.17487/RFC8446, August 2018, <https://www.rfc-editor.org/info/rfc8446>.

### 10.2 Informative References

[RFC7807] Nottingham, M. and E. Wilde, "Problem Details for HTTP APIs", RFC 7807, DOI 10.17487/RFC7807, March 2016, <https://www.rfc-editor.org/info/rfc7807>.

[RFC7519] Jones, M., Bradley, J., and N. Sakimura, "JSON Web Token (JWT)", RFC 7519, DOI 10.17487/RFC7519, May 2015, <https://www.rfc-editor.org/info/rfc7519>.

[RFC6749] Hardt, D., Ed., "The OAuth 2.0 Authorization Framework", RFC 6749, DOI 10.17487/RFC6749, October 2012, <https://www.rfc-editor.org/info/rfc6749>.

---

## Appendix A. Authors' Addresses

[Your Name]
[Your Organization]
Email: [your.email@example.com]
URI: https://your-website.com

---

## Appendix B. Acknowledgments

The authors would like to thank contributors and reviewers for their feedback and contributions to this specification.

---

## Status of This Memo (Template)

This document is an Internet-Draft and is subject to all provisions of Section 3 of RFC 2026. Internet-Drafts are working documents of the Internet Engineering Task Force (IETF). Note that other groups may also distribute working documents as Internet-Drafts. The list of current Internet-Drafts is at https://datatracker.ietf.org/drafts/current/.

Internet-Drafts are draft documents valid for a maximum of six months and may be updated, replaced, or obsoleted by other documents at any time. It is inappropriate to use Internet-Drafts as reference material or to cite them other than as "work in progress."

---

## Copyright Notice (Template)

Copyright (c) 2025 IETF Trust and the persons identified as the document authors. All rights reserved.

This document is subject to BCP 78 and the IETF Trust's Legal Provisions Relating to IETF Documents (https://trustee.ietf.org/license-info) in effect on the date of publication of this document. Please review these documents carefully, as they describe your rights and restrictions with respect to this document.
