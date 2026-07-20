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
