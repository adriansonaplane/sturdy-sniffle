import { createHash } from 'node:crypto';
import type { DungeonConfig, EnvironmentProfile, GenerationDiagnostics, ResolvedDungeon, ValidationIssue } from '../contracts/index.js';
import { checksumResolvedDungeon } from '../canonical/checksum.js';
import { encodeTypedArrayCanonical } from '../canonical/typedArrays.js';
import { generateCatacombsGraph } from '../graph.js';
import { assignCatacombsRooms } from '../roomAssignment.js';
import { embedCatacombsRooms } from '../spatialEmbedding.js';
import { routeAndRasterizeCatacombs } from '../catacombsRouting.js';
import { generateCatacombsConstruction } from '../construction.js';
import { generateCatacombsGameplay } from '../gameplay.js';
import { CATACOMBS_REFERENCE_ASSET_REGISTRY } from '../assetRegistry.js';

export const WORKBENCH_VERSION = 'prompt13-workbench-1.0.0';

export const CATACOMBS_ENVIRONMENT_PROFILE: EnvironmentProfile = {
  schemaVersion: '1.0.0', environmentId: 'catacombs', environmentVersion: 'catacombs-1', displayName: 'Catacombs', status: 'active',
  layoutProfiles: [{ id: 'graph.catacombs.layered_braided', version: '1', layout: 'graph', algorithm: 'catacombs.layered_braided', minDepthLayers: 3, maxDepthLayers: 12 }],
  subBiomes: [{ id: 'ossuary', version: '1', displayName: 'Ossuary', depthRange: [0, 3], allowedArchetypes: ['mausoleum_entrance'], visualEventLayers: [] }],
  modifiers: [{ id: 'collapsed', version: '1', category: 'structural', deterministicStream: 'modifiers', canonical: true }],
  archetypeIds: [], compatibility: { speed_run: true, hunt: true, endurance: true }
};

export const WORKBENCH_ENVIRONMENTS = [
  { id: 'catacombs', label: 'Catacombs — Active', status: 'active', disabled: false },
  { id: 'garden_maze', label: 'Garden Maze — Planned', status: 'planned', disabled: true },
  { id: 'dark_tower', label: 'Dark Tower — Planned', status: 'planned', disabled: true },
  { id: 'hells_canyon', label: "Hell's Canyon — Planned", status: 'planned', disabled: true }
] as const;

export const DEFAULT_DUNGEON_CONFIG: DungeonConfig = {
  schemaVersion: '1.0.0', generatorVersion: 'catacombs-gen-1', rootSeed: '12345', generationMode: 'procedural', environmentId: 'catacombs', layoutProfileId: 'graph.catacombs.layered_braided', gameType: 'hunt', difficulty: 'normal', authorizedPlayerCount: 4, structuralModifiers: [], gameplayModifiers: [], contentTableVersions: { monsters: '1' }, assetRegistryVersion: 'catacombs-assets-1'
};

function fail(stage: string, diagnostics: GenerationDiagnostics): never { const codes = diagnostics.issues.map(i => i.code).join(', ') || 'unknown'; throw Object.assign(new Error(`${stage} failed: ${codes}`), { stage, diagnostics }); }
function issueFromValidation(i: ValidationIssue, n: number) { return { id: `validation.${String(n).padStart(3, '0')}`, code: i.code, severity: i.severity, stage: 'validation' as const, ...(i.target ? { target: i.target } : {}), message: i.message, humanReadable: true as const, canonical: false as const }; }
function idFor(config: DungeonConfig) { return `dng_${createHash('sha256').update(JSON.stringify(config)).digest('hex').slice(0, 24)}`; }

