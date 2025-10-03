# RDCP v1.0 — RFC Submission Workspace

This directory contains artifacts to prepare the RDCP Internet-Draft for IETF submission.

- Tracking issue: https://github.com/mojoatomic/rdcp-protocol/issues/31
- Canonical source format: xml2rfc v3 (rdcp-spec.xml)

Quick start

```bash
# Install xml2rfc
pip install xml2rfc

# Generate text (required by IETF)
xml2rfc rdcp-spec.xml --text

# Generate HTML (readable)
xml2rfc rdcp-spec.xml --html

# Validate
xml2rfc rdcp-spec.xml --validate

# Optional nits check (after --text)
# idnits rdcp-spec.txt
```

Structure
- README.md (this file)
- missing-sections.md (Abstract, expanded Security, IANA, references split)
- rdcp-spec.xml (xml2rfc v3 skeleton)
- submission-checklist.md (process steps and tools)
- CHANGELOG.md (draft iteration log)
- reviews/ (store review notes)
