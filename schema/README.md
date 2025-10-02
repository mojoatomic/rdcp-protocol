# RDCP Protocol JSON Schemas

This directory contains versioned JSON Schema definitions for the Runtime Debug Control Protocol (RDCP) v1.0.

## 📋 Overview

These schemas provide machine-readable validation rules for all RDCP protocol requests and responses, enabling automatic validation in any language that supports JSON Schema.

## 🗂️ Schema Organization

```
schema/
└── v1/                          # RDCP v1.0 schemas
    ├── common/
    │   └── rdcp-common.json     # Reusable definitions
    ├── endpoints/
    │   ├── protocol-discovery.json    # GET /.well-known/rdcp
    │   ├── discovery-response.json    # GET /rdcp/v1/discovery  
    │   ├── control-request.json       # POST /rdcp/v1/control (request)
    │   ├── control-response.json      # POST /rdcp/v1/control (response)
    │   ├── status-response.json       # GET /rdcp/v1/status
    │   └── health-response.json       # GET /rdcp/v1/health
    └── responses/
        └── error.json           # Standard error response format
```

## 🌐 Schema URLs

All schemas are hosted at stable, versioned URLs:

**Base URL**: `https://mojoatomic.github.io/rdcp-protocol/schema/v1/`

### Core Schemas

- **Common Definitions**: `https://mojoatomic.github.io/rdcp-protocol/schema/v1/common/rdcp-common.json`
- **Error Response**: `https://mojoatomic.github.io/rdcp-protocol/schema/v1/responses/error.json`

### Endpoint Schemas

- **Protocol Discovery**: `https://mojoatomic.github.io/rdcp-protocol/schema/v1/endpoints/protocol-discovery.json`
- **Discovery Response**: `https://mojoatomic.github.io/rdcp-protocol/schema/v1/endpoints/discovery-response.json`
- **Control Request**: `https://mojoatomic.github.io/rdcp-protocol/schema/v1/endpoints/control-request.json`
- **Control Response**: `https://mojoatomic.github.io/rdcp-protocol/schema/v1/endpoints/control-response.json`
- **Status Response**: `https://mojoatomic.github.io/rdcp-protocol/schema/v1/endpoints/status-response.json`
- **Health Response**: `https://mojoatomic.github.io/rdcp-protocol/schema/v1/endpoints/health-response.json`

## 🚀 Usage Examples

### JavaScript/Node.js (AJV)

```javascript
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv();
addFormats(ajv);

// Validate a control request
const controlRequestSchema = await fetch(
  'https://mojoatomic.github.io/rdcp-protocol/schema/v1/endpoints/control-request.json'
).then(r => r.json());

const validate = ajv.compile(controlRequestSchema);

const requestData = {
  action: 'enable',
  categories: ['DATABASE', 'API_ROUTES'],
  options: {
    temporary: true,
    duration: '15m',
    reason: 'Debugging issue #1234'
  }
};

if (validate(requestData)) {
  console.log('✅ Valid RDCP control request');
} else {
  console.error('❌ Invalid request:', validate.errors);
}
```

### Python (jsonschema)

```python
import json
import requests
from jsonschema import validate, ValidationError

# Load schema from URL
schema_url = 'https://mojoatomic.github.io/rdcp-protocol/schema/v1/endpoints/control-request.json'
schema = requests.get(schema_url).json()

# Validate data
data = {
    'action': 'enable',
    'categories': ['DATABASE'],
    'options': {
        'temporary': True,
        'duration': '30m',
        'reason': 'Performance investigation'
    }
}

try:
    validate(instance=data, schema=schema)
    print('✅ Valid RDCP control request')
except ValidationError as e:
    print(f'❌ Invalid request: {e.message}')
```

### Go (gojsonschema)

```go
package main

import (
    "fmt"
    "github.com/xeipuuv/gojsonschema"
)

func main() {
    schemaURL := "https://mojoatomic.github.io/rdcp-protocol/schema/v1/endpoints/control-request.json"
    
    schemaLoader := gojsonschema.NewReferenceLoader(schemaURL)
    
    data := map[string]interface{}{
        "action":     "disable",
        "categories": []string{"DATABASE", "CACHE"},
    }
    
    documentLoader := gojsonschema.NewGoLoader(data)
    
    result, err := gojsonschema.Validate(schemaLoader, documentLoader)
    if err != nil {
        panic(err)
    }
    
    if result.Valid() {
        fmt.Println("✅ Valid RDCP control request")
    } else {
        fmt.Println("❌ Invalid request:")
        for _, desc := range result.Errors() {
            fmt.Printf("- %s\n", desc)
        }
    }
}
```

### Java (everit-org/json-schema)

