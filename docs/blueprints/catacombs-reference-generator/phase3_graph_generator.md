**DOC1 status:** Supporting/historical reference. For current implemented authority, lifecycle, runtime, and commands, defer to [README.md](README.md), [main_blueprint.md](main_blueprint.md), and [doc1_operations.md](doc1_operations.md).

# Phase 3 — Catacombs Layered Braided Graph Generator

Algorithm/version: `catacombs.layered_braided.graph.v3.0.0`.

Production module: `src/dungeon/graph.ts`.
Workbench adapter: `src/dungeon/workbench/adapter.ts`.
Tests: `test/dungeon/graph.test.ts`.

The graph generator builds immutable abstract Catacombs topology only. It reserves start, early-entry, boss-approach, finish, and post-completion exit placeholder anchors; creates a monotonic primary trunk; inserts deterministic secondary trunks that diverge and reconverge forward; adds immediate route loops, optional conditional loops, optional secrets, and purposeful terminal branches; computes critical paths and graph metrics; validates hard invariants; and scores bounded candidates.

No room assignment, footprints, coordinates, corridors, tiles, assets, rendering, encounters, hazards, objectives, bosses, mutable session state, or online simulation are implemented in this phase.
