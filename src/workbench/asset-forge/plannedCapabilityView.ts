export interface PlannedCapability{readonly id:string; readonly label:string; readonly route:string; readonly objective:string; readonly description:string;}
export const ASSET_FORGE_CAPABILITIES:readonly PlannedCapability[]=[
{id:'overview',label:'Overview',route:'#/asset-forge',objective:'AF-D1',description:'Workspace foundation only; no assets are generated or approved.'},
{id:'catalog',label:'Catalog',route:'#/asset-forge/catalog',objective:'AF-D3',description:'Planned asset catalog and registry browsing.'},
{id:'create',label:'Create',route:'#/asset-forge/create',objective:'AF-D4/AF-D5',description:'Planned recipe authoring and generator execution.'},
{id:'inspect',label:'Inspect',route:'#/asset-forge/inspect',objective:'AF-D6',description:'Planned Three.js preview, inspection, and validation results.'},
{id:'review',label:'Review',route:'#/asset-forge/review',objective:'AF-D7',description:'Planned review, acceptance controls, export, and registry promotion.'}
];
