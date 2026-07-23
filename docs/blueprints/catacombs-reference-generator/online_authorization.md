**DOC1 status:** Supporting/historical reference. For current implemented authority, lifecycle, runtime, and commands, defer to [README.md](README.md), [main_blueprint.md](main_blueprint.md), and [doc1_operations.md](doc1_operations.md).

# Online Authorization

[Package README](README.md) · [Main Blueprint](main_blueprint.md) · [Traceability](requirements_traceability.md) · [Glossary](glossary.md)

## Flow
Client requests generation with account auth and desired config. Server creates a game session, authoritatively generates `ResolvedDungeon`, stores the resolved payload, serializes canonical bytes, computes checksum, signs a versioned manifest, and returns manifest plus optional fallback payload.

## Distinctions
Checksum/hash proves byte equality, not authorship. Digital signature proves the server signed the manifest. Session token authorizes game-session participation. Authentication identifies a web user. Game session is server gameplay state. Account entitlement is queried through Account/Entitlement Service and is not implicit MMORPG state mutation.

## Client behavior
Browser verifies signature with public key metadata, reconstructs deterministically, computes checksum, compares, and uses local reconstruction only if it matches. On mismatch, generator/content version mismatch, or unsupported browser determinism, client uses the server-provided resolved payload fallback for rendering but still cannot authorize outcomes.

## Server authority
Objectives, monsters, bosses, hazards, completion, rewards, and loot claims remain server-authoritative. Reward authorization may not trust client completion claims. Private signing keys live in server/key-management boundaries, never source bundles or clients. Reconnection and late join reload manifest, resolved payload, and mutable state snapshot. Expiration blocks new joins but does not revoke active server decisions without session policy.
