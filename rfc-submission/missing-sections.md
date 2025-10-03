# RDCP RFC — Missing Sections (Draft)

This document holds content that feeds into rdcp-spec.xml. Once sections are finalized, they should be copied/merged into the xml2rfc source.

## Abstract (draft)

[200–300 words summarizing RDCP purpose, security levels, multi-tenancy, compliance.]

## Security Considerations (expanded outline)
- Threat model (in-scope/out-of-scope)
- Authentication security (credential strength, storage)
- Authorization and scopes (least privilege, validation)
- Transport security (TLS 1.3)
- Denial of service protections (rate limiting, resource exhaustion)
- Replay attack prevention (request IDs, timestamps)
- Audit trail security (tamper evidence, retention)
- Privacy considerations (PII, minimization, GDPR/CCPA)
- Multi-tenancy security (isolation levels, tenant context)

## IANA Considerations (outline)
1) Well-Known URI: `/.well-known/rdcp`
2) Media Type: `application/vnd.rdcp.v1+json`
3) Error Code Registry (initial set; Specification Required; Expert Review)
4) Authentication Method Registry (api-key, bearer, mtls, hybrid)
5) Authorization Scope Registry (discovery, status, control, admin)

Each registry should include: registration procedure, designated expert guidance, initial entries.

## References (split)
- Normative: RFC 2119/8174, RFC 8259, RFC 9110/9112, RFC 8446, RFC 8615, RFC 3339
- Informative: RFC 7807, RFC 7519, RFC 6749
