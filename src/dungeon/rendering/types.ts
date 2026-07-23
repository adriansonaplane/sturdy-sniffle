import type { DungeonRenderInput } from '../renderInput.js';
export type QualityTier='low'|'medium'|'high';
export interface RendererOptions{quality:QualityTier; animateBuild:boolean; animationSpeed:number; wallFading:boolean; reducedMotion:boolean; postProcessing:boolean;}
import type { GameplayOverlayState } from '../gameplayPresentation.js';
export interface OverlayState{enabled:Readonly<Record<string,boolean>>; preset:string; gameplay?:GameplayOverlayState;}
export interface DungeonRendererContract{mount(container:HTMLElement):Promise<void>;render(input:DungeonRenderInput,options:RendererOptions):Promise<void>;updatePresentation(options:Partial<RendererOptions>):void;setOverlayState(state:OverlayState):void;selectGameplayPlacement(id?:string):void;getSelectedGameplayPlacement():unknown;resize(width:number,height:number,pixelRatio:number):void;disposeDungeon():void;dispose():void;}
export interface RendererStats{objects:number;geometries:number;materials:number;drawCalls:number;triangles:number;generationToken:number;assetErrors:string[];gameplayPlacements?:number;gameplayRenderablePlacements?:number;gameplayAreas?:number;}
export const DEFAULT_RENDERER_OPTIONS:RendererOptions={quality:'medium',animateBuild:true,animationSpeed:1,wallFading:true,reducedMotion:false,postProcessing:false};
