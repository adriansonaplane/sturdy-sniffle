# Main Blueprint

[Package README](README.md) · [Main Blueprint](main_blueprint.md) · [Traceability](requirements_traceability.md) · [Glossary](glossary.md)

## 1. Executive summary
The Catacombs Reference Generator is a proposed production generator for the browser ARPG module. It replaces the current single-file diagnostic generator with shared contracts, deterministic generation, server authority, client reconstruction, and real workbench diagnostics.

## 2. Scope
Define architecture, contracts, graph grammar, Catacombs rules, spatial embedding, construction, gameplay placement, game-type transforms, determinism, authorization, diagnostics, validation, performance, migration, implementation order, and acceptance gates.

## 3. Explicit non-goals
No application implementation, runtime wiring, tests, package changes, asset changes, Godot/MMORPG zone work, or MMORPG live-state mutation.

## 4. Locked decisions
Catacombs/Graph is active. Planned environments are Garden Maze, Dark Tower, and Hell’s Canyon. Prototype IDs `ancient`, `molten`, `frost`, `grim`, `verdant` are not production environments. Authority is server-generated `ResolvedDungeon` plus signed manifest. The graph has world/area, room/passage, tile-navigation, and Three.js render layers. A grid tile is not a room node. The formal loop term is `conditional loop`.

## 5. Current-state findings
Repository evidence shows the workbench is single-file with pinned Three.js CDN import, inline `generateDungeon`, typed-array grids, placeholder checksum/diagnostics, simulated graph features, placeholder assets, label-only overlays, and constant-success tests. Historical `index.html` is stale and retains old theme controls. The gap analysis records these as blockers to resolve, not as production facts.

## 6. Target architecture
Server generation service invokes generator core modules, stores immutable resolved payloads, signs manifests, and owns mutable session state. Browser clients reconstruct for presentation only and fall back to server payloads. Workbench adapters consume shared contracts and modules without duplicating algorithms.

## 7. Generation lifecycle
Request -> session creation -> neutral Catacombs graph -> room assignment -> spatial embedding -> routing/raster/navigation -> construction placements -> gameplay placements -> game-type transform -> full validation -> canonical serialization -> checksum -> signed manifest -> storage -> client reconstruction/verification -> scene build.

## 8. Core contracts
Use `DungeonConfig`, profiles, graphs, rooms, tile layers, placements, encounters, diagnostics, manifests, and `ResolvedDungeon` from `contracts.md` and matching schemas.

## 9. Catacombs graph grammar
Layered braided graph: one primary trunk, optional secondary trunks, divergence, forward reconvergence, immediate/conditional/secret loops, intentional dead ends, critical path, no arbitrary lateral links, and no undeclared spatial contacts.

## 10. Room-system summary
Room nodes independently declare category, scale, function, archetype, shape, degree constraints, adjacency constraints, depth range, eligibility, footprint, door capacity, content slots, and clearance. Mandatory sequence: Mausoleum Entrance -> ... -> Boss Antechamber -> Boss Sepulcher -> optional Return Portal Chamber.

## 11. Spatial-generation summary
Accept abstract graph first, embed on forward axis with branch lanes, oversample candidates, enforce separation/padding, route declared edges only, rasterize with ownership, compute distance/clearance fields, and validate graph-to-geometry equivalence.

## 12. Construction summary
Generator returns stable asset IDs and placement data only. Asset registry covers authored GLTF/GLB, fallbacks, materials, textures, effects, footprints, sockets, LODs, bundles, dependencies, destruction states, and quality tiers.

## 13. Gameplay summary
Generate immutable placements for objectives, encounters, hazards, events, bosses, sockets, and rewards from versioned content tables. Combat statistics and mutable monster/objective state remain server content/session concerns.

## 14. Online-authorization summary
Server signs a manifest envelope; clients verify signature, reconstruct, compare checksum, and reject local authoritative use on mismatch. Reward authorization never trusts client completion claims.

## 15. Determinism summary
Named RNG streams derive from root seed, generator version, and stable namespace. Canonical payload excludes volatile/render/UI data and uses lossless typed-array encoding. SHA-256 covers canonical serialized bytes.

## 16. Diagnostics/workbench summary
Workbench remains the single-file diagnostic shell but should consume production modules via adapters/bundles. Inspectors must show real graph, spatial, gameplay, asset, resolved, diagnostic, test, performance, and staged animation data.

## 17. Testing summary
No placeholder `true` assertions. Use unit, schema, property, regression seed, integration, browser, checksum, manifest, import/export, disposal, accessibility, performance, failure-injection, and migration tests.

## 18. Performance summary
Budgets separate server generation, client reconstruction, validation, serialization, checksum, payload size, scene build, draw calls, triangles, lights, particles, memory, active gameplay entities, frame time, disposal, and seed sweeps.

## 19. Migration summary
Preserve the completed workbench shell, extract or replace scaffolding in later prompts, remove production assumptions for old themes, and keep historical files unchanged until planned migration phases.

## 20. Implementation phases
Follow the 14 phases in `implementation_plan.md`, beginning with contracts/schemas and deterministic foundation.

## 21. Milestone acceptance gates
A Contract, B Determinism, C Graph, D Spatial, E Content, F Authority, G Workbench, H Reference Environment. Garden Maze does not begin before H passes.

## 22. Deferred work
Garden Maze, Dark Tower, Hell’s Canyon, Town, Monastery, final authored art, production combat stat balancing, and MMORPG entitlement integration implementation.

## 23. Links to detailed documents
See the package README for every document and schema link.
