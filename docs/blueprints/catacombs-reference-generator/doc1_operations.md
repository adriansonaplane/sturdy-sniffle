# DOC1 Operations, Evidence, and Prototype Handoff

**Kind:** Operational/reference. **Authority:** complements the normative [main blueprint](main_blueprint.md). Commands and paths in this document were reconciled against repository scripts and source files during DOC1.

## Documentation inventory and classification

| Surface | Classification | Decision |
| --- | --- | --- |
| `README.md` | Normative overview | Updated as setup/status/navigation source. |
| `docs/blueprints/catacombs-reference-generator/README.md` | Normative package map | Updated authority hierarchy and status warnings. |
| `docs/blueprints/catacombs-reference-generator/main_blueprint.md` | Normative architecture | Rewritten to match implemented D1/D2/D3/T1 behavior. |
| This document | Operational/reference | Added DOC1 commands, evidence, troubleshooting, extension guidance, and handoff. |
| `docs/blueprints/catacombs-reference-generator/schemas/*.json` | Reference | Schema source references retained; TypeScript/source remain final source when implementation has moved beyond historical schema prose. |
| Existing detailed blueprint files | Supporting/historical | Preserve for design context; defer to `main_blueprint.md` for current implementation status. |
| `docs/analysis/catacombs-workbench-gap-analysis.md` | Historical | Pre-T1 gap analysis; not current authority. |
| `dungeon-generator-workbench.html`, `artifacts/t1/**`, `coverage/**`, Playwright reports | Generated | Regenerate, do not hand edit, except generated workbench via build script. |

## Runtime and container consistency

- Supported runtime: Node.js **24.18.0** and npm **11.16.0** bundled with that Node release.
- Engine range: `>=24.18.0 <25` in `package.json`.
- Version-manager file: `.nvmrc` contains `24.18.0`.
- Runtime validation script: `npm run check:runtime` invokes `scripts/check-runtime.mjs`.
- CI uses `actions/setup-node@v4` with `node-version: 24.18.0`.
- Windows note: npm scripts that rely on POSIX inline environment assignments are not portable; prefer `npm run test:property:pr` for the PR suite or PowerShell `$env:` assignments for shard overrides.
- Container inspection found no Dockerfile, Docker Compose, or `.devcontainer` definition. No Docker runtime claim is made.

## Local development workflow

1. Select Node.js: `nvm install && nvm use`.
2. Confirm versions: `node --version` and `npm --version`.
3. Install dependencies: `npm ci`.
4. Validate runtime: `npm run check:runtime`.
5. Typecheck/build: `npm run typecheck` and `npm run build`.
6. Build/verify workbench: `npm run build:workbench` then `npm run check:workbench`.
7. Run a small deterministic property gate: `npm run test:property:pr`.
8. Launch supported workbench flow by serving the repository root, for example `npx http-server .`, then open `dungeon-generator-workbench.html`.
9. Replay a corpus or manual case with `npm run test:replay`.
10. Before changing prototype behavior, run `npm run test:t1` plus browser/visual/accessibility checks when relevant.

## Testing and qualification guide

| Command | Purpose | Scope | Dependencies/artifacts | Intended use |
| --- | --- | --- | --- | --- |
| `npm ci` | Clean dependency install. | Whole repo | Node/npm, lockfile | Local/CI |
| `npm run check:runtime` | Enforce Node/npm expectations. | Runtime | `scripts/check-runtime.mjs` | Local/CI/PR |
| `npm run typecheck` | TypeScript no-emit check. | Source/tests config | TypeScript | PR |
| `npm run build` | Compile repository. | Source | `tsconfig.json` | PR/release |
| `npm run build:workbench` | Generate single-file workbench. | Workbench | `dungeon-generator-workbench.html` | PR/release |
| `npm run check:workbench` | Fingerprint/currentness check. | Generated workbench | generated HTML | PR/release |
| `npm run check:docs` | Validate local Markdown links, package scripts, source paths, and stale runtime claims. | Docs | `scripts/check-docs.mjs` | PR |
| `npm run test:unit` | Unit tests. | `test/dungeon/unit` | Jest | PR |
| `npm run test:integration` | Full pipeline/routing integration. | `test/dungeon/integration` | Jest | PR |
| `npm run test:browser` | Browser workbench behavior. | Playwright specs | Chromium, reports | PR/release |
| `npm run test:visual` | Visual regression. | Playwright visual | Chromium, screenshots | PR/release |
| `npm run test:accessibility` | Accessibility smoke. | Playwright/axe | Chromium | PR/release |
| `npm run test:security` | Import/authorization/security checks. | `test/dungeon/security` | Jest | PR/nightly/release |
| `npm run test:property:pr` | 6-case deterministic PR suite. | 1 shard | `artifacts/t1/property` | PR |
| `npm run test:property:nightly` | Nightly suite shard. | 24 cases / 4 shards | shard artifacts | Nightly/local shard |
| `npm run test:property:release` | Release suite shard. | 40 cases / 8 shards | shard artifacts | Manual release shard |
| `npm run test:property:reconcile -- --level nightly --shards 4 --dir artifacts/t1/property` | Reconcile complete shard directory. | Aggregated shards | `artifacts/t1/reconciliation-*.json` | Nightly/release |
| `npm run test:replay` | Replay manual or recorded case. | One record/case | JSON output | Local/support |
| `npm run test:regression` | Replay corpus. | `t1c-corpus-v1`, 11 cases | Jest | PR/release |
| `npm run test:performance` | Node performance gate. | Fixed profiles | `artifacts/t1/performance-summary.json` | PR/nightly/release |
| `npm run test:coverage -- --coverageReporters=text-summary` | Coverage gate. | Jest suites | `coverage/` | PR/release |
| `npm run test:t1` | Complete T1 orchestrator. | Core T1 gates | artifacts/coverage | Final qualification |
| `npm audit --audit-level=high` | Dependency audit. | Lockfile | audit report | PR/release |
| `git diff --check` | Whitespace/generated diff cleanliness. | Git diff | none | PR/release |

