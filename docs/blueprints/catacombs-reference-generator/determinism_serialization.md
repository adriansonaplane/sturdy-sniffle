**DOC1 status:** Supporting/historical reference. For current implemented authority, lifecycle, runtime, and commands, defer to [README.md](README.md), [main_blueprint.md](main_blueprint.md), and [doc1_operations.md](doc1_operations.md).

# Determinism and Serialization

[Package README](README.md) · [Main Blueprint](main_blueprint.md) · [Traceability](requirements_traceability.md) · [Glossary](glossary.md)

## RNG streams
Streams: graph, roomAssignment, spatialEmbedding, corridorRouting, construction, encounters, hazards, objectives, bosses, props, naming, templates, subBiome, modifiers. Derive each from `H(rootSeed | generatorVersion | stableNamespace | streamName | attemptIndex | optionalSlotId)`. Stages may only consume owned streams. Prop changes cannot alter graph topology; naming cannot alter gameplay; failed hybrid expansion slots use slot-local streams.

## Canonical serialization
Use canonical CBOR-like binary or documented stable binary JSON: sorted UTF-8 map keys, normalized enums, integer coordinates, fixed decimal rounding only for non-integer authored offsets, and no platform-dependent floats in authority geometry. Typed arrays encode as `{type,endian:length,bytes}` with little-endian byte representation, type identifier (`Uint8`,`Uint16`,`Int16`,`Uint32`,`Float32` only when rounded), length, and base64 in JSON fixtures; checksum uses decoded canonical bytes.

## Included
Schema/generator/environment/layout versions, root seed, final attempt index, mode, template ID/version, sub-biome, modifiers, game type, difficulty, authorized player count, graph nodes/edges, branches, room assignments/footprints, tile/boundary data, initial door/edge states, construction/gameplay placements, objectives, encounters, hazards, events, boss, content-table versions, asset-registry version.

## Excluded
Generation timings, FPS, frame times, camera/inspector/panel/localStorage state, debug overlays, animation timeline, particles, cosmetic phases, active LOD, cutaway state, visual-only event layers, GPU data, renderer stats, human-readable diagnostics, and runtime timestamps not required by the signed envelope.

## Checksum/versioning
Initial checksum is SHA-256 over canonical serialized bytes. Generator, template, environment, content-table, and asset-registry versions are canonical. Regression seeds preserve old versions; migrations create explicit compatibility fixtures rather than silently changing checksums.
