/* RDCP Protocol - JSON Schema validation (draft-07)
   Plain text output suitable for CI and local use. */

const fs = require('fs')
const path = require('path')
const Ajv = require('ajv')
const addFormats = require('ajv-formats')
const draft7Meta = require('ajv/dist/refs/json-schema-draft-07.json')

function main() {
  const repoRoot = process.cwd()
  const ajv = new Ajv({ allErrors: true, strict: false })
  try {
    if (!ajv.getSchema('http://json-schema.org/draft-07/schema')) {
      ajv.addMetaSchema(draft7Meta)
    }
  } catch (_) {}
  addFormats(ajv)

  // Preload common schema using its canonical $id to satisfy $ref
  const commonPath = path.join(repoRoot, 'schema/v1/common/rdcp-common.json')
  const commonSchema = JSON.parse(fs.readFileSync(commonPath, 'utf8'))
  ajv.addSchema(
    commonSchema,
    'https://mojoatomic.github.io/rdcp-protocol/schema/v1/common/rdcp-common.json'
  )
  console.log('Loaded common schema')

  const files = [
    'schema/v1/responses/error.json',
    'schema/v1/endpoints/protocol-discovery.json',
    'schema/v1/endpoints/control-request.json',
    'schema/v1/endpoints/control-response.json',
    'schema/v1/endpoints/discovery-response.json',
    'schema/v1/endpoints/status-response.json',
    'schema/v1/endpoints/health-response.json'
  ]

  for (const rel of files) {
    const full = path.join(repoRoot, rel)
    const schema = JSON.parse(fs.readFileSync(full, 'utf8'))

    let validate
    try {
      validate = ajv.compile(schema)
      console.log(`Compiled: ${rel}`)
    } catch (err) {
      console.error(`Compile error in ${rel}: ${err.message}`)
      process.exit(1)
    }

    if (Array.isArray(schema.examples)) {
      schema.examples.forEach((example, i) => {
        const ok = validate(example)
        if (!ok) {
          console.error(`Example ${i + 1} failed in ${rel}`)
          console.error(validate.errors)
          process.exit(1)
        }
      })
      console.log(`Examples valid: ${rel}`)
    }
  }

  console.log('All schemas compiled and examples validated')
}

if (require.main === module) {
  main()
}