export async function generateProductionCatacombsDungeon(config: DungeonConfig = DEFAULT_DUNGEON_CONFIG): Promise<ResolvedDungeon> {
  if (config.environmentId !== 'catacombs') throw Object.assign(new Error('Only Catacombs is active; planned environments are unavailable.'), { stage: 'validation' });
  const environment = CATACOMBS_ENVIRONMENT_PROFILE;
  const graph = generateCatacombsGraph({ config, environment }); if (!graph.ok) fail('graph', graph.diagnostics);
  const rooms = assignCatacombsRooms({ config, environment, graph: graph.graph, branches: graph.branches, depthLayers: graph.depthLayers, graphMetrics: graph.metrics, requireReturnPortal: true }); if (!rooms.ok) fail('roomAssignment', rooms.diagnostics);
  const spatial = embedCatacombsRooms({ config, environment, graph: graph.graph, branches: graph.branches, depthLayers: graph.depthLayers, assignedRooms: rooms.assignedRooms }); if (!spatial.ok) fail('spatialEmbedding', spatial.diagnostics);
  const routing = routeAndRasterizeCatacombs({ config, environment, graph: graph.graph, branches: graph.branches, depthLayers: graph.depthLayers, assignedRooms: rooms.assignedRooms, embeddedRooms: spatial.embeddedRooms, occupancy: spatial.occupancy, padding: spatial.padding, connectionApproaches: spatial.connectionApproaches, doorCandidates: spatial.doorCandidates, bounds: spatial.bounds }); if (!routing.ok) fail('corridorRouting', routing.diagnostics);
  const construction = generateCatacombsConstruction({ rootSeed: config.rootSeed, generatorVersion: config.generatorVersion, environment, assignedRooms: rooms.assignedRooms, embeddedRooms: spatial.embeddedRooms, corridors: routing.corridors, doorways: routing.doorways, boundaries: routing.boundaries, navigation: routing.navigation, qualityTier: 'medium' });
  const gameplay = generateCatacombsGameplay({ config, environment, assignedRooms: rooms.assignedRooms, embeddedRooms: spatial.embeddedRooms, corridors: routing.corridors, sockets: construction.sockets, navigation: routing.navigation });
  const validationIssues = [...gameplay.validation.issues];
  const diagnostics: GenerationDiagnostics = { schemaVersion: '1.0.0', attemptHistory: [...graph.diagnostics.attemptHistory, ...rooms.diagnostics.attemptHistory, ...spatial.diagnostics.attemptHistory, ...routing.diagnostics.attemptHistory], stageSnapshots: [...graph.snapshots, ...spatial.snapshots, construction.snapshot, gameplay.snapshot], issues: [...graph.diagnostics.issues, ...rooms.diagnostics.issues, ...spatial.diagnostics.issues, ...routing.diagnostics.issues, ...gameplay.diagnostics.issues, ...validationIssues.map(issueFromValidation)], metrics: { graphQualityScore: graph.metrics.finalQualityScore, retryCount: graph.metrics.attemptCount + spatial.metrics.acceptedCandidateIndex, payloadBytes: 0, drawCalls: construction.diagnostics.costEstimate.estimatedDrawCalls, triangles: construction.diagnostics.costEstimate.estimatedTriangles, activeMonsterBudget: gameplay.metrics.activeMonsterBudget }, timingsExcludedFromCanonical: {} };
  const resolved: ResolvedDungeon = {
    schemaVersion: '1.0.0', dungeonId: idFor(config), config,
    worldGraph: { id: 'world.catacombs', version: '1', areaIds: ['area.catacombs.reference'], edges: [] },
    areaGraphs: [{ id: 'area.catacombs.reference', worldGraphId: 'world.catacombs', roomGraphId: graph.graph.id, depthLayers: graph.depthLayers }], roomGraph: graph.graph,
    rooms: spatial.embeddedRooms.map(r => ({ id: r.assignedRoom.nodeId, graphNodeId: r.assignedRoom.nodeId, archetypeId: r.assignedRoom.archetypeId, shape: r.footprint.shape === 'l-shape' ? 'l-shape' : r.footprint.shape as never, footprint: { x: r.footprint.origin.x, y: r.footprint.origin.y, w: r.footprint.width, h: r.footprint.height, rotation: 0 }, doorCapacity: r.assignedRoom.doorCapacity.maximum, contentSlots: r.assignedRoom.contentSlots.map(s => s.type), navigationClearance: r.clearanceSummary.minimumLocalClearance })),
    starts: gameplay.placements.filter(p => p.kind === 'PLAYER_START').map(p => p.id), completion: Object.fromEntries(Object.entries({ bossId: gameplay.placements.find(p => p.kind === 'BOSS' && p.tags.includes('final'))?.id, exitRoomId: graph.graph.criticalPathNodeIds.at(-1) }).filter(([, v]) => v !== undefined)) as ResolvedDungeon['completion'],
    tiles: routing.tileLayers, boundaries: routing.boundaries.slice(0, 600).map((b, i) => ({ id: `boundary.${i}`, kind: b.boundaryType.includes('door') ? 'door' : 'wall', x: b.tile.x, y: b.tile.y, side: b.side, assetId: 'catacombs.crypt_masonry' })),
    constructionPlacements: construction.records.slice(0, 1200).map(r => Object.fromEntries(Object.entries({ id: r.id, assetId: r.resolvedAssetId ?? r.requestedAssetFamily, roomId: r.source.roomId, edgeId: r.source.doorwayId ?? r.source.corridorId, x: r.transform.position.x, y: r.transform.position.y, rotation: r.transform.orientation, sockets: {}, collisionFootprintId: r.resolvedAssetId ?? 'UNAVAILABLE', navigationFootprintId: r.navigationEffect ?? 'UNAVAILABLE' }).filter(([, v]) => v !== undefined)) as unknown as ResolvedDungeon['constructionPlacements'][number]),
    gameplayPlacements: gameplay.placements.map(p => ({ id: p.id, kind: p.kind === 'REWARD_PRESENTATION' ? 'reward' : p.kind === 'BOSS' ? 'boss' : p.kind === 'HAZARD' ? 'hazard' : p.kind === 'OBJECTIVE' ? 'objective' : p.kind === 'EVENT' ? 'event' : p.kind === 'ENCOUNTER' ? 'encounter' : 'spawn_socket', roomId: p.sourceRoomId ?? 'UNAVAILABLE', x: p.region?.x ?? 0, y: p.region?.y ?? 0, contentTableId: 'catacombs-gameplay' })),
    encounters: [], hazards: [], events: [], objectives: [], rewards: [], bosses: [],
    assetUsage: [...new Map(construction.assetResolutions.map(a => [a.resolvedAssetId ?? (a.requested.family ?? a.requested.assetId ?? 'unknown'), a])).entries()].map(([assetId, a]) => ({ assetId, version: '1', placementIds: construction.records.slice(0, 1200).filter(r => r.resolvedAssetId === assetId || r.requestedAssetFamily === assetId).map(r => r.id), status: a.state === 'AUTHORED' ? 'authored' : a.state === 'FALLBACK' ? 'fallback' : 'missing_blocked' })),
    materialGroups: construction.batches.map(b => ({ id: b.materialGroupIds.join('+') || b.id, materialIds: b.materialGroupIds, textureMemoryBytes: b.estimatedTextureMemoryBytes })),
    drawCallGroups: construction.batches.map(b => ({ id: b.id, drawCalls: b.estimatedDrawCalls, instances: b.estimatedInstanceCount, triangles: b.estimatedTriangles })),
    metrics: diagnostics.metrics, validation: { schemaVersion: '1.0.0', valid: validationIssues.length === 0, issues: validationIssues, gates: { graph: true, rooms: true, spatial: true, routing: true, construction: true, gameplay: gameplay.validation.valid, authorization: false } }, diagnostics, canonicalChecksum: ''
  };
  const checksum = await checksumResolvedDungeon(resolved);
  return { ...resolved, canonicalChecksum: checksum, metrics: { ...resolved.metrics, payloadBytes: JSON.stringify(resolved).length } };
}

