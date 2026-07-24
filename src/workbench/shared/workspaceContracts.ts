export type WorkspaceId = 'dungeon-generator' | 'asset-forge' | 'settings' | 'about';
export interface ResolvedWorkbenchRoute { readonly path:string; readonly canonicalHash:string; readonly workspaceId:WorkspaceId; readonly title:string; readonly params: Readonly<Record<string,string>>; readonly query: Readonly<Record<string,string>>; readonly unknown?: boolean; }
export interface WorkspaceMountContext { readonly root:HTMLElement; readonly route:ResolvedWorkbenchRoute; readonly signal:AbortSignal; readonly navigate:(hash:string)=>void; readonly notify:(message:string)=>void; }
export interface WorkspaceActivationContext extends WorkspaceMountContext {}
export interface WorkspaceDeactivationContext { readonly nextRoute:ResolvedWorkbenchRoute; }
export interface WorkbenchWorkspace { readonly id:WorkspaceId; readonly routes:readonly string[]; mount(context:WorkspaceMountContext):void|Promise<void>; activate?(context:WorkspaceActivationContext):void|Promise<void>; deactivate?(context:WorkspaceDeactivationContext):void|Promise<void>; unmount():void|Promise<void>; dispose():void|Promise<void>; }
export type WorkbenchNavigationIntent = { readonly type:'OPEN_DUNGEON_GENERATOR' } | { readonly type:'OPEN_ASSET_FORGE'; readonly subroute?:'catalog'|'create'|'inspect'|'review'; readonly requirementId?:string; readonly registryId?:string };
