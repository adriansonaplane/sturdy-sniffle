**DOC1 status:** Supporting/historical reference. For current implemented authority, lifecycle, runtime, and commands, defer to [README.md](README.md), [main_blueprint.md](main_blueprint.md), and [doc1_operations.md](doc1_operations.md).

# Diagnostics and Workbench

[Package README](README.md) · [Main Blueprint](main_blueprint.md) · [Traceability](requirements_traceability.md) · [Glossary](glossary.md)

## Role
The completed single-file workbench remains the diagnostic shell. Production modules are proposed shared packages; a bundling adapter exposes contracts/generator functions to the workbench without duplicating algorithms. UI state and staged animation are noncanonical.

## Inspector mapping
| Production data | Graph | Spatial | Gameplay | Asset | Resolved | Diagnostics | Tests | Performance | Animation |
|---|---|---|---|---|---|---|---|---|---|
| graphs/branches/depth | yes | context | route context | no | yes | issues | graph tests | score | stage |
| rooms/footprints | degree | yes | slots | sockets | yes | targets | spatial tests | area | stage |
| tiles/boundaries | edge equivalence | yes | traversal | collision/nav | yes | targets | reachability | payload | raster stage |
| placements/content | objective graph | safe regions | yes | asset refs | yes | targets | gameplay tests | active counts | gameplay stage |
| assets/materials/drawcalls | no | footprints | readability | yes | yes | missing/fallback | asset tests | budgets | scene stage |
| manifest/checksum | no | no | authority | no | yes | mismatch | checksum tests | bytes/time | auth stage |

## Diagnostics
Stable codes include GRAPH_DEGREE_INVALID, GRAPH_RECONVERGENCE_INVALID, SPATIAL_UNAUTHORIZED_CONTACT, SPATIAL_CLEARANCE_FAIL, ASSET_FALLBACK_REQUIRED, AUTH_CHECKSUM_MISMATCH, DET_TYPED_ARRAY_LOSSY, TEST_PLACEHOLDER_ASSERTION. Diagnostics have severity, stage, target, attempt, real/simulated status, and resolution hint. Inspector filters, viewport focus, import/export validation, multi-seed testing, and staged build snapshots consume real data.
