**DOC1 status:** Supporting/historical reference. For current implemented authority, lifecycle, runtime, and commands, defer to [README.md](README.md), [main_blueprint.md](main_blueprint.md), and [doc1_operations.md](doc1_operations.md).

# Requirements Traceability

[Package README](README.md) · [Main Blueprint](main_blueprint.md) · [Traceability](requirements_traceability.md) · [Glossary](glossary.md)

| ID | Requirement | Source | Blueprint document | Contract/schema | Phase | Validation/test | Gate | Status |
|---|---|---|---|---|---|---|---|---|
|SCOPE-001|Browser ARPG module only; no MMORPG/Godot authority mutation|Prompt|README.md|dungeon-config|1|Boundary review|Contract|Specified|
|GRAPH-001|Layered braided Catacombs graph|Prompt|graph_grammar.md|graph-template|3|Graph property tests|Graph|Specified|
|ROOM-001|All locked Catacombs archetypes traced|Prompt|catacombs_environment_matrix.md|environment-profile|4|Archetype matrix test|Reference Environment|Specified|
|SPATIAL-001|Graph-to-geometry equivalence|Prompt|spatial_generation.md|resolved-dungeon|6|Spatial proof tests|Spatial|Specified|
|ASSET-001|Stable asset registry with fallbacks|Prompt|construction_asset_registry.md|asset-registry|7|Fallback equivalence|Content|Specified|
|GAME-001|Speed Run/Hunt/Endurance transforms after neutral graph|Prompt|gameplay_content.md|dungeon-config|9|Transform revalidation|Content|Specified|
|AUTH-001|Server generated ResolvedDungeon and signed manifest|Prompt|online_authorization.md|authorized-dungeon-manifest|10|Signature/checksum tests|Authority|Specified|
|DET-001|Named RNG streams and checksum scope|Prompt|determinism_serialization.md|resolved-dungeon|2|Determinism tests|Determinism|Specified|
|DIAG-001|Workbench maps inspectors to real data|Prompt|diagnostics_workbench.md|generation-diagnostics|12|Workbench browser tests|Workbench|Specified|
|PERF-001|Quality tiers and budgets|Prompt|performance_budgets.md|resolved-dungeon|13|Performance tests|Performance|Specified|
|TEST-001|Seed sweep tiers and no placeholder true assertions|Prompt|validation_testing.md|validation-result|13|Seed sweeps|Contract|Specified|
| GAP-001 | Canonical checksum excludes volatile timing | Gap analysis blocker 1 | migration_plan.md; determinism_serialization.md; diagnostics_workbench.md | generation-diagnostics / resolved-dungeon | 2 | Regression/validation trace | Determinism | Specified |
| GAP-002 | Typed arrays serialized losslessly | Gap analysis blocker 2 | migration_plan.md; determinism_serialization.md; diagnostics_workbench.md | generation-diagnostics / resolved-dungeon | 2 | Regression/validation trace | Determinism | Specified |
| GAP-003 | Signed manifest/session boundary defined | Gap analysis blocker 3 | migration_plan.md; determinism_serialization.md; diagnostics_workbench.md | generation-diagnostics / resolved-dungeon | 10 | Regression/validation trace | Authority | Specified |
| GAP-004 | Replace linear chain plus jumps | Gap analysis blocker 4 | migration_plan.md; determinism_serialization.md; diagnostics_workbench.md | generation-diagnostics / resolved-dungeon | 3 | Regression/validation trace | Graph | Specified |
| GAP-005 | Real secondary trunks and reconvergences | Gap analysis blocker 5 | migration_plan.md; determinism_serialization.md; diagnostics_workbench.md | generation-diagnostics / resolved-dungeon | 3 | Regression/validation trace | Graph | Specified |
| GAP-006 | Real terminal dead ends | Gap analysis blocker 6 | migration_plan.md; determinism_serialization.md; diagnostics_workbench.md | generation-diagnostics / resolved-dungeon | 3 | Regression/validation trace | Graph | Specified |
| GAP-007 | Computed spatial overlap/contact metrics | Gap analysis blocker 7 | migration_plan.md; determinism_serialization.md; diagnostics_workbench.md | generation-diagnostics / resolved-dungeon | 5 | Regression/validation trace | Spatial | Specified |
| GAP-008 | Real clearance validation | Gap analysis blocker 8 | migration_plan.md; determinism_serialization.md; diagnostics_workbench.md | generation-diagnostics / resolved-dungeon | 5 | Regression/validation trace | Spatial | Specified |
| GAP-009 | No constant-success tests | Gap analysis blocker 9 | migration_plan.md; determinism_serialization.md; diagnostics_workbench.md | generation-diagnostics / resolved-dungeon | 13 | Regression/validation trace | Workbench | Specified |
| GAP-010 | Real asset registry/GLTF loading | Gap analysis blocker 10 | migration_plan.md; determinism_serialization.md; diagnostics_workbench.md | generation-diagnostics / resolved-dungeon | 7 | Regression/validation trace | Workbench | Specified |
| GAP-011 | Functional inspector overlays | Gap analysis blocker 11 | migration_plan.md; determinism_serialization.md; diagnostics_workbench.md | generation-diagnostics / resolved-dungeon | 12 | Regression/validation trace | Workbench | Specified |
| GAP-012 | Staged build animation | Gap analysis blocker 12 | migration_plan.md; determinism_serialization.md; diagnostics_workbench.md | generation-diagnostics / resolved-dungeon | 12 | Regression/validation trace | Workbench | Specified |
| GAP-013 | Immutable generation vs mutable state | Gap analysis blocker 13 | migration_plan.md; determinism_serialization.md; diagnostics_workbench.md | generation-diagnostics / resolved-dungeon | 10 | Regression/validation trace | Authority | Specified |
| GAP-014 | Historical index old themes removed from production | Gap analysis blocker 14 | migration_plan.md; determinism_serialization.md; diagnostics_workbench.md | generation-diagnostics / resolved-dungeon | 14 | Regression/validation trace | Workbench | Specified |

