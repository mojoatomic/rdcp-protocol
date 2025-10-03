# WARP Development Guidelines for rdcp-protocol

Repository: rdcp-protocol  
Purpose: Protocol specification and reference documentation

---

## 1. Scope and General Principles
- This file applies only to the rdcp-protocol repository (language‑agnostic protocol spec and artifacts).
- The repository is the canonical RDCP protocol specification. Maintain a professional, technical tone appropriate for a standards specification.
- Documentation and CI output must be plain text; avoid conversational tone and do not use emojis in commit messages, PR titles/descriptions, scripts, or CI output.

### Language and Tone
- Use neutral, objective language; avoid promotional or marketing language.
- Write for implementers and technical audiences.
- Be precise and unambiguous; prefer normative phrasing.

---

## 2. Versioning and Stability (Schemas)
- JSON Schemas are versioned under schema/vN (e.g., schema/v1). Once published, schemas in a given version MUST remain stable; fixing typos in descriptions is allowed, changing validation semantics is not.
- Breaking schema changes require a new major version directory (e.g., schema/v2). Additive fields are allowed within a major version if they are optional and do not change validation of previously valid instances.
- Canonical $id: use https://mojoatomic.github.io/rdcp-protocol/schema/v{major}/… for all published schemas.
- $schema: use http://json-schema.org/draft-07/schema (Ajv compatibility).

---

## 3. Commit Standards
**Format:** `type(scope): concise description`
- Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`
- Scopes: `schema`, `spec`, `ci`, `docs`, `examples`
- Descriptions: lowercase, imperative mood, no period; use single quotes when committing from the CLI.

Good examples:
- fix(schema): correct duration type in control request schema
- docs(spec): clarify multi-tenancy isolation levels
- chore(ci): add JSON schema validation workflow

Avoid:
- "✅ Fixed the schemas! 🎉" or "WIP stuff"

---

## 4. Documentation Standards
- Use RFC 2119 keywords correctly (MUST, SHOULD, MAY).
- Reference numbered sections when citing the specification.
- Provide concrete examples for abstract concepts.
- Maintain consistent terminology throughout.

---

## 5. Context7 MCP (Required First Step)

Context7 MCP is available and MUST be consulted before troubleshooting any technical issue or performing API/library work.

Recommended flow:
- resolve-library-id → get-library-docs to fetch authoritative docs
- Apply Context7’s recommended solution first; only then attempt custom fixes
- Document which Context7 guidance you applied (e.g., in PR description or issue comment)

Use Context7 MCP for:
- JSON Schema specifications and validation
- MkDocs and Material configuration questions
- GitHub Actions and CI troubleshooting
- Standards and RFC references

Do not rely on outdated training data when Context7 can provide current guidance.

---

## 6. Validation and CI
- Always run `node scripts/validate-schemas.js` locally before pushing; ensure it passes.
- CI must pass the "Validate JSON Schemas" workflow; do not open PRs with failing validation.
- PRs MUST pass site build: `mkdocs build --strict` (run automatically on pull_request) before merge.
- Keep CI and validator output plain text (no emojis).

Quality requirements:
- All JSON Schemas must validate against their meta-schemas.
- Embedded examples must validate against their schemas.
- Documentation must be technically accurate; no placeholder or TODO content on main.

---

## 7. Repository Content Guidelines
- This repository contains: Markdown specification, JSON Schemas, minimal validation scripts, and CI config. No SDK code belongs here.
- Prefer `$defs` and `$ref` for reusable schema fragments; set `additionalProperties` deliberately (usually false for protocol objects).
- Include realistic examples in each schema; examples MUST validate.

What does not belong here:
- Implementation-specific compliance reports
- Framework adapters or integration code
- Performance benchmarks
- SDK-specific testing guides

---

## 8. Change Management and Review Process
- No direct pushes to main. Use PRs with squash merge; delete branches after merge.
- Keep PRs focused (schemas, docs, or CI) to ease review.
- All changes require validation to pass.
- Breaking changes require version bump consideration.
- Documentation changes should be reviewed for clarity.
- Schema changes require careful consideration of backward compatibility.

---

## 9. Documentation Publishing
- The docs site (MkDocs Material) is for specification and guidance only; keep tone formal.
- Do NOT commit directly to `gh-pages`. Docs are versioned and deployed with `mike` via GitHub Actions on merges to `main` (aliases include `latest` and specific versions like `1.0`).
- When referencing schemas, link to the canonical $id URLs under `/schema/v{major}/` rather than repo-relative JSON paths when pointing implementers to the machine definitions.

---

## 10. Security and Provenance
- Do not embed secrets in scripts, CI, or docs.
- Validation must not fetch remote resources during CI; resolve references locally by preloading common defs.

---

## 11. Local Developer Checklist
- Run: `node scripts/validate-schemas.js` (passes locally).
- Ensure: all `$id` and `$schema` fields are correct; examples validate; CI workflow untouched unless necessary.
- Use plain text status lines; avoid chatty/log‑spam output.

## Documentation Requirements

**Critical Rule**: Every artifact in this repository must be documented or it cannot be included.

### What Requires Documentation

- **JSON Schemas**: Each schema file requires a corresponding markdown page and a site navigation entry.
  - Purpose and use case
  - Field definitions and constraints
  - At least one valid example that passes schema validation
  - Validation requirements
  - Location & naming: place pages under `docs/schemas/` (e.g., `docs/schemas/common.md`, `docs/schemas/endpoints/<name>.md`, `docs/schemas/responses/<name>.md`)
  - Add the page to `mkdocs.yml` under the Schemas section

- **Examples**: Example payloads need context explaining:
  - What scenario they demonstrate
  - Which schema they validate against
  - Expected use cases

- **Tools/Scripts**: Any automation requires:
  - Purpose and usage instructions
  - Integration points (CI, local development)
  - Expected inputs and outputs

- **Configuration Files**: CI workflows, build configs need:
  - What they do
  - When they run
  - How to modify them

### Documentation Standards

- Create markdown files in `docs/` directory
- Add to `mkdocs.yml` navigation
- Include concrete examples
- Link to related specifications

### Enforcement

- Pull requests adding undocumented artifacts will be rejected
- Existing undocumented files should be documented or removed
- CI should validate that schemas referenced in docs actually exist

**Rationale**: This is a protocol specification repository. Implementers need clear documentation to use any artifacts we provide. Files without documentation provide zero value and create confusion.

