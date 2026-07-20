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