## Phase 1-2 implementation status (2026-07-20)

Status: implemented foundation only. Catacombs graph generation remains deferred to Prompt 4.

Implemented modules:
- `src/dungeon/contracts`: shared immutable generation contracts, manifest/session-state boundary types, and static authority/canonicality metadata.
- `src/dungeon/validation`: AJV 2020-12 runtime schema validation with compiled reusable validators and structured issues.
- `src/dungeon/determinism`: versioned named RNG streams using SHA-256 namespace derivation and xoshiro128** state transitions, plus deterministic retry attempt seed derivation.
- `src/dungeon/canonical`: explicit resolved-dungeon canonical projection, typed-array base64 wrappers, canonical JSON serialization, and SHA-256 checksum helpers.
- `src/dungeon/authorization`: injectable manifest signer/verifier interfaces and compatibility/expiration verification boundaries; no production private keys.
- `src/dungeon/workbench`: narrow adapter for tree inspection, typed-array summaries, canonical export, checksum calls, authority labels, and diagnostics serialization.

Schema corrections:
- `dungeon-config.schema.json` now includes generation mode, layout profile, modifiers, content table versions, and stricter player/seed constraints.
- `environment-profile.schema.json` now reflects layout profiles, sub-biomes, modifiers, compatibility, and active Catacombs-only status.
- `graph-template.schema.json` now classifies procedural/predefined/hybrid template mode.
- `asset-registry.schema.json` now requires authoritative registry entry fields used by the contracts.
- `authorized-dungeon-manifest.schema.json` now includes generator/environment/content versions and resolved payload references.
- `resolved-dungeon.schema.json` now covers the phase-1 resolved payload envelope and canonical typed-array wrapper shape.
- `generation-diagnostics.schema.json` now includes metrics while retaining timing exclusion.

Canonical encoding decisions:
- Canonical JSON uses UTF-8, lexicographically sorted object keys, preserved array order, and rejects undefined, functions, symbols, sparse arrays, cycles, nonfinite numbers, and negative zero.
- Typed arrays are encoded losslessly as `{ typedArray: true, type, endian: "little", length, byteLength, base64 }`; display summaries are separate and noncanonical.
- Authoritative floating typed-array values reject NaN, infinity, and negative zero.

RNG and checksum:
- RNG algorithm/version: `xoshiro128ss-sha256-v1`.
- Namespace derivation: SHA-256 over algorithm version, generator version, root seed, and stable namespace; retry attempts use a namespace-separated attempt stream.
- Test vectors are Jest snapshots under `test/dungeon/__snapshots__/all.test.ts.snap`.
- Checksum format: SHA-256 lowercase hexadecimal over explicit canonical projection bytes; checksum is not a signature.

Signing boundary and workbench status:
- Manifest signing and verification are injectable interfaces only. Test fake signatures are labeled `TEST_FAKE_NONPRODUCTION` and remain test support only.
- Workbench compatibility adapter exists as a module but direct HTML workbench integration is deferred to avoid premature bundling or UI rewrites.

