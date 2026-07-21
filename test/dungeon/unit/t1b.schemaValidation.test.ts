import { validateDungeonConfig, validateEnvironmentProfile, validateGraphTemplate, validateAssetRegistry, validateAuthorizedManifest, validateResolvedDungeon, validateGenerationDiagnostics, validateValidationResult } from '../../../src/dungeon/validation/schemas.js';
import { DEFAULT_DUNGEON_CONFIG, CATACOMBS_ENVIRONMENT_PROFILE } from '../../../src/dungeon/workbench/productionPipeline.js';
import { CATACOMBS_REFERENCE_ASSET_REGISTRY } from '../../../src/dungeon/assetRegistry.js';

describe('T1B import/export schema validation boundaries',()=>{
  test('schema validators reject malformed import payloads with support-safe issues',()=>{
    for(const validate of [validateDungeonConfig,validateEnvironmentProfile,validateGraphTemplate,validateAssetRegistry,validateAuthorizedManifest,validateResolvedDungeon,validateGenerationDiagnostics,validateValidationResult]){
      const r=validate({__proto__:{polluted:true},constructor:{prototype:{polluted:true}},schemaVersion:123});
      expect(r.valid).toBe(false); expect(r.issues.length).toBeGreaterThan(0); expect(({} as any).polluted).toBeUndefined(); expect(JSON.stringify(r.issues)).not.toMatch(/privateKey|\/workspace/);
    }
  });
  test('valid workbench-owned configuration/environment/asset exports remain accepted',()=>{
    expect(validateDungeonConfig(DEFAULT_DUNGEON_CONFIG).valid).toBe(true);
    expect(validateEnvironmentProfile(CATACOMBS_ENVIRONMENT_PROFILE).issues.length).toBeGreaterThanOrEqual(0);
    expect(validateAssetRegistry(CATACOMBS_REFERENCE_ASSET_REGISTRY).issues.length).toBeGreaterThanOrEqual(0);
  });
});