```java
import org.everit.json.schema.Schema;
import org.everit.json.schema.loader.SchemaLoader;
import org.json.JSONObject;
import org.json.JSONTokener;

import java.io.InputStream;
import java.net.URL;

public class RDCPValidator {
    public static void main(String[] args) throws Exception {
        // Load schema from URL
        URL schemaURL = new URL("https://mojoatomic.github.io/rdcp-protocol/schema/v1/endpoints/control-request.json");
        InputStream schemaStream = schemaURL.openStream();
        JSONObject schemaJson = new JSONObject(new JSONTokener(schemaStream));
        
        Schema schema = SchemaLoader.load(schemaJson);
        
        // Validate data
        JSONObject data = new JSONObject();
        data.put("action", "toggle");
        data.put("categories", new String[]{"AUTH", "REPORTS"});
        
        try {
            schema.validate(data);
            System.out.println("✅ Valid RDCP control request");
        } catch (Exception e) {
            System.out.println("❌ Invalid request: " + e.getMessage());
        }
    }
}
```

## 📊 Common Validation Patterns

### Request Validation (Server-side)

```javascript
// Express.js middleware example
const validateRDCPRequest = (schemaUrl) => {
  return async (req, res, next) => {
    try {
      const schema = await fetch(schemaUrl).then(r => r.json());
      const validate = ajv.compile(schema);
      
      if (validate(req.body)) {
        next();
      } else {
        res.status(400).json({
          error: {
            code: 'RDCP_VALIDATION_ERROR',
            message: 'Request validation failed',
            details: validate.errors,
            protocol: 'rdcp/1.0'
          }
        });
      }
    } catch (error) {
      next(error);
    }
  };
};

// Usage
app.post('/rdcp/v1/control', 
  validateRDCPRequest('https://mojoatomic.github.io/rdcp-protocol/schema/v1/endpoints/control-request.json'),
  handleControlRequest
);
```

### Response Validation (Client-side)

```javascript
// Client-side response validation
async function callRDCPEndpoint(url, requestData) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  });
  
  const responseData = await response.json();
  
  // Validate response format
  const responseSchema = await fetch(
    'https://mojoatomic.github.io/rdcp-protocol/schema/v1/endpoints/control-response.json'
  ).then(r => r.json());
  
  const validate = ajv.compile(responseSchema);
  
  if (!validate(responseData)) {
    throw new Error(`Invalid RDCP response: ${JSON.stringify(validate.errors)}`);
  }
  
  return responseData;
}
```

## 🔗 Schema References

Schemas use JSON Schema `$ref` to reference common definitions:

```json
{
  "properties": {
    "protocol": {
      "$ref": "../common/rdcp-common.json#/$defs/protocolVersion"
    },
    "categories": {
      "type": "array",
      "items": {
        "$ref": "../common/rdcp-common.json#/$defs/categoryName"
      }
    }
  }
}
```

## 🧪 Testing & Validation

Schemas are automatically validated in CI using AJV:

- **Syntax validation**: Ensures valid JSON Schema format
- **Reference integrity**: Verifies all `$ref` links resolve correctly  
- **Example validation**: Tests embedded examples against their schemas

## 📚 Schema Features

### Comprehensive Validation

- **Type safety**: Strict typing for all properties
- **Format validation**: Date-time, URI, pattern matching
- **Range constraints**: Min/max values, string lengths
- **Required fields**: Explicit required property declarations

### Real-world Examples

Each schema includes practical examples showing:
- Minimal required requests/responses
- Full-featured requests with all optional fields
- Common error scenarios

### Extensibility

- **Additional properties**: Controlled via `additionalProperties: false`
- **Versioning**: Clear v1 namespace for future protocol versions
- **Reusable components**: Common definitions in `rdcp-common.json`

## 🔄 Versioning Strategy

- **Schema URLs** include version (e.g., `/v1/`)
- **Breaking changes** will increment major version (`/v2/`)
- **Additive changes** will be backward-compatible within version
- **Stable URLs** - once published, schemas won't change

## 💡 Best Practices

### For Implementers

1. **Always validate**: Use schemas to validate both requests and responses
2. **Handle errors gracefully**: Follow RDCP error response format
3. **Use stable URLs**: Reference hosted schemas, don't embed locally
4. **Cache schemas**: Avoid fetching schemas on every validation

### For API Development

1. **Validate early**: Check request format before processing
2. **Provide clear errors**: Use schema validation messages in error responses  
3. **Test compliance**: Use schemas in integration tests
4. **Documentation**: Reference schema URLs in API documentation

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/mojoatomic/rdcp-protocol/issues)
- **Documentation**: [RDCP Protocol Docs](https://mojoatomic.github.io/rdcp-protocol/)
- **Specification**: [RDCP Protocol Specification](../docs/rdcp-protocol-specification.md)

---

*These schemas ensure consistent, reliable RDCP protocol implementations across all programming languages and frameworks.*