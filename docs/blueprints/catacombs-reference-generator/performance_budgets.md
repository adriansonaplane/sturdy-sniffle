**DOC1 status:** Supporting/historical reference. For current implemented authority, lifecycle, runtime, and commands, defer to [README.md](README.md), [main_blueprint.md](main_blueprint.md), and [doc1_operations.md](doc1_operations.md).

# Performance Budgets

[Package README](README.md) · [Main Blueprint](main_blueprint.md) · [Traceability](requirements_traceability.md) · [Glossary](glossary.md)

## Budgets
| Area | Low | Medium | High |
|---|---:|---:|---:|
| Server generation p95 | 180ms | 250ms | 400ms |
| Client reconstruction p95 | 100ms | 150ms | 250ms |
| Validation p95 | 60ms | 100ms | 180ms |
| Serialization+checksum p95 | 40ms | 75ms | 120ms |
| Resolved payload | 256KB | 512KB | 1MB |
| Scene build | 250ms | 500ms | 900ms |
| Draw calls | 80 | 140 | 220 |
| Triangles | 150k | 350k | 700k |
| Dynamic lights | 8 | 16 | 32 |
| Particles | 500 | 1500 | 3000 |
| Texture memory | 64MB | 128MB | 256MB |
| Geometry memory | 64MB | 128MB | 256MB |
| Active monsters | 40 | 80 | 140 |
| Active hazards | 20 | 40 | 80 |
| Frame time p95 | 16.7ms | 16.7ms | 33.3ms |
| Disposal no-leak delta | <1MB | <2MB | <4MB |

Gameplay-critical telegraphs cannot be disabled by quality settings. Multi-seed testing should batch without scene build unless testing renderer performance.
