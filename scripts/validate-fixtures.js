#!/usr/bin/env node
// Validate selected fixtures against versioned JSON Schemas (Phase 1)
const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

function loadJSON(p) { return JSON.parse(fs.readFileSync(p, 'utf8')); }

// Preload all protocol schemas so $id/$ref resolution works
function preloadSchemas(rootDir) {
  const base = process.cwd();
  function toPosix(p) { return p.split(path.sep).join('/'); }
  function walk(dir) {
    for (const entry of fs.readdirSync(dir)) {
      const full = path.join(dir, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (entry.endsWith('.json')) {
        const s = loadJSON(full);
        // Register by $id if present
        if (s.$id) ajv.addSchema(s, s.$id);
        // Also register by absolute and repo-relative POSIX paths to satisfy relative $ref resolution
        const absKey = toPosix(path.resolve(full));
        const relKey = toPosix(path.relative(base, full));
        ajv.addSchema(s, absKey);
        ajv.addSchema(s, relKey);
      }
    }
  }
  walk(rootDir);
}

function toPosixPath(p) { return p.split(path.sep).join('/'); }

function validateWith(schemaPath, dataPath) {
  // Prefer using the preloaded schema key (repo-relative POSIX path)
  const key = toPosixPath(schemaPath);
  let validate = ajv.getSchema(key);

  // Fallback: try by $id or compile if not preloaded for some reason
  if (!validate) {
    const schema = loadJSON(schemaPath);
    const id = schema.$id || key;
    validate = ajv.getSchema(id) || ajv.compile(schema);
  }

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

// Ensure schemas are preloaded for $ref resolution
preloadSchemas(path.join(base, 'schema'));

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
