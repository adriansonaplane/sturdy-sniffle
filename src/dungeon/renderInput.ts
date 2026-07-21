import type { EnvironmentProfile } from './contracts/index.js';
import type { ConstructionResult } from './construction.js';
import type { generateCatacombsGameplay } from './gameplay.js';
import type { CatacombsTileBoundary, CatacombsRoutingResult, RoutedCorridor, ResolvedDoorway } from './catacombsRouting.js';

export interface DungeonRenderInput {
  readonly schemaVersion: '1.0.0';
  readonly rendererContractVersion: 'catacombs.render_input.d2.v1';
  readonly environment: Pick<EnvironmentProfile, 'environmentId' | 'environmentVersion' | 'displayName'>;
  readonly geometry: {
    readonly corridors: readonly RoutedCorridor[];
    readonly doorways: readonly ResolvedDoorway[];
    readonly boundaries: readonly CatacombsTileBoundary[];
    readonly tileLayers: Extract<CatacombsRoutingResult, { ok: true }>['tileLayers'];
  };
  readonly construction: Pick<ConstructionResult, 'records' | 'sockets' | 'batches' | 'assetResolutions'>;
  readonly gameplayPresentation: {
    readonly placements: ReturnType<typeof generateCatacombsGameplay>['placements'];
    readonly dependencies: ReturnType<typeof generateCatacombsGameplay>['dependencies'];
  };
  readonly telegraphs: readonly { readonly id: string; readonly placementId: string; readonly regionId?: string }[];
}

export function createDungeonRenderInput(input: {
  readonly environment: EnvironmentProfile;
  readonly routing: Extract<CatacombsRoutingResult, { ok: true }>;
  readonly construction: ConstructionResult;
  readonly gameplay: ReturnType<typeof generateCatacombsGameplay>;
}): DungeonRenderInput {
  return {
    schemaVersion: '1.0.0',
    rendererContractVersion: 'catacombs.render_input.d2.v1',
    environment: { environmentId: input.environment.environmentId, environmentVersion: input.environment.environmentVersion, displayName: input.environment.displayName },
    geometry: { corridors: input.routing.corridors, doorways: input.routing.doorways, boundaries: input.routing.boundaries, tileLayers: input.routing.tileLayers },
    construction: { records: input.construction.records, sockets: input.construction.sockets, batches: input.construction.batches, assetResolutions: input.construction.assetResolutions },
    gameplayPresentation: { placements: input.gameplay.placements, dependencies: input.gameplay.dependencies },
    telegraphs: input.gameplay.placements.map(p => ({ id: `telegraph.${p.id}`, placementId: p.id, ...('region' in p && p.region ? { regionId: p.region.id } : {}) }))
  };
}
