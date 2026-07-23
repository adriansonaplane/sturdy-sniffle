**DOC1 status:** Supporting/historical reference. For current implemented authority, lifecycle, runtime, and commands, defer to [README.md](README.md), [main_blueprint.md](main_blueprint.md), and [doc1_operations.md](doc1_operations.md).

# Contracts

[Package README](README.md) · [Main Blueprint](main_blueprint.md) · [Traceability](requirements_traceability.md) · [Glossary](glossary.md)

## Field metadata legend
Authority: `server`, `shared deterministic`, `client presentation`. Canonical: `included` or `excluded`. Mutability: `immutable` or `mutable session`.

## Implementation-ready TypeScript interfaces
```ts
export type EnvironmentId = 'catacombs';
export type PlannedEnvironmentId = 'garden_maze' | 'dark_tower' | 'hells_canyon' | 'town' | 'monastery';
export type GameType = 'speed_run' | 'hunt' | 'endurance';
export type Difficulty = 'normal' | 'hard' | 'expert' | 'nightmare' | 'hell';
export type RngStreamName = 'graph' | 'roomAssignment' | 'spatialEmbedding' | 'corridorRouting' | 'construction' | 'encounters' | 'hazards' | 'objectives' | 'bosses' | 'props' | 'naming' | 'templates' | 'subBiome' | 'modifiers';

export interface DungeonConfig { schemaVersion: string; generatorVersion: string; rootSeed: string; generationMode: 'procedural'|'predefined'|'hybrid'; environmentId: EnvironmentId; layoutProfileId: 'graph.catacombs.layered_braided'; gameType: GameType; difficulty: Difficulty; authorizedPlayerCount: number; template?: { id: string; version: string }; subBiome?: string; structuralModifiers: string[]; gameplayModifiers: string[]; contentTableVersions: Record<string,string>; assetRegistryVersion: string; }
export interface EnvironmentProfile { schemaVersion: string; environmentId: EnvironmentId; environmentVersion: string; displayName: string; status: 'active'|'planned'|'postponed'; layoutProfiles: LayoutProfile[]; subBiomes: SubBiomeDefinition[]; modifiers: EnvironmentModifierDefinition[]; archetypeIds: string[]; compatibility: Record<GameType, boolean>; }
export interface LayoutProfile { id: string; version: string; layout: 'graph'; algorithm: 'catacombs.layered_braided'; minDepthLayers: number; maxDepthLayers: number; }
export interface SubBiomeDefinition { id: string; version: string; displayName: string; depthRange: [number,number]; allowedArchetypes: string[]; visualEventLayers: string[]; }
export interface EnvironmentModifierDefinition { id: string; version: string; category: 'structural'|'gameplay'|'visual'; deterministicStream: RngStreamName; canonical: boolean; }
export interface WorldGraph { id: string; version: string; areaIds: string[]; edges: GraphEdge[]; }
export interface AreaGraph { id: string; worldGraphId: string; roomGraphId: string; depthLayers: DepthLayer[]; }
export interface RoomGraph { id: string; nodes: GraphNode[]; edges: GraphEdge[]; branches: ResolvedBranch[]; criticalPathNodeIds: string[]; }
export interface GraphNode { id: string; category: 'room'|'junction'|'landmark'|'transition'; scale: 'connector'|'small'|'medium'|'large'|'landmark'; function: string; archetypeId: string; depthLayer: number; degree: number; criticalPathEligible: boolean; branchEligible: boolean; tags: string[]; }
export interface GraphEdge { id: string; fromNodeId: string; toNodeId: string; category: 'passage'|'door'|'gate'|'secret'|'portal'; initialState: 'open'|'closed'|'locked'|'secret'|'sealed'; generationDirection: 'forward'; traversal: 'bidirectional'|'one_way_runtime'; criticality: 'critical'|'optional'|'secret'|'return'; branchId?: string; dependencyId?: string; }
export interface ResolvedBranch { id: string; kind: 'primary_trunk'|'secondary_trunk'|'immediate_loop'|'conditional_loop'|'secret_loop'|'dead_end'; divergenceNodeId: string; reconvergenceNodeId?: string; nodeIds: string[]; purpose: 'critical_progression'|'optional_combat'|'reward'|'key_dependency'|'shortcut'|'secret_reward'|'pacing'; }
export interface DepthLayer { index: number; minForward: number; maxForward: number; nodeIds: string[]; }
export interface ResolvedRoom { id: string; graphNodeId: string; archetypeId: string; shape: string; footprint: { x: number; y: number; w: number; h: number; rotation: 0|90|180|270 }; doorCapacity: number; contentSlots: string[]; navigationClearance: number; }
export interface TileLayerData { width: number; height: number; encoding: 'typed-array/base64'; layers: { id: string; type: 'Uint8'|'Uint16'|'Int16'|'Uint32'; endian: 'little'; length: number; base64: string }[]; }
export interface TileBoundary { id: string; kind: 'wall'|'door'|'gate'|'arch'|'void'; edgeId?: string; x: number; y: number; side: 'n'|'e'|'s'|'w'; assetId?: string; }
export interface ConstructionPlacement { id: string; assetId: string; roomId?: string; edgeId?: string; x: number; y: number; rotation: number; sockets: Record<string,{x:number;y:number}>; collisionFootprintId: string; navigationFootprintId: string; }
export interface GameplayPlacement { id: string; kind: 'encounter'|'hazard'|'objective'|'event'|'reward'|'boss'|'spawn_socket'; roomId: string; x: number; y: number; contentTableId: string; }
export interface ResolvedEncounter { id: string; roomId: string; recipeId: string; budget: number; monsterSpawns: ResolvedMonsterSpawn[]; reinforcementSockets: ReinforcementSocket[]; }
export interface ResolvedMonsterSpawn { id: string; family: string; monsterId: string; role: string; placementId: string; contentTableVersion: string; }
export interface ReinforcementSocket { id: string; roomId: string; x: number; y: number; trigger: 'time'|'objective'|'boss_phase'|'server_directed'; }
export interface ResolvedHazard { id: string; hazardId: string; roomId: string; telegraphAssetId: string; serverStateKey: string; }
export interface ResolvedEvent { id: string; eventId: string; roomId: string; trigger: string; serverStateKey?: string; }
export interface ResolvedObjective { id: string; objectiveId: string; dependencyIds: string[]; roomId: string; serverStateKey: string; }
export interface ResolvedReward { id: string; rewardTableId: string; roomId: string; claimPolicy: 'server_authorized'; }
export interface ResolvedBoss { id: string; bossId: string; antechamberRoomId: string; sepulcherRoomId: string; arenaContractId: string; phaseSocketIds: string[]; }
export interface AssetRegistryEntry { id: string; version: string; namespace: string; kind: string; authoredUri?: string; proceduralFallbackId: string; collisionFootprintId: string; navigationFootprintId: string; sockets: string[]; lods: string[]; qualityTiers: ('low'|'medium'|'high')[]; dependencies: string[]; }
export interface ResolvedAssetUsage { assetId: string; version: string; placementIds: string[]; status: 'authored'|'fallback'|'missing_blocked'; }
export interface MaterialGroupSummary { id: string; materialIds: string[]; textureMemoryBytes: number; }
export interface DrawCallGroupSummary { id: string; drawCalls: number; instances: number; triangles: number; }
export interface DungeonMetrics { graphQualityScore: number; retryCount: number; payloadBytes: number; drawCalls: number; triangles: number; activeMonsterBudget: number; }
export interface GenerationDiagnostic { id: string; code: string; severity: 'info'|'warning'|'error'; stage: string; target?: { kind: string; id: string }; message: string; humanReadable: true; canonical: false; }
export interface GenerationDiagnostics { schemaVersion: string; attemptHistory: unknown[]; stageSnapshots: unknown[]; issues: GenerationDiagnostic[]; metrics: DungeonMetrics; timingsExcludedFromCanonical: Record<string,number>; }
export interface ValidationIssue { code: string; severity: 'warning'|'error'; owner: string; target?: {kind:string;id:string}; message: string; }
export interface ValidationResult { schemaVersion: string; valid: boolean; issues: ValidationIssue[]; gates: Record<string, boolean>; }
export interface AuthorizedDungeonManifest { schemaVersion: string; manifestVersion: string; sessionId: string; dungeonId: string; generatorVersion: string; environmentVersion: string; canonicalChecksum: string; checksumAlgorithm: 'sha256'; signature: { algorithm: 'Ed25519'|'ES256'; keyId: string; value: string }; expiresAt: string; resolvedPayloadUri?: string; }
export interface ResolvedDungeon { schemaVersion: string; dungeonId: string; config: DungeonConfig; worldGraph: WorldGraph; areaGraphs: AreaGraph[]; roomGraph: RoomGraph; rooms: ResolvedRoom[]; tiles: TileLayerData; boundaries: TileBoundary[]; constructionPlacements: ConstructionPlacement[]; gameplayPlacements: GameplayPlacement[]; encounters: ResolvedEncounter[]; hazards: ResolvedHazard[]; events: ResolvedEvent[]; objectives: ResolvedObjective[]; rewards: ResolvedReward[]; bosses: ResolvedBoss[]; assetUsage: ResolvedAssetUsage[]; materialGroups: MaterialGroupSummary[]; drawCallGroups: DrawCallGroupSummary[]; metrics: DungeonMetrics; validation: ValidationResult; canonicalChecksum: string; }
export interface GenerationResult { resolvedDungeon: ResolvedDungeon; diagnostics: GenerationDiagnostics; manifest?: AuthorizedDungeonManifest; }
```

