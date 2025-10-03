# RDCP Protocol Specification

**Version**: v1.0  
**Status**: Draft  
**Purpose**: Language-agnostic runtime debug control protocol

## Overview

RDCP (Runtime Debug Control Protocol) is a standardized HTTP-based protocol for controlling debug logging in distributed applications at runtime. This specification is designed to be language and framework agnostic, enabling consistent debug control across heterogeneous systems.

## Key Features

- **🚀 Runtime Control**: Enable/disable debug categories without restarts
- **🔐 Multi-level Security**: Basic, Standard, and Enterprise authentication modes  
- **🏢 Multi-tenant Ready**: Built-in tenant isolation support
- **📊 Performance Aware**: Zero-overhead when debug categories are disabled
- **🌐 Language Agnostic**: HTTP/JSON protocol works with any technology stack

## Quick Start

### Required Endpoints

All RDCP-compliant implementations must expose these endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/.well-known/rdcp` | GET | Protocol discovery |
| `/rdcp/v1/discovery` | GET | Debug system discovery |
| `/rdcp/v1/control` | POST | Runtime control |
| `/rdcp/v1/status` | GET | Current status |
| `/rdcp/v1/health` | GET | System health |

### Example Discovery Response

```json
{
  "protocol": "rdcp/1.0",
  "endpoints": {
    "discovery": "/rdcp/v1/discovery",
    "control": "/rdcp/v1/control",
    "status": "/rdcp/v1/status",
    "health": "/rdcp/v1/health"
  },
  "security": {
    "level": "standard",
    "methods": ["bearer"],
    "required": true
  }
}
```

## Documentation Structure

- **[API Reference](api/)** - Interactive OpenAPI (v1) with try-it examples
- **[Protocol Specification](rdcp-protocol-specification.md)** - Complete technical specification
- **[Implementation Guide](rdcp-implementation-guide.md)** - Step-by-step implementation instructions
- **[Protocol Schemas](protocol-schemas.md)** - JSON schema definitions
- **[Error Codes](error-codes.md)** - Standard error codes and handling
- **[Compliance Report](PROTOCOL-COMPLIANCE-REPORT.md)** - Compliance levels and requirements

## Security Levels

| Level | Use Case | Authentication | Features |
|-------|----------|----------------|----------|
| **Basic** | Development/Internal | API Key | Simple shared secrets |
| **Standard** | Production SaaS | Bearer Token (JWT) | User identity, scopes |
| **Enterprise** | Regulated Industries | mTLS + Token | Full audit trail, compliance |

## Getting Started

1. **Read the [Protocol Specification](rdcp-protocol-specification.md)** for complete technical details
2. **Follow the [Implementation Guide](rdcp-implementation-guide.md)** for step-by-step instructions  
3. **Review [Error Codes](error-codes.md)** for proper error handling
4. **Check [Compliance Requirements](PROTOCOL-COMPLIANCE-REPORT.md)** for your target security level

## Community

- **Repository**: [github.com/mojoatomic/rdcp-protocol](https://github.com/mojoatomic/rdcp-protocol)
- **Issues**: [Report bugs or request features](https://github.com/mojoatomic/rdcp-protocol/issues)
- **SDK Implementation**: [RDCP JavaScript/TypeScript SDK](https://github.com/mojoatomic/rdcp)

---

*RDCP is designed for production use in enterprise and government environments, with a focus on security, performance, and protocol compliance.*