Install browser dependencies with `npx playwright install --with-deps chromium`.

## Deterministic property sharding and replay

- Seed-set version: `t1c-seeds-v1`.
- PR: 6 cases, 1 shard.
- Nightly: 24 cases, 4 shards.
- Release: 40 cases, 8 shards.
- Replay corpus: `t1c-corpus-v1`, 11 cases.
- Environment variables: `T1_PROPERTY_LEVEL`, `T1_PROPERTY_SHARD`, `T1_PROPERTY_SHARDS`.
- Stable shard selection is implemented by `selectShardSeeds` and `shardCaseIndices` in `test/dungeon/t1c/seedModel.ts`; reconciliation requires non-overlap, complete shard coverage, matching level/shard count, no duplicates, and replay records for failures.
- Shard artifacts are written to `artifacts/t1/property/shard-<level>-<index>-of-<count>.json`; reconciliation summaries are written to `artifacts/t1/reconciliation-<level>.json`.
- Replay records contain suite id, seed-set version, numeric seed, canonical configuration, shard index/count, case index, expected result/failure, generator version, schema version, and optional checksum.

Examples:

```sh
npm run test:property:pr
T1_PROPERTY_SHARD=2 T1_PROPERTY_SHARDS=4 npm run test:property:nightly
T1_PROPERTY_SHARD=7 T1_PROPERTY_SHARDS=8 npm run test:property:release
npm run test:property:reconcile -- --level release --shards 8 --dir artifacts/t1/property
npm run test:replay -- --record artifacts/t1/property/failing-record.json
npm run test:replay -- --seed 2882400001 --config <base64url-json-or-relative-json-file>
npm run test:regression
```

PowerShell shard example:

```powershell
$env:T1_PROPERTY_SHARD=2; $env:T1_PROPERTY_SHARDS=4; npm run test:property:nightly
```

Artifacts are support evidence. Do not place secrets, private keys, local absolute paths, or environment dumps in replay/failure records.

## Workbench and renderer

| Topic | Implemented source/behavior |
| --- | --- |
| Source entry | `src/dungeon/workbench/main.ts` bootstraps `CatacombsWorkbenchApp`. |
| Generated file | `dungeon-generator-workbench.html` from `npm run build:workbench`; verify with `npm run check:workbench`. |
| Canonical controls | seed, game type, difficulty, player count, room count, area budget, packing density, padding, size profile, routing width. |
| Presentation controls | quality, build animation, animation speed, wall fading, reduced motion, post-processing. They must not change canonical output. |
| Overlays | `OVERLAY_DEFINITIONS` in `src/dungeon/workbench/productionPipeline.ts` cover graph, spatial, gameplay, assets, and authorization/checksum inspection. |
| Inspectors | Configuration, Routing, Construction, Gameplay, Assets, Renderer statistics, Validation, Diagnostic projection, Authorization. |
| Import/export | Workbench diagnostic bundle schema `d3.workbench.bundle.v1`; JSON only; size and executable/private-key-like content rejected. |
| Safe states | Generation errors are shown as safe user-visible messages; local imports do not grant authority. |
| Compare | Compares seed + 1 using the same pipeline for diagnostic inspection. |
| Disposal/bootstrap | Renderer and app lifecycle tests cover bootstrap, disposal, double-disposal, resize/pointer behavior, empty scenes, and stale-load handling. |
| Browser requirements | Modern browser with WebGL and ES module support; Playwright Chromium is the verified browser target. |