Validation commands:
- `npm test`
- `npm run typecheck`
- `npm run build`
- `git diff --check`

Remaining blockers for Prompt 4:
- Implement the Catacombs layered braided graph generator and semantic graph validation.
- Add room archetype assignment, spatial embedding, corridor routing, raster/navigation validation, construction, gameplay placement, rendering integration, staged animation, and live server signing in later phases only.

## Phase 3 implementation note — Catacombs layered braided graph generator

Implemented in `src/dungeon/graph.ts` with algorithm identifier `catacombs.layered_braided.graph.v3.0.0`. The module exposes `generateCatacombsGraph`, validated Catacombs graph configuration resolution, deterministic stable ID allocation, graph analysis utilities, hard validation issue codes, bounded candidate selection, graph quality component scoring, inspector-ready metrics, and lightweight graph-stage snapshots.

Default profile: Catacombs `graph.catacombs.layered_braided`, medium size unless difficulty/profile overrides request small or large. Candidate policy evaluates a deterministic bounded attempt stream and selects the highest quality valid graph with stable tie-breaking. Quality components cover connectivity, critical path compliance, primary trunk quality, secondary trunk usefulness, divergence/reconvergence quality, immediate-loop usefulness, conditional shortcut usefulness, dead-end purpose coverage, branch-length diversity, depth utilization, route redundancy, backtracking estimate, articulation density, degree distribution, boss separation, and Catacombs profile fit.

Stable diagnostic codes for Phase 3 are exported as `CATACOMBS_GRAPH_DIAGNOSTIC_CODES`, including the required `GRAPH_*` configuration, topology, validation, quality, and exhaustion codes. Unit and multi-seed test vectors are in `test/dungeon/graph.test.ts`; the routine PR suite covers 100 deterministic seeds over small, medium, large, high-loop/secret/conditional profiles. Nightly/release recommendation: run the same graph property harness extended to 10,000 seeds nightly and 100,000 seeds for release candidates.

Workbench status: `src/dungeon/workbench/adapter.ts` now provides a noncanonical graph view model for primary trunks, secondary trunks, divergences, reconvergences, loops, secrets, dead ends, critical paths, depth layers, degree/function views, articulation points, bridge edges, validation targets, and candidate history. The existing inline workbench graph logic remains legacy diagnostic behavior pending full Prompt 11 integration.

Deferred by design: room assignment, room footprints, spatial embedding, corridor routing, rasterization, construction assets, renderer changes, encounters, hazards, objectives, bosses, mutable gameplay state, online session simulation, and reward authorization.

## Prompt 5 / Phase 4 — Catacombs Room Assignment and Semantic Grammar

Implemented in `src/dungeon/roomAssignment.ts` with archetype registry version `catacombs.room_archetypes.v4.0.0` and assignment algorithm version `catacombs.room_assignment.semantic_csp.v4.0.0`.

The phase consumes the validated Prompt 4 `RoomGraph` without topology mutation and emits canonical `AssignedRoom` records with `placementState: "unembedded"`; no coordinates, footprints, corridor paths, raster tiles, Three.js objects, monsters, hazards, reward authorization, game-type transformation, or session-state mutation are produced.

CSP strategy: deterministic bounded single-attempt semantic assignment over graph-derived node contexts. The implementation recomputes degree, normalized depth, critical-path membership, branch membership, terminal/dead-end status, divergence/reconvergence status, conditional-loop endpoint status, secret status, and neighbor IDs before assignment. Mandatory anchors are assigned first by role: Mausoleum Entrance, Entry Crypt, Boss Antechamber, Boss Sepulcher, and Return Portal Chamber when graph/session topology exposes the post-completion exit placeholder. Candidate domains are deterministic and ordered by stable archetype IDs, with roomAssignment RNG used only for non-mandatory fill ordering.

Composition profiles are declared for small, medium, and large Catacombs graphs. They encode required unique rooms, minimum/target/maximum guidance, duplicate restrictions, stable weights, and profile node-count bands. Small graphs keep landmarks compact; medium is the reference variety profile; large supports expanded landmarks and repeated room families.

Validation covers required and unique counts, degree/depth compatibility, boss sequence, terminal-purpose compatibility, secret/conditional compatibility, medium/large peer adjacency restrictions and explicit exceptions, content-slot integrity, and unassigned-node failure. Stable diagnostic codes include all `ROOM_*` codes required by the Phase 4 prompt. Assignment metrics report assigned/unassigned counts, archetype/function/scale/shape distributions, critical-path archetype sequence, combat pacing, terminal/junction/reconvergence fit, violation counts, content-slot totals, landmark distance distribution, diversity, repetition penalty, quality score, attempt count, accepted attempt index, and backtrack count.

