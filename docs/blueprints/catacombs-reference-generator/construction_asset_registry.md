**DOC1 status:** Supporting/historical reference. For current implemented authority, lifecycle, runtime, and commands, defer to [README.md](README.md), [main_blueprint.md](main_blueprint.md), and [doc1_operations.md](doc1_operations.md).

# Construction and Asset Registry

[Package README](README.md) · [Main Blueprint](main_blueprint.md) · [Traceability](requirements_traceability.md) · [Glossary](glossary.md)

## Registry
Stable asset IDs use namespaces such as `catacombs.floor.stone_slab`. Entries declare authored GLTF/GLB URI, procedural fallback, material/texture/effect references, collision and navigation footprints, sockets, LODs, destruction states, quality tiers, bundles, and dependencies.

## Generator/renderer split
The generator returns `ConstructionPlacement` and asset IDs; it never creates Three.js objects. The renderer loads/caches assets, chooses active LOD/quality, creates meshes, handles isometric wall cutaways, and disposes resources.

## Fallback equivalence
Every gameplay-required authored asset must have a functional procedural fallback preserving footprint, collision, navigation, clearance, interaction sockets, and readability. Missing required assets without fallback are blocking validation errors; optional cosmetic assets degrade with diagnostics.

## Construction families
Floors, walls, edge boundaries, doors, gates, arches, pillars, ceilings, trim, props, prop clusters, materials, textures, decals, fixtures, effects, collision, navigation, sockets, and resource ownership are registry-driven.
