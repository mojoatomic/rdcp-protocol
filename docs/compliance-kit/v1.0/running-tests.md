# Running Tests and Validation (v1.0)

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

For endpoint curl examples, see the Compliance Kit README in the repository:
- https://github.com/mojoatomic/rdcp-protocol/tree/main/compliance-kit/v1.0