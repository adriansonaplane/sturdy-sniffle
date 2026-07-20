# Catacombs Online Authorization Threat Model

Prompt 12 introduces a server-authorized boundary for the Web Companion App. Clients may request a dungeon shape, but the server owns normalization, seed selection, content versions, checksum creation, signing, session-state authority, completion, progression, and rewards.

## Mitigated in this milestone

- Client seed, difficulty, game type, player count, modifier, generator-version, profile-version, checksum, and delivery-mode tampering are rejected because those fields are covered by the signed manifest payload.
- Unsupported request values fail closed during request validation and normalization.
- Expired, future-issued, wrong-binding, unknown-key, retired-key, prohibited-algorithm, modified-header, modified-payload, and malformed-signature manifests fail verification.
- Incompatible clients cannot silently accept reconstructed content; compatibility is checked before reconstruction and checksum comparison is mandatory.
- Resolved-payload fallback is accepted only after schema/canonical checksum validation against the signed checksum.
- Diagnostics, timings, nonce, issuance time, expiry, key IDs, transport metadata, and mutable session state are excluded from the canonical ResolvedDungeon checksum.
- Manifest possession is explicitly separated from completion or reward authority.

## Requires future authenticated services

- Persistent nonce consumption and single-use replay prevention require server storage.
- Account, party, match, and session identities are opaque binding references until a future identity/session service supplies authoritative context.
- Combat, objective completion, boss defeat, rewards, inventory, progression, and leaderboards require future server-authoritative gameplay services.

## Cryptographic status

The repository contains a production-facing signing/verifier abstraction and a clearly marked `TEST_FAKE_NONPRODUCTION` deterministic signer for fixtures and tests. No production private keys or production key-management service are included.
