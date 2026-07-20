# Validation and Testing

[Package README](README.md) · [Main Blueprint](main_blueprint.md) · [Traceability](requirements_traceability.md) · [Glossary](glossary.md)

## Test families
Unit, contract/schema, property-based, regression seed, integration, browser, client/server checksum, manifest verification, import/export, resource disposal, accessibility, performance, failure-injection, and migration tests. Use Jest and Playwright when the implementation repository supports them. Placeholder `true` assertions are forbidden.

## Seed sweep tiers
| Tier | Seeds |
|---|---:|
| Pull request | 100 |
| Nightly | 10,000 |
| Release candidate | 100,000 |
| Environment migration | preserved regression set plus new samples |

## Release thresholds
Invalid-generation rate 0 for blocking gates; retry p95 <= 2 and max <= 8; checksum mismatch 0; server generation p95 <= 250ms for medium; client reconstruction p95 <= 150ms; graph quality >= 0.80; fallback required asset rate 0 for production-authored assets, allowed for development with diagnostics; browser hard failures 0 in supported matrix.