Renderer reference: `src/dungeon/rendering/DungeonRenderer.ts` owns canvas lifecycle, scene replacement, pointer/wheel/resize behavior, frame statistics, presentation updates, empty scenes, disposal and double-disposal safety. `quality.ts`, `geometry.ts`, `materials.ts`, and `assetLoader.ts` provide quality profiles, geometry/material helpers, and safe asset loading. Asset URL rejection and stale-load cancellation protect the browser renderer. Current assets are procedural/authored-reference/fallback records; final authored GLTF expansion remains deferred.

## Construction, props, assets, and gameplay transformations

Construction records are generated by `generateCatacombsConstruction` with stable ids for floor, wall, doorway, corridor, sockets, batches, and asset-resolution records. Missing assets fall back only through declared resolution states. Prop/gameplay placements are generated by `generateCatacombsGameplay`; ownership must remain tied to valid rooms, sockets, regions, corridors, or navigation cells. Game type, difficulty, and player count are canonical inputs that may change placements, budgets, dependencies, and presentation density, but must preserve routing/navigation validity and may not award loot, XP, currency, entitlements, sessions, or authoritative completion.

## Security boundaries

Verified boundaries include import schema/size/content validation, prototype-pollution-shaped payload rejection, unsafe replay path rejection, numeric seed validation, signed-manifest integrity, tampering rejection, unknown-key rejection, unsupported-algorithm rejection, expiry validation, binding validation, checksum fallback behavior, production rejection of test keys, and absence of forged reward/session/entitlement authority. These checks are prototype verification boundaries, not a complete security guarantee for a deployed service.

## Coverage evidence

T1C verified coverage under Node.js 24.18.0:

| Scope | Statements | Branches | Functions | Lines |
| --- | ---: | ---: | ---: | ---: |
| Global | 99.60% | 83.64% | 91.09% | 99.60% |
| Workbench | 98.85% | 80.22% | 91.11% | 98.85% |
| Rendering | 100% | 91.30% | 97.29% | 100% |

Regenerate with `npm run test:coverage -- --coverageReporters=text-summary`. Configured thresholds must not be lowered to conceal gaps. Avoid broad exclusions and ignore comments; justify any narrow exclusion in code review.

## Performance evidence

`npm run test:performance` runs deterministic Node benchmarks against fixed seeds/configurations, warms each profile for 3 runs, samples 8 iterations, records median/p95/max and memory delta, verifies correctness/checksum behavior, and writes `artifacts/t1/performance-summary.json`. Profiles include small, medium, large, high-room-count, dense-packing, wide-routing, multiplayer, and pathological-but-supported cases. The gate intentionally excludes browser animation/GPU timing. T1C introduced no speculative production optimization because all profiles passed their budgets.

## CI qualification matrix

The workflow `.github/workflows/catacombs-t1-verification.yml` enforces:

- PR/push: checkout, setup Node 24.18.0, `npm ci`, Playwright Chromium install, typecheck, build, workbench build/currentness, unit, integration, security, PR property suite, regression, coverage, browser, visual, accessibility, performance, audit, diff cleanliness, artifact upload.
- Nightly scheduled/manual: four deterministic nightly property shards, artifact upload, reconciliation, regression, performance, security, and summary upload.
- Release manual with `releaseSeeds=true`: eight deterministic release shards, artifact download/reconciliation, regression, performance, complete coverage, browser, visual, accessibility, security, build, workbench build, and durable summary upload.

## Troubleshooting

| Symptom | Remedy |
| --- | --- |
| Wrong Node version | Use `.nvmrc`: `nvm install && nvm use`; rerun `npm run check:runtime`. |
| Wrong independently installed npm | Use npm bundled with Node.js 24.18.0; avoid global npm pinning for this repo. |
| Git unavailable to `test:t1` | Install Git or run inside a checkout; do not skip diff cleanliness in final qualification. |
| Missing Playwright Chromium | Run `npx playwright install --with-deps chromium`. |
| Workbench fingerprint/currentness failure | Run `npm run build:workbench`, then `npm run check:workbench`; commit generated changes if source changed. |
| Noncanonical seed rejection | Use an unsigned 32-bit numeric seed; do not use `seed-*` aliases in T1 replay/property tooling. |
| Malformed replay record | Validate record JSON fields against `test/dungeon/t1c/replay.ts`; use relative paths inside repo. |
| Unsupported generator/schema version | Reproduce with matching version or perform an intentional versioned migration. |
| Missing/duplicate/mismatched shard | Regenerate all shards for the same level/shard count; reconcile only complete directories. |
| Performance-budget failure | Inspect `artifacts/t1/performance-summary.json`, reproduce the profile, fix code or document a real blocker; do not raise budgets without review. |
| Coverage-threshold failure | Add focused tests or remove unjustified gaps; do not lower thresholds to pass. |
| Visual-baseline mismatch | Inspect Playwright artifacts and update baseline only for intentional visual changes. |
| Import validation failure | Fix bundle schema/version/content; never bypass safe import checks. |
| Signed-manifest validation failure | Check algorithm, key id, expiry, binding, payload integrity, checksum, and production/test-key settings. |
| Generated artifact/diff cleanliness failure | Regenerate expected outputs and rerun `git diff --check`. |