## Important-field metadata
| Field group | Meaning | Authority | Canonical inclusion | Mutability | Source stage | Validation owner |
|---|---|---|---|---|---|---|
| Config/version/seed | Reproduction identity | Server | Included | Immutable | Request/session | Contract validator |
| Graphs/branches/depth | Topology and progression | Shared deterministic, server authoritative | Included | Immutable | Graph | Graph validator |
| Rooms/footprints | Archetype and physical intent | Shared deterministic | Included | Immutable | Room/spatial | Room/spatial validators |
| Tile layers/boundaries | Navigation and contact proof | Shared deterministic | Included via lossless typed-array bytes | Immutable | Rasterization | Spatial validator |
| Construction/asset usage | Renderable/collision/nav asset placements | Shared deterministic | Included | Immutable | Construction | Asset validator |
| Gameplay placements | Initial objective/encounter/hazard/boss placement | Server authoritative generation | Included | Immutable seed state | Gameplay placement | Gameplay validator |
| Session state keys | Link to mutable runtime state | Server | Included only as initial keys | Mutable session values excluded | Authorization | Server session validator |
| Diagnostics/timings/UI | Human-readable and local observations | Client/server observation | Excluded | Mutable/noncanonical | Diagnostics/workbench | Diagnostics validator |
| Manifest signature | Proof of server envelope | Server | Envelope signed; not inside dungeon checksum | Immutable envelope | Authorization | Signature verifier |
