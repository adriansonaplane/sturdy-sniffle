# Phase 4 — Catacombs Room Assignment and Semantic Grammar

Registry version: `catacombs.room_archetypes.v4.0.0`.
Assignment algorithm version: `catacombs.room_assignment.semantic_csp.v4.0.0`.

This phase assigns immutable semantic room records to a valid Catacombs layered braided graph. It preserves graph node identity and topology, assigns mandatory semantic anchors, validates semantic grammar, emits metrics/snapshots/diagnostics, and returns unembedded `AssignedRoom` data ready for Prompt 6.

Implemented archetypes:

- Mausoleum Entrance
- Entry Crypt
- Burial Passage
- Ossuary Gallery
- Crypt Junction
- Gate Chamber
- Family Crypt
- Burial Cell
- Embalming Chamber
- Bone Repository
- Reliquary
- Memorial Chapel
- Royal Cubiculum
- Collapsed Crypt
- Ritual Chamber
- Grand Ossuary
- Sealed Tomb
- Boss Antechamber
- Boss Sepulcher
- Return Portal Chamber

Assignment strategy:

1. Validate the immutable archetype registry.
2. Recompute node assignment context from the graph.
3. Build deterministic candidate domains.
4. Assign mandatory anchors by graph role.
5. Assign terminal, divergence, reconvergence, critical-path, and filler rooms with stable ordering and the `roomAssignment` RNG stream.
6. Validate the assigned semantic graph.
7. Emit metrics, noncanonical snapshots, and structured diagnostics.

Deferred references use `catacombs.deferred.*` namespaces and are intentionally unresolved until later phases. No coordinates, footprints, scatter, separation, tile arrays, Three.js objects, monster spawns, hazards, reward authorization, game-type transforms, or live session state are produced here.
