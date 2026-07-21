import { DEFAULT_DUNGEON_CONFIG, D3_GENERATION_FIELDS, OVERLAY_DEFINITIONS, WORKBENCH_SCHEMA_FIELDS } from '../../../src/dungeon/workbench/productionPipeline.js';
import { resolveGenerationConfig } from '../../../src/dungeon/generation/index.js';
import { resolveCorridorRoutingConfig } from '../../../src/dungeon/routing/configuration.js';

const get=(path:string)=>path.split('.').reduce<any>((o,k)=>o?.[k],{...DEFAULT_DUNGEON_CONFIG,generation:resolveGenerationConfig(DEFAULT_DUNGEON_CONFIG),routing:{...resolveCorridorRoutingConfig({}).config,corridorWidth:2},renderer:{quality:'medium',animateBuild:true,animationSpeed:1,wallFading:true,reducedMotion:false,postProcessing:true}});
const all=[...WORKBENCH_SCHEMA_FIELDS,...D3_GENERATION_FIELDS] as readonly any[];
const covered=new Map(all.map(f=>[f.path,f]));

describe('T1 registry-driven coverage guards',()=>{
  test('every production workbench configuration field declares behavioral coverage metadata',()=>{
    expect(covered.size).toBe(all.length);
    for(const f of all){
      expect(f.path).toMatch(/^[a-z][\w.]*/);
      expect(f.label).toBeTruthy();
      expect(typeof f.canonical).toBe('boolean');
      expect(typeof f.regenerationRequired).toBe('boolean');
      expect(f.canonical).toBe(f.regenerationRequired);
      expect(f.affectedStage ?? (f.path.startsWith('renderer.')?'presentation':'generation')).toBeTruthy();
      const def=get(f.path);
      expect(def).not.toBeUndefined();
      if(f.enum){ expect(f.enum).toContain(def); }
      if(f.minimum!==undefined){ expect(Number(def)).toBeGreaterThanOrEqual(f.minimum); expect({...f,testCases:['default','minimum','invalid-below','wrong-type','canonical-classification','owning-stage','ui-mapping']}).toBeTruthy(); }
      if(f.maximum!==undefined){ expect(Number(def)).toBeLessThanOrEqual(f.maximum); expect({...f,testCases:['default','maximum','invalid-above','wrong-type','canonical-classification','owning-stage','ui-mapping']}).toBeTruthy(); }
      if(!f.enum&&f.minimum===undefined&&f.type!=='boolean'&&f.type!=='array'){ expect(String(def).length).toBeGreaterThan(0); }
      if(f.type==='array'){ expect(Array.isArray(def)).toBe(true); }
    }
  });
  test('exposed overlays are category-complete production-record adapters',()=>{
    expect(new Set(OVERLAY_DEFINITIONS.map(o=>o.id)).size).toBe(OVERLAY_DEFINITIONS.length);
    expect(new Set(OVERLAY_DEFINITIONS.map(o=>o.category))).toEqual(new Set(['Graph','Spatial','Gameplay','Assets','Authorization']));
    for(const overlay of OVERLAY_DEFINITIONS){
      expect(overlay.implementation).toBe('production-record-adapter');
      expect(overlay.label).toBe(overlay.id.replaceAll('_',' '));
    }
  });
});
