# Catacombs Reference Generator Blueprint Package

Purpose: implementation-ready documentation for replacing diagnostic scaffolding with a production-quality **Catacombs** reference generator while preserving `dungeon-generator-workbench.html` as diagnostic and authoring shell.

- Active environment: **Catacombs**.
- Active layout: **Graph**.
- Status: **active reference environment**.
- Planned, postponed environments: **Garden Maze** (Maze), **Dark Tower** (Tower), **Hell’s Canyon** (Tree/Linear), plus postponed Town and Monastery.
- Warning: do not restore prototype IDs `ancient`, `molten`, `frost`, `grim`, or `verdant` as production themes, aliases, presets, or fallbacks.

## Project boundary

This generator is for the online browser ARPG associated with the Web Companion App. It is not for Godot, the desktop MMORPG client, C++ zone servers, open-world zones, or Godot scenes/resources. The website must not directly mutate MMORPG-authoritative inventory, currency, loot, XP, combat, movement, character, dungeon, zone, or world state. Cross-product benefits must pass through Account/Entitlement Service boundaries.

## Locked authority model

The server generates and stores the authoritative `ResolvedDungeon`, signs a versioned manifest, and authorizes mutable gameplay outcomes. The browser may deterministically reconstruct, compute SHA-256 over canonical bytes, and compare the checksum. On mismatch it must reject local authoritative use and consume the server resolved-payload fallback. Auth0 web authentication is not a game session; private signing keys never reach clients.

## Blueprint documents
- [main_blueprint.md](main_blueprint.md)
- [architecture.md](architecture.md)
- [contracts.md](contracts.md)
- [graph_grammar.md](graph_grammar.md)
- [catacombs_environment_matrix.md](catacombs_environment_matrix.md)
- [spatial_generation.md](spatial_generation.md)
- [construction_asset_registry.md](construction_asset_registry.md)
- [gameplay_content.md](gameplay_content.md)
- [online_authorization.md](online_authorization.md)
- [determinism_serialization.md](determinism_serialization.md)
- [diagnostics_workbench.md](diagnostics_workbench.md)
- [validation_testing.md](validation_testing.md)
- [performance_budgets.md](performance_budgets.md)
- [migration_plan.md](migration_plan.md)
- [implementation_plan.md](implementation_plan.md)
- [requirements_traceability.md](requirements_traceability.md)
- [glossary.md](glossary.md)

## Reference schemas
- [schemas/dungeon-config.schema.json](schemas/dungeon-config.schema.json)
- [schemas/environment-profile.schema.json](schemas/environment-profile.schema.json)
- [schemas/graph-template.schema.json](schemas/graph-template.schema.json)
- [schemas/asset-registry.schema.json](schemas/asset-registry.schema.json)
- [schemas/authorized-dungeon-manifest.schema.json](schemas/authorized-dungeon-manifest.schema.json)
- [schemas/resolved-dungeon.schema.json](schemas/resolved-dungeon.schema.json)
- [schemas/generation-diagnostics.schema.json](schemas/generation-diagnostics.schema.json)
- [schemas/validation-result.schema.json](schemas/validation-result.schema.json)

## Implementation readiness

READY FOR IMPLEMENTATION PROMPTS once this package validates. Later Codex prompts should start at `main_blueprint.md`, follow `implementation_plan.md` phase order, use `contracts.md` and schemas as contract sources, and consult traceability before changing runtime code.
