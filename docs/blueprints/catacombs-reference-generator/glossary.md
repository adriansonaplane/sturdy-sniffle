# Glossary

[Package README](README.md) · [Main Blueprint](main_blueprint.md) · [Traceability](requirements_traceability.md) · [Glossary](glossary.md)

| Term | Definition |
|---|---|
| Environment | Versioned dungeon theme/rule set; active production value is Catacombs. |
| Layout | High-level topology family. |
| Graph Layout | Layered braided room-and-passage topology for Catacombs. |
| Tree/Linear Layout | Planned Hell’s Canyon progression family. |
| World graph | Coarse dungeon/world areas. |
| Area graph | Graph connecting room graphs or sectors within a world area. |
| Room graph | Nodes are rooms/junctions/landmarks; edges are passages/doors/gates. |
| Tile-navigation graph | Raster/nav representation derived from room graph; tiles are not room nodes. |
| Node | Graph vertex at its own abstraction layer. |
| Room | Playable authored/procedural space represented by a room-graph node. |
| Connector | Passage-like space, usually an edge unless it contains gameplay/junction/transition. |
| Junction | Meaningful branching connector represented as a node. |
| Branch | Non-primary progression path with purpose. |
| Primary trunk | Main start-to-boss path. |
| Secondary trunk | Tree-like forward branch that reconverges. |
| Divergence | Node where a branch leaves a path. |
| Reconvergence | Deeper node where a branch rejoins. |
| Immediate loop | Short optional loop open at generation. |
| Conditional loop | Formal term for a loop gated by dependency; do not call it `open loop` except to note this replacement. |
| Secret loop | Optional hidden loop. |
| Dead end | Terminal branch with declared purpose. |
| Critical path | Required route for completion under current rules. |
| Structural exit | Physical exit/portal point. |
| Completion | Server-authorized objective/boss state satisfying session rules. |
| Sub-biome | Versioned Catacombs variant affecting content/visual rules. |
| Modifier | Versioned structural/gameplay/visual alteration. |
| Visual event layer | Noncanonical presentation layer unless gameplay-readable. |
| Canonical payload | Losslessly serialized immutable generation data used for checksum. |
| Checksum | SHA-256 hash over canonical bytes. |
| Signature | Server digital signature over manifest envelope. |
| Manifest | Signed versioned envelope identifying dungeon/session/checksum. |
| Resolved dungeon | Immutable generated dungeon payload. |
| Mutable session state | Server-owned runtime objectives, monsters, hazards, rewards, completion. |
| Procedural fallback | Functional non-authored asset replacement preserving gameplay properties. |
| Authorized dungeon | Resolved dungeon plus valid server manifest/session authorization. |