Workbench status: production semantic-room view data and legends are exposed through `buildCatacombsRoomAssignmentWorkbenchView`. The single-file HTML workbench remains operable and its inline generic assignment remains legacy diagnostic behavior; no second production registry was added to the HTML.

Fixtures and tests: `test/dungeon/roomAssignment.test.ts` covers the immutable twenty-room registry, mandatory anchors, composition profiles, degree/depth/adjacency validation, terminal-purpose mapping, content slots and deferred profile references, determinism/RNG isolation, structured failure behavior, 100 deterministic graph-to-room seeds across small/medium/large profiles with loops/secrets, distribution snapshots, and workbench adapter data.

Known limitations and Prompt 6 blockers: Phase 4 intentionally stops at semantic assignment. Spatial embedding, room footprint realization, corridor routing, rasterization, construction placement, gameplay placement, authorization integration, renderer integration, and game-type/difficulty transforms remain deferred.

## Phase 5 traceability — Catacombs spatial embedding

- Coordinate convention: graph-grid anchors use integer `{x, y, level}` where `x` is branch lane, `y` is forward progression order, and `level` is `0`; tile-grid origins and masks use integer tile cells.
- Shape-mask convention: `catacombs.shape_mask.row_major_u8.v1.0.0`, index `y * width + x`, occupied value `1`, blocked/outside value `0`.
- Production module: `src/dungeon/spatialEmbedding.ts` exposes `embedCatacombsRooms`, spatial contracts, mask realization, clearance analysis, overlap detection, metrics, snapshots, diagnostics, and `buildCatacombsSpatialWorkbenchView`.
- Diagnostics: Phase 5 stable codes include configuration, shape/mask, anchoring/lane, separation, overlap, padding, boundary, unauthorized-contact, approach, clearance, quality, and exhausted-candidate failures.
- Validation: spatial unit and 100-seed graph-to-room-to-spatial tests cover deterministic dimensions/shapes, masks, overlap, padding, lanes, approaches, clearance, deterministic projection, failure behavior, and workbench summaries.
- Known limitation: separation currently uses deterministic spacing/scatter sufficient for bounded Catacombs fixtures and exact validation; final corridor routing, final doorway selection, raster tile carving, wall/assets/rendering/gameplay/session authority remain Prompt 7+ blockers.

## Phase 6 traceability — routing/raster/navigation

- Algorithm version: `catacombs.corridor_routing.raster_nav.v6.0.0`.
- Contracts/API: `routeAndRasterizeCatacombs` consumes Prompt 4 graph, Prompt 5 assignments, and Prompt 6 embedding/approaches; it returns corridors, doorways, edge boundaries, tile layers, navigation data, metrics, diagnostics, and snapshots.
- Edge order: critical primary passages first, then boss approach, secondary passages, loops, terminal/reward spurs, transitions, conditional shortcuts, secrets, and post-completion exits; ties use stable edge IDs.
- Routing behavior: straight orthogonal routes are tried first, then deterministic horizontal/vertical L routes, bounded double-bend doglegs, and a four-neighbor deterministic A* fallback.
- Width semantics: odd widths expand symmetrically around centerlines; even widths add the deterministic positive-axis extra band. Critical/boss corridors default wider than ordinary/secret routes and are never silently narrowed.
- Doorway model: logical categories include open arches, ordinary doors, ritual barriers, hidden masonry doors, monumental boss entrances, and post-completion thresholds; runtime door simulation is excluded.
- Raster/navigation: room, corridor, and doorway floors are encoded as typed-array/base64 layers with room/corridor ownership; initial and final traversal masks are separate; integer BFS distances use `-1` as unreachable; clearance uses a deterministic Manhattan-style blocked-edge distance.
- Boundaries: walls/openings are edge records on floor tile sides; door openings replace ordinary walls.
- Validation/diagnostics: stable Phase 6 codes cover config/input, approach selection, path routing, doorway, raster, navigation, equivalence, candidate, and quality failures.
- Tests: unit coverage includes routing order, width expansion, successful abstract-to-raster routing, state projections, deterministic reruns, structured failures, workbench adapter projection, and a bounded multi-seed sweep.
- Deferred: construction placements, authored assets, rendering, gameplay placement, game-type transformations, authorization/session mutation, and full workbench overlays remain future phases.
