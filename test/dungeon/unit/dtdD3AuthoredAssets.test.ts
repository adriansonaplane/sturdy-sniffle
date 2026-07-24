import { DTD_D3_AUTHORED_ASSET_MANIFEST, authoredStatusForRequirement, resolveDtdD3AuthoredAsset, validateDtdD3Manifest } from '../../../src/dungeon/assets/authoredCatacombs.js';
import { ENVIRONMENTAL_PROP_REGISTRY, buildEnvironmentalPropViews } from '../../../src/dungeon/environmentalProps.js';

describe('DTD-D3 authored asset manifest foundation',()=>{
  test('empty production manifest validates and classifies requirements as missing fallbacks',()=>{
    const result=validateDtdD3Manifest(DTD_D3_AUTHORED_ASSET_MANIFEST);
    expect(result).toMatchObject({ok:true,approvedCount:0});
    for(const entry of ENVIRONMENTAL_PROP_REGISTRY.filter(e=>e.futureAuthoredModelRequired)) expect(authoredStatusForRequirement(entry.assetRequirementId)).toBe('MISSING');
  });
  test('approved entries require safe paths, registry linkage, digest, provenance, license, and budgets',()=>{
    const bad={...DTD_D3_AUTHORED_ASSET_MANIFEST,entries:[{assetId:'a',registryId:'missing',requirementId:'r',category:'COFFIN' as const,relativePath:'../evil.glb',fileType:'glb' as const,byteSize:999999999,sha256:'no',dependencies:['https://x/y.png'],lodLevel:'high' as const,variant:'v',provenanceId:'',licenseId:'',acceptanceResultId:'acc',acceptanceStatus:'ACCEPTED' as const,validatorVersion:'v',lastValidationTimestamp:'2026-07-24T00:00:00Z',modelStats:{nodes:99,meshes:1,primitives:99,triangles:999999,vertices:999999,animations:1,skins:1,morphTargets:1,cameras:1,lights:1,bounds:{min:[0,0,0] as [number,number,number],max:[1,1,1] as [number,number,number]}},materialStats:{materials:99,textures:99,maxTextureDimension:9999,decodedTextureBytes:999999999,slots:['primary']},transformConvention:{units:'meters' as const,upAxis:'+y' as const,forwardAxis:'+z' as const,pivot:'floor_center' as const,handedness:'right' as const,normalizationScale:1},collision:{policy:'canonical_footprint' as const,shape:'aabb' as const,canonicalFootprintAuthority:true as const,meshNeverAuthoritative:true as const},budgetClass:'small_repeated_prop' as const,revision:1}]};
    const result=validateDtdD3Manifest(bad);
    expect(result.ok).toBe(false);
    expect(result.errors.join('\n')).toContain('unsafe relativePath');
    expect(result.errors.join('\n')).toContain('unknown registryId');
    expect(result.errors.join('\n')).toContain('accepted asset lacks provenance/license linkage');
  });
  test('environmental views expose fallback asset status without arbitrary resource paths',()=>{
    const views=buildEnvironmentalPropViews([{id:'p1',category:'prop',requestedAssetFamily:'coffin',assetResolutionState:'FALLBACK',transform:{position:{x:1,y:2,z:0},orientation:0,scale:[1,1,1]},source:{roomId:'r1'},materialGroupIds:[],placementRole:'room_prop',deterministicVariant:{seedNamespace:'construction',candidateIds:['closed_01']},canonicalTags:[]} as never]);
    expect(views[0]).toMatchObject({authoredAssetStatus:'MISSING',fallbackReason:'no approved authored asset; DTD-D2 procedural fallback active'});
    expect(JSON.stringify(views[0])).not.toContain('.glb');
    expect(resolveDtdD3AuthoredAsset(views[0]!.registryId,views[0]!.deterministicVariant,'high')).toBeUndefined();
  });
});
