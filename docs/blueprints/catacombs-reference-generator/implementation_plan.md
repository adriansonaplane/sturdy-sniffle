# Implementation Plan

[Package README](README.md) · [Main Blueprint](main_blueprint.md) · [Traceability](requirements_traceability.md) · [Glossary](glossary.md)

## Ordered phases
| # | Phase | Objective | Inputs | Expected files/modules | Requirements/tests/diagnostics/exit | Dependencies/Risks/Rollback |
|---:|---|---|---|---|---|---|
| 1 | Contracts and schemas | Establish shared contracts | This package | proposed shared contract package | Schema tests pass; authority/canonical flags documented | none; rollback docs only |
| 2 | Deterministic foundation | RNG/canonical bytes/checksum | contracts, determinism | rng, serializer, checksum | Same-seed stable; typed arrays lossless | phase 1; risk checksum churn |
| 3 | Catacombs graph generator | Layered braided topology | grammar, matrix | graph module | 100 seed PR sweep graph gate | phase 2 |
| 4 | Room assignment | Archetype constraints | matrix | room module | degree/adjacency/boss sequence tests | phase 3 |
| 5 | Spatial embedding | Forward lanes/footprints | spatial | spatial module | no overlaps/contact; clearance diagnostics | phase 4 |
| 6 | Corridor routing and boundaries | Physical graph equivalence | spatial | routing/raster/nav | every edge connected; every contact declared | phase 5 |
| 7 | Construction and asset registry | Asset IDs/fallbacks | asset docs/schema | registry/construction | fallback equivalence tests | phase 6 |
| 8 | Gameplay placement | Immutable content placements | gameplay | gameplay placement | objective/encounter/hazard validation | phase 7 |
| 9 | Game-type transformations | Speed Run/Hunt/Endurance | gameplay | transform module | neutral graph then transform/revalidate | phase 8 |
| 10 | Online authorization | Manifest/session/checksum flow | auth | server endpoints/services proposed | signature/fallback tests | phases 1-2; key boundary risk |
| 11 | Three.js/workbench integration | Renderer consumes resolved data | diagnostics/assets | adapters/scene builder | browser smoke/disposal | phases 7-10 |
| 12 | Diagnostics and authoring | Real inspectors/stages | diagnostics | workbench adapter panels | simulated labels removed or marked | phase 11 |
| 13 | Property testing and hardening | Seed sweeps/failure injection | validation | test suites | PR/nightly/RC thresholds | all prior |
| 14 | Documentation and handoff | Final docs and examples | all | docs/examples | acceptance gates documented | all prior |

Each phase must define rollback by preserving the last valid generator version and manifest compatibility fallback. Deferred work: planned environments, final authored art, and MMORPG entitlement implementation.

## Phase 5 implementation note — Spatial embedding and room footprint realization

Status: implemented in shared TypeScript generator modules as `catacombs.spatial_embedding.footprints.v5.0.0` with shape-mask format `catacombs.shape_mask.row_major_u8.v1.0.0`.

Implemented scope: deterministic graph-grid anchors, branch lanes, integer tile origins, room dimensions, row-major `Uint8Array` local masks, room occupancy, padding summaries, door-candidate regions, connection-approach candidates, preliminary room-local clearance, bounds, diagnostics, quality metrics, snapshots, and workbench adapter summaries.

Deferred scope remains unchanged: final corridor routing, doorway selection, wall construction, construction assets, Three.js rendering overlays, gameplay placement, game-type transformations, and online session state are not implemented by Phase 5.

Routine command: `npm test -- --runInBand test/dungeon/spatialEmbedding.test.ts`.
Nightly/release seed sweep currently lives in the spatial test suite's 100-seed graph/room/spatial case.

## Phase 6 implementation note — Catacombs Corridor Routing, Doorways, and Tile Rasterization

Status: shared-module foundation implemented as `catacombs.corridor_routing.raster_nav.v6.0.0`.

Implemented scope:
- deterministic graph-edge classification and routing order for primary, boss, secondary, loop, spur, conditional, secret, and post-completion passages;
- validated routing configuration with four-neighbor canonical navigation defaults, bounded bend/length/candidate settings, width policies, and stable diagnostic codes;
- selected Prompt 6 connection approaches and generated routed corridor records, logical doorway records, raster tile layers, ownership layers, edge-based boundary records, initial/final traversal masks, integer BFS distance fields, Manhattan-style clearance fields, navigation regions, portals, metrics, diagnostics, and snapshots;
- straight, L, double-bend, and deterministic A* fallback primitives are present, with simple L routing retained only as one bounded strategy;
- workbench adapter projection exposes routing/raster/navigation data without duplicating routing logic.

Known limitations:
- Phase 6 intentionally remains geometry/navigation data only; no assets, GLTF loading, Three.js rendering, props, monsters, hazards, objectives, game-type transforms, or mutable online session state were implemented.
- Routine CI covers a 20-seed abstract-to-raster sweep to keep verification bounded; nightly/release should raise the same Jest routing property loop to 100+ seeds or add a dedicated benchmark harness.
- Junction promotion is diagnostic-only; graph topology is never mutated in this phase.

Prompt 8 blocker summary: construction records can now consume corridors, doorways, tile ownership, edge-based boundaries, navigation masks, regions, and portals, but authored structural asset placement and material/mesh resolution remain deferred.
