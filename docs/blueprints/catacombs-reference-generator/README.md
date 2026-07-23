# Catacombs Reference Generator Documentation Package

**Status:** normative package for the implemented Catacombs generator after D1, D2, D3, T1A, T1B, and T1C. Historical blueprint intent remains useful only where this package labels it as historical or deferred.

## Authority hierarchy

| Level | Document | Kind | Role |
| --- | --- | --- | --- |
| 1 | [../../../README.md](../../../README.md) | Normative overview | Project setup, current status, command index, and navigation. |
| 2 | [main_blueprint.md](main_blueprint.md) | Normative architecture | Authoritative Catacombs implementation contract and lifecycle. |
| 3 | [doc1_operations.md](doc1_operations.md) | Operational/reference | Testing, replay, performance, CI, runtime, workbench, security, troubleshooting, extension, limitations, and handoff. |
| 4 | Schema files in [schemas/](schemas/) and source files in [../../../src/dungeon/](../../../src/dungeon/) | Reference | Actual validation and TypeScript contract sources. |
| 5 | Remaining phase documents and traceability files | Historical/supporting | Original design context; defer to `main_blueprint.md` when wording conflicts with implemented code. |
| 6 | Generated files and artifacts | Generated | `dungeon-generator-workbench.html`, `artifacts/t1/**`, `coverage/**`, Playwright reports. |

## Implemented scope

- Active environment: **Catacombs**.
- Planned future environments: **Garden Maze**, **Dark Tower**, **Hell’s Canyon**.
- Production entry point: `generateCatacombs` in `src/dungeon/generationPipeline.ts`.
- Core D1 entry point: `generateCatacombsCore` in `src/dungeon/generation/index.ts`.
- Workbench entry point: `src/dungeon/workbench/main.ts`; generated distributable: `dungeon-generator-workbench.html`.
- Runtime: Node.js 24.18.0 with bundled npm 11.16.0.

## Boundary warnings

- This generator belongs to the Web Companion App. It does not directly generate Godot MMORPG maps or mutate MMORPG live state.
- Server-side generation and signed online manifests are authoritative. Local workbench generation is diagnostic/prototype-only.
- `DungeonRenderInput` is the client rendering boundary. Diagnostics, `GenerationDiagnostics`, and `ResolvedDungeon` must not be treated as production render input or as local reward/session authority.
- Importing a local configuration or replay record does not grant rewards, sessions, entitlements, or online authority.
- Test/prototype signing keys are non-production only.

## Document map

| Document | Kind | Notes |
| --- | --- | --- |
| [main_blueprint.md](main_blueprint.md) | Normative | Reconciled implementation contract. |
| [doc1_operations.md](doc1_operations.md) | Operational/reference | New DOC1 handoff and qualification guide. |
| [contracts.md](contracts.md) | Supporting/reference | Historical contract blueprint; actual exported contracts live in `src/dungeon`. |
| [architecture.md](architecture.md) | Supporting/reference | Historical architecture detail; defer to `main_blueprint.md` for current authority boundaries. |
| [requirements_traceability.md](requirements_traceability.md) | Supporting/reference | Traceability context; implementation status is summarized in this README and `main_blueprint.md`. |
| [schemas/](schemas/) | Reference | JSON schema reference fixtures and validation boundaries. |
| [phase3_graph_generator.md](phase3_graph_generator.md), [phase4_room_assignment.md](phase4_room_assignment.md), [implementation_plan.md](implementation_plan.md), [migration_plan.md](migration_plan.md) | Historical | Pre-completion phase plans; do not treat planned wording as current status. |
| [diagnostics_workbench.md](diagnostics_workbench.md), [validation_testing.md](validation_testing.md), [performance_budgets.md](performance_budgets.md) | Supporting/reference | Use alongside `doc1_operations.md` for current commands/evidence. |

Run `npm run check:docs` after changing documentation.
