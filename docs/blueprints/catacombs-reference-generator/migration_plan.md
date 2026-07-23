**DOC1 status:** Supporting/historical reference. For current implemented authority, lifecycle, runtime, and commands, defer to [README.md](README.md), [main_blueprint.md](main_blueprint.md), and [doc1_operations.md](doc1_operations.md).

# Migration Plan

[Package README](README.md) · [Main Blueprint](main_blueprint.md) · [Traceability](requirements_traceability.md) · [Glossary](glossary.md)

## Rule
This task changes documentation only. Later migration must preserve user changes and avoid application edits outside planned phases.

| Existing component | Classification | Later action |
|---|---|---|
| Single-file workbench shell | Preserve | Keep as diagnostic authoring shell |
| Named RNG streams | Extend | Version derivation and stream ownership |
| Current canonicalization | Replace | Exclude volatile data; lossless typed arrays |
| Current checksum | Replace | SHA-256 over canonical bytes plus server compare |
| Current graph generator | Replace | Layered braided Catacombs grammar |
| Room assignment | Replace | Archetype/constraint module |
| Spatial placement | Replace | Forward-axis/lane embedding |
| L-corridor routing | Extend/Replace | Declared-edge routing with A* fallback |
| Typed-array rasterization | Extend | Keep efficient storage; canonical lossless encoding |
| BFS distance field | Extend | Add clearance/nav regions/contact proof |
| Procedural primitives | Preserve | Development fallbacks and diagnostics |
| Instancing | Preserve | Renderer optimization |
| Current assets | Replace/Extend | Stable registry and authored GLTF loading |
| Gameplay markers | Replace | Content-table placements and server state keys |
| Diagnostics | Extend | Real targeted diagnostics |
| In-page tests | Replace | No constant-success assertions |
| Import/export | Extend | Schema validation and manifest import/export |
| Animation controls | Extend | Real staged build animation |
| Historical index.html | Remove from production assumptions | Keep untouched until site migration |
| Old environment themes | Remove | Never register ancient/molten/frost/grim/verdant as production |