export const WORKBENCH_SCHEMA_FIELDS = [
  { path: 'rootSeed', label: 'Seed', canonical: true, type: 'string', required: true, regenerationRequired: true },
  { path: 'environmentId', label: 'Environment', canonical: true, enum: ['catacombs'], planned: WORKBENCH_ENVIRONMENTS.filter(e => e.disabled).map(e => e.id), regenerationRequired: true },
  { path: 'gameType', label: 'Game type', canonical: true, enum: ['speed_run', 'hunt', 'endurance'], regenerationRequired: true },
  { path: 'difficulty', label: 'Difficulty', canonical: true, enum: ['normal', 'hard', 'expert', 'nightmare', 'hell'], regenerationRequired: true },
  { path: 'authorizedPlayerCount', label: 'Player count', canonical: true, minimum: 1, maximum: 8, regenerationRequired: true },
  { path: 'generationMode', label: 'Generation mode', canonical: true, enum: ['procedural', 'predefined', 'hybrid'], regenerationRequired: true },
  { path: 'structuralModifiers', label: 'Structural modifiers', canonical: true, type: 'array', regenerationRequired: true },
  { path: 'gameplayModifiers', label: 'Gameplay modifiers', canonical: true, type: 'array', regenerationRequired: true },
  { path: 'renderer.quality', label: 'Renderer quality', canonical: false, enum: ['low', 'medium', 'high'], regenerationRequired: false },
  { path: 'renderer.animateBuild', label: 'animateBuild', canonical: false, type: 'boolean', regenerationRequired: false }
] as const;

export const OVERLAY_DEFINITIONS = ['primary_trunk','secondary_trunks','divergences','reconvergences','immediate_loops','conditional_loops','secret_loops','dead_ends','room_footprints','corridor_centerlines','doorways','clearance_fields','navigation_regions','unauthorized_contacts','player_starts','encounter_regions','hazards','objectives','boss_arena','reward_presentation_locations','authored_asset_usage','procedural_fallback_usage','missing_assets','collision_footprints','manifest_verification','checksum_comparison'].map(id => ({ id, label: id.replaceAll('_', ' '), category: id.includes('asset') || id.includes('missing') ? 'Assets' : id.includes('manifest') || id.includes('checksum') ? 'Authorization' : id.includes('room') || id.includes('corridor') || id.includes('navigation') ? 'Spatial' : id.includes('start') || id.includes('boss') || id.includes('reward') || id.includes('hazard') || id.includes('objective') ? 'Gameplay' : 'Graph', implementation: 'production-record-adapter' }));

export function assetRegistryForWorkbench() { return CATACOMBS_REFERENCE_ASSET_REGISTRY; }
