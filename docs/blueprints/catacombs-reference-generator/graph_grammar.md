# Graph Grammar

[Package README](README.md) · [Main Blueprint](main_blueprint.md) · [Traceability](requirements_traceability.md) · [Glossary](glossary.md)

## Requirements
Graph hierarchy is world/area -> room-and-passage -> tile-navigation -> rendered scene. Grid tiles are never room nodes. Catacombs topology is driven by layered grammar, not Delaunay/MST; geometric graph aids may be used only after abstract topology is accepted.

## Vocabulary
Node categories: room, junction, landmark, transition. Scales: connector, small, medium, large, landmark. Functions include start, traversal, branch, gate, key, treasure, shrine, hazard, event, boss_antechamber, boss, return_exit. Edge categories: passage, door, gate, secret, portal. Edge states: open, closed, locked, secret, sealed. Generation direction is forward; ordinary traversal is bidirectional. Criticality is critical, optional, secret, or return.

## Catacombs structures
Primary trunk carries start-to-boss progression. Secondary trunks are tree-like forward progressions that diverge and reconverge deeper. Immediate loops reconnect quickly without a gate. Conditional loops require a declared lock/key dependency. Secret loops are optional and never required for completion. Dead ends are terminal branches with purpose: reward, optional combat, lore, key dependency, or pacing.

## Degree and adjacency rules
Connector defaults 1-4, small 1-3, medium 1-2, large 1-3, landmark function-specific. Direct medium-to-medium and large-to-large edges require archetype permission. Boss Antechamber directly connects to Boss Sepulcher. No arbitrary lateral cross-links and no undeclared spatial contacts.

## Lock/key dependency graph
Dependencies are a DAG over objectives, gates, secret reveals, and conditional loops. Keys/objectives must appear at equal or shallower depth than the locked edge and on reachable paths that do not require the same lock.

## Generation modes
Predefined uses versioned templates. Procedural builds from the grammar. Hybrid reserves expansion slots with independent slot seeds; failed slots do not perturb successful slots.

## Pseudocode
```text
create depth layers
place Mausoleum Entrance in layer 0
build primary trunk through increasing layers
reserve Boss Antechamber in penultimate layer
reserve Boss Sepulcher in final layer
for each secondary trunk slot with slotSeed(graph, slotId):
  choose divergence on existing reachable path
  grow 1..N forward branch nodes in deeper layers
  choose reconvergence strictly deeper than divergence
  add branch metadata and edges
for each immediate/conditional/secret loop slot:
  choose legal divergence/reconvergence pair
  attach dependency for conditional or reveal for secret
for each dead-end slot:
  choose divergence and grow terminal forward branch
  assign declared purpose
assign critical path and final critical path after shortcuts
reject if degree, adjacency, boss sequence, dependency, or articulation rules fail
score graph and keep best valid attempt
```

## Validation
Validators compute connectivity, degree legality, forward-depth compliance, articulation points, branch/reconvergence legality, dependency acyclicity, critical path reachability, terminal dead ends, and boss sequence.
