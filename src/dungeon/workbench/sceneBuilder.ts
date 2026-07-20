import type { ResolvedDungeon } from '../contracts/index.js';

export interface WorkbenchRendererState { readonly quality: 'low'|'medium'|'high'; readonly animateBuild: boolean; readonly overlayIds: readonly string[]; readonly camera?: unknown; readonly runtimeLod?: string; }
export interface SceneObjectRecord { readonly objectId: string; readonly sourceRecordId: string; readonly sourceKind: 'room'|'boundary'|'construction'|'gameplay'|'overlay'; readonly assetId?: string; readonly fallback: boolean; readonly runtimeLoadState: 'NOT_REQUESTED'|'LOADED'|'FAILED_USING_DECLARED_FALLBACK'|'UNAVAILABLE'; }
export interface SceneBuildResult { readonly rendererBoundary: 'threejs-presentation-only'; readonly sourceDungeonId: string; readonly canonicalChecksum: string; readonly objects: readonly SceneObjectRecord[]; readonly stats: { readonly estimatedDrawCalls: number; readonly actualDrawCalls: number|'UNAVAILABLE'; readonly instances: number; readonly triangles: number; readonly textureMemoryBytes: number; }; readonly staleLoadToken: string; }

export function buildSceneRecords(dungeon: ResolvedDungeon, state: WorkbenchRendererState): SceneBuildResult {
  const objects: SceneObjectRecord[] = [];
  for (const room of dungeon.rooms) objects.push({ objectId: `scene.room.${room.id}.floor`, sourceRecordId: room.id, sourceKind: 'room', fallback: false, runtimeLoadState: 'NOT_REQUESTED' });
  for (const boundary of dungeon.boundaries) objects.push(Object.fromEntries(Object.entries({ objectId: `scene.boundary.${boundary.id}`, sourceRecordId: boundary.id, sourceKind: 'boundary', assetId: boundary.assetId, fallback: false, runtimeLoadState: 'NOT_REQUESTED' }).filter(([, v]) => v !== undefined)) as unknown as SceneObjectRecord);
  for (const placement of dungeon.constructionPlacements) objects.push({ objectId: `scene.construction.${placement.id}`, sourceRecordId: placement.id, sourceKind: 'construction', assetId: placement.assetId, fallback: dungeon.assetUsage.find(a => a.assetId === placement.assetId)?.status === 'fallback', runtimeLoadState: 'NOT_REQUESTED' });
  for (const placement of dungeon.gameplayPlacements) objects.push({ objectId: `scene.gameplay.${placement.id}`, sourceRecordId: placement.id, sourceKind: 'gameplay', fallback: false, runtimeLoadState: 'NOT_REQUESTED' });
  for (const overlayId of state.overlayIds) objects.push({ objectId: `scene.overlay.${overlayId}`, sourceRecordId: overlayId, sourceKind: 'overlay', fallback: false, runtimeLoadState: 'UNAVAILABLE' });
  return { rendererBoundary: 'threejs-presentation-only', sourceDungeonId: dungeon.dungeonId, canonicalChecksum: dungeon.canonicalChecksum, objects, stats: { estimatedDrawCalls: dungeon.metrics.drawCalls, actualDrawCalls: 'UNAVAILABLE', instances: dungeon.drawCallGroups.reduce((n, g) => n + g.instances, 0), triangles: dungeon.metrics.triangles, textureMemoryBytes: dungeon.materialGroups.reduce((n, g) => n + g.textureMemoryBytes, 0) }, staleLoadToken: `${dungeon.dungeonId}:${dungeon.canonicalChecksum}:${state.quality}:${state.runtimeLod ?? 'auto'}` };
}

export const BUILD_ANIMATION_STAGES = ['Rooms scatter','Rooms separate','Graph resolves','Floors flood outward','Walls rise','Structural elements appear','Props pop','Gameplay overlays appear'] as const;
