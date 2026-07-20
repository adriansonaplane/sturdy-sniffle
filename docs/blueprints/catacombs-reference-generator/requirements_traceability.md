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