## Safe extension guide

| Extension | Required checks |
| --- | --- |
| Room archetype or semantic rule | Update environment/profile registries, deterministic ordering, validation, unit/property tests, replay impact, and docs. |
| Construction record kind | Version/render contract if needed; update construction tests, renderer mapping, asset fallback, schemas/docs. |
| Props/assets or authored GLTF | Update asset registry, safe URL/loading rules, fallback behavior, renderer tests, security tests, and docs. |
| Gameplay transformation | Update canonical config/profile version, owner-valid placement tests, replay corpus if checksum-affecting, and docs. |
| Workbench control | Classify canonical vs presentation-only, test determinism impact, update import/export validation and docs. |
| Overlay | Register in `OVERLAY_DEFINITIONS`, add renderer/workbench tests, keep diagnostics presentation-only. |
| Failure code | Add source/test coverage and support-safe diagnostics; link docs to source rather than hand-copying a large registry. |
| Replay corpus case | Use numeric seeds, include canonical config/version/checksum, and reconcile corpus count. |
| Canonical serialization change | Version generator/schema/serialization, update checksums intentionally, run full T1 plus release-style evidence. |
| Future environment profile | Reuse common contracts/pipeline; add environment-specific profile/stages only when necessary and versioned. |

## Known limitations and deferred scope

- Only Catacombs is implemented. Garden Maze, Dark Tower, and Hell’s Canyon are planned only.
- The workbench is a prototype diagnostic shell, not production online integration.
- Current assets are procedural/reference/fallback records; final authored art and a complete GLTF asset pack are deferred.
- Signed-manifest tests verify a prototype boundary; broader deployment, key management, service storage, and entitlement integration are deferred.
- The generator provides placements and presentation records but does not own live game-state authority.
- Browser verification targets Playwright Chromium; other browser/platform behavior may need additional qualification.
- Node performance gates do not measure GPU timing or animation smoothness.

## Prototype-resumption handoff

- Completed milestones: D1, D2, D3, T1A, T1B, T1C, and DOC1 documentation consolidation.
- Production entry point: `generateCatacombs` in `src/dungeon/generationPipeline.ts`.
- Workbench entry point: `src/dungeon/workbench/main.ts` and generated `dungeon-generator-workbench.html`.
- Runtime: Node.js 24.18.0 with bundled npm 11.16.0.
- Complete verification command: `npm run test:t1` plus browser/visual/accessibility commands when changing browser-visible behavior.
- Preserve invariants: numeric deterministic seeds, Delaunay/fallback provenance, constrained MST, semantic mandatory rooms, routing/navigation equivalence, diagnostics excluded from production render input, presentation independence, no local reward/session authority, no threshold lowering.
- Recommended next prototype milestone: **gameplay-placement visualization**. It has high user-visible value because gameplay placements already exist in production render input and inspectors, so visualizing them improves prototype usefulness without rewriting the deterministic foundation or changing canonical generation.
- Prerequisites: confirm placement categories and ownership, define presentation-only marker styles, keep authorizing/reward semantics out of the client.
- Likely files: `src/dungeon/workbench/sceneBuilder.ts`, `src/dungeon/rendering/*`, `src/dungeon/workbench/application.ts`, browser tests under `test/browser/`, unit tests under `test/dungeon/unit/`.
- Tests to add: renderer marker rendering, overlay toggles, import/export preservation, reduced-motion/disposal safety, visual regression, accessibility label behavior, and determinism checks proving presentation-only controls do not alter checksums.
- Stop conditions: need for new authority semantics, checksum/schema migration, broad pipeline refactor, service deployment, or environment-specific generation logic.
- Explicitly excluded from next milestone: Garden Maze implementation, server entitlement/reward systems, production key management, final authored asset pack, broad foundation rewrite.
