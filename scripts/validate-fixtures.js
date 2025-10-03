#!/usr/bin/env node
// Validate selected fixtures against versioned JSON Schemas (Phase 1)
import fs from 'node:fs';
import path from 'node:path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

function loadJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }
function validateWith(schemaPath, dataPath) {
  const schema = loadJSON(schemaPath);
  const validate = ajv.compile(schema);
  const data = loadJSON(dataPath);
  const ok = validate(data);
  if (!ok) {
    console.error(`\n❌ Validation failed for ${dataPath} against ${schemaPath}`);
    console.error(validate.errors);
    process.exitCode = 1;
  } else {
    console.log(`✅ ${dataPath} ✓`);
  }
}

// Base paths (run from repo root)
const base = process.cwd();
const kit = path.join(base, 'compliance-kit', 'v1.0');

// Positive fixtures to validate
validateWith('schema/v1/endpoints/protocol-discovery.json', path.join(kit, 'fixtures/well-known/response-200.json'));
validateWith('schema/v1/endpoints/discovery-response.json', path.join(kit, 'fixtures/discovery/response-200.json'));
validateWith('schema/v1/endpoints/control-request.json', path.join(kit, 'fixtures/control/request-enable-valid.json'));
validateWith('schema/v1/endpoints/control-response.json', path.join(kit, 'fixtures/control/response-200.json'));
validateWith('schema/v1/endpoints/status-response.json', path.join(kit, 'fixtures/status/response-200.json'));
validateWith('schema/v1/responses/error.json', path.join(kit, 'fixtures/errors/401-unauthorized.json'));
validateWith('schema/v1/responses/error.json', path.join(kit, 'fixtures/errors/403-forbidden.json'));
validateWith('schema/v1/responses/error.json', path.join(kit, 'fixtures/errors/404-not-found.json'));

console.log('\nCompliance kit fixtures validated.');
