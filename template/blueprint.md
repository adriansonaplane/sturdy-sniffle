You are a senior procedural-generation, developer-tooling, Three.js, and browser-performance engineer.



Build a single-file diagnostic application for the online Web Dungeon Generator.



This is a utility and test workbench, not the final production dungeon generator. Its purpose is to visualize, inspect, test, configure, import, export, and diagnose generator implementations as the environment Blueprints are completed.



REFERENCE FILE



First inspect the attached/reference `template/index.html` and `template/main.js`. If it's not attached check out the repository.



Preserve and improve its useful interaction patterns:



- Dark gothic developer-tool aesthetic

- Collapsible control panel

- Seed control and dice button

- Forge/regenerate action

- Generation-pipeline indicator

- Overlay toggles

- Room-function legend

- Live generation and rendering statistics

- Drag to pan

- Wheel to zoom

- Shift-drag or right-drag to orbit

- Keyboard shortcuts

- Responsive presentation



Do not retain its prototype environments:



- ancient

- molten

- frost

- grim

- verdant



The initial environment is:



- Catacombs



Reserve disabled/placeholder registry entries for:



- Garden Maze

- Dark Tower

- Hell’s Canyon

- Future environments



DELIVERABLE



Produce exactly one source file:



- `dungeon-generator-workbench.html`



The HTML file must contain:



- All HTML

- All CSS

- All utility JavaScript

- Generator module

- Validation module

- Diagnostics module

- Scene builder

- Inspectors

- Control panel

- Legends

- Import/export tools

- Test harness

- Default Catacombs profile

- Procedural fallback assets



Do not create separate CSS, JavaScript, JSON, image, shader, or configuration files.



No build step and no framework.



The only permitted external runtime dependency is one pinned Three.js ESM import from a stable CDN. Put the import URL in one obvious constant/comment so it can later be replaced by a bundled or locally hosted version.



If the existing project already provides an approved Three.js version, use that version. Otherwise use a pinned modern Three.js version compatible with WebGL2.



The page must run from a basic static HTTP server. Detect `file://` loading and show a clear message explaining that an HTTP server is required for module loading.



PRIMARY PURPOSE



The workbench must let developers:



1. Configure every exposed generator parameter.

2. Generate a deterministic Catacombs dungeon.

3. Inspect every generation stage.

4. Inspect the abstract graph.

5. Inspect spatial embedding.

6. Inspect gameplay placements.

7. Inspect asset resolution and fallbacks.

8. View all generation diagnostics.

9. Import and export configurations, graph templates, resolved dungeons, and diagnostics.

10. Compare output checksums.

11. Test future environment definitions without redesigning the UI.

12. Distinguish implemented data from placeholder/simulated diagnostic data.



ARCHITECTURAL RULES



Separate the following modules inside the HTML:



1. Type/schema documentation

2. Stable utilities and canonical serialization

3. Seeded RNG streams

4. Configuration registry

5. Environment registry

6. Graph generator

7. Room assignment

8. Spatial embedding

9. Corridor routing and rasterization

10. Gameplay placement

11. Asset registry and fallback resolution

12. Validation and diagnostics

13. ResolvedDungeon assembly

14. Three.js scene builder

15. Overlay/inspector renderer

16. Control-panel builder

17. Import/export functions

18. Test harness

19. Application bootstrap and animation loop



Use clearly labeled source sections.



GENERATOR/PRESENTATION SEPARATION



The generator must not create Three.js objects.



The generator returns typed arrays and plain data objects only.



The scene builder consumes a `ResolvedDungeon` and owns:



- Three.js scene objects

- Geometries

- Materials

- textures

- Instanced meshes

- Lights

- Effects

- Overlay objects

- GPU resource disposal



Implement:



- `generateDungeon(config): GenerationResult`

- `validateDungeon(dungeon): ValidationResult`

- `buildDungeonScene(dungeon, viewOptions): SceneHandle`

- `disposeDungeonScene(sceneHandle): void`

- `canonicalizeDungeon(dungeon): string`

- `checksumDungeon(dungeon): Promise<string>`



The scene handle must expose a reliable `dispose()` method.



INITIAL GRAPH MODEL



Implement the current Catacombs Graph Layout as a diagnostic reference generator.



The graph is a layered braided graph:



- One primary trunk

- Zero or more secondary trunks

- Divergence nodes

- Forward reconvergence nodes

- Immediate loops created by divergent routes that reconnect

- Conditional loops represented by initially closed shortcut edges

- Secret branches and secret loops

- Intentional dead ends

- Critical path from start to primary finish

- Forward depth layers

- Bidirectional normal traversal

- No arbitrary lateral cross-links

- No undeclared spatial contacts



Use separate representations for:



1. World/area graph

2. Room graph

3. Tile-navigation grid

4. Rendered Three.js scene



A grid tile is not the same thing as a room-graph node.



CONFIGURATION SYSTEM



Do not hard-code the entire control panel manually.



Create a schema-driven configuration registry.



Each configurable field declares:



- Stable ID

- Display label

- Group

- Description/tooltip

- Data type

- Input type

- Default

- Minimum

- Maximum

- Step

- Allowed options

- Whether regeneration is required

- Whether it is advanced

- Whether it is currently implemented

- Environment compatibility



Example:



{

  id: "graph.roomCount",

  label: "Room Count",

  group: "Graph",

  description: "Target physical room-node count.",

  type: "integer",

  input: "range-number",

  default: 42,

  min: 12,

  max: 80,

  step: 1,

  requiresRegeneration: true,

  implemented: true

}



Generate appropriate UI controls:



- Range sliders with synchronized number inputs

- Checkboxes

- Radio groups

- Select boxes

- Multi-select controls

- Color inputs

- Text inputs

- Number inputs

- Seed input

- Buttons

- Editable JSON text areas for advanced structures



Every writable parameter must have:



- Label

- Current value

- Reset-to-default control

- Tooltip or inline description

- Validation feedback



Add actions:



- Reset current section

- Reset all

- Copy configuration

- Export configuration

- Import configuration

- Forge dungeon

- Regenerate current stage where supported

- Randomize seed

- Previous seed

- Next seed



CONTROL GROUPS



At minimum expose these collapsible groups.



A. Session



- Seed

- Generator version

- Generation mode:

  - procedural

  - predefined

  - hybrid

- Environment

- Sub-biome

- Modifiers

- Visual layers

- Game type

- Difficulty

- Player count

- Quality tier

- animateBuild



B. Graph



- Dungeon size profile

- Target room count

- Candidate multiplier

- Depth-layer count

- Primary-trunk length

- Secondary-trunk count

- Branch count

- Dead-end count/range

- Immediate-loop count/range

- Immediate-loop chance

- Conditional-loop count/range

- Conditional-loop chance

- Secret count/range

- Secret chance

- Divergence count/range

- Reconvergence count/range

- Minimum branch length

- Maximum branch length

- Critical-path minimum

- Critical-path maximum

- Boss minimum normalized depth

- Minimum node degree

- Maximum node degree

- Maximum graph attempts

- Candidate graph count

- Minimum graph-quality score

- Allow one-way edges

- Allow conditional shortcuts

- Allow secret loops



C. Rooms



- Small-room weight

- Medium-room weight

- Large-room weight

- Landmark-room weight

- Room-shape weights

- Minimum/maximum room width

- Minimum/maximum room height

- Room padding

- Door padding

- Large-room requirement

- Landmark requirement

- Archetype weights

- Room-function weights

- Required room archetypes

- Maximum consecutive combat rooms

- Release-room frequency



D. Spatial embedding



- Grid width

- Grid height

- Graph-grid scale

- Tile scale

- Forward-axis spacing

- Branch-lane spacing

- Scatter radius

- Separation iterations

- Spatial attempts

- Corridor width by edge role

- Maximum corridor length

- Maximum corridor bends

- Corridor-routing mode

- Allow corridor crossings

- Promote crossings to junctions

- Minimum doorway width

- Minimum player clearance

- Eight-player staging clearance



E. Construction and decoration



- Decoration density

- Prop-cluster density

- Debris density

- Decal density

- Torch spacing

- Light density

- Dynamic-light budget

- Particle budget

- Floor variation

- Wall-height variation

- Damage-state frequency

- Secret-clue visibility

- Use authored assets

- Permit procedural fallbacks

- Show fallback markers



F. Gameplay



- Enable gameplay placement

- Encounter-density multiplier

- Encounter-budget multiplier

- Elite frequency

- Monster-family selection

- Hazard density

- Event frequency

- Objective count

- Side-boss count

- Reinforcement-wave count

- Player-start clearance

- Monster-start separation

- Boss-clearance profile

- Reward frequency

- Game-type transformation

- Player-count scaling

- Difficulty scaling



G. Validation



- Validate graph reachability

- Validate tile reachability

- Validate loop counts

- Validate dead ends

- Validate branch purpose

- Validate forward reconvergence

- Validate room degrees

- Validate adjacency

- Validate overlaps

- Validate padding

- Validate corridor authorization

- Validate navigation clearance

- Validate objectives

- Validate boss arena

- Validate assets

- Validate performance

- Treat warnings as errors

- Maximum generation attempts



H. Rendering



- Orthographic/perspective diagnostic camera

- Camera yaw

- Camera pitch

- Camera distance

- Zoom

- Floor visibility

- Wall visibility

- Ceiling visibility

- Prop visibility

- Light visibility

- Particle visibility

- Spawn-marker visibility

- Hazard visibility

- Objective visibility

- Post-processing

- Fog

- Shadows

- Isometric wall cutaway

- Low/medium/high quality profile



I. Animation



- Animate build

- Playback speed

- Pause

- Resume

- Step backward

- Step forward

- Restart animation

- Skip to completed dungeon

- Scatter duration

- Separation duration

- Graph duration

- Flood duration

- Wall-rise duration

- Prop-pop duration

- Freeze live effects while paused



FUTURE ENVIRONMENT SUPPORT



Build an environment registry:



{

  id,

  displayName,

  version,

  status,

  supportedLayouts,

  supportedGameTypes,

  configSchemaExtensions,

  inspectorExtensions,

  palette,

  assetNamespace

}



Initial registry:



- Catacombs:

  - enabled

  - implemented

  - layout: graph

- Garden Maze:

  - disabled

  - status: planned

  - layout: maze

- Dark Tower:

  - disabled

  - status: planned

  - layout: tower

- Hell’s Canyon:

  - disabled

  - status: planned

  - layout: tree-linear



The control panel must derive environment choices from this registry.



Disabled environments must be visible and labeled “Planned,” but must not pretend to generate valid content.



Do not restore the old prototype environments.



RESOLVED DUNGEON CONTRACT



Implement and document an expandable `ResolvedDungeon` contract containing at minimum:



interface ResolvedDungeon {

  identity: {

    dungeonId: string;

    seed: number;

    name: string;

    schemaVersion: string;

    generatorVersion: string;

    generationMode: "procedural" | "predefined" | "hybrid";

    layoutProfileId: string;

    environmentProfileId: string;

    environmentVersion: string;

    subBiomeId?: string;

    modifierIds: string[];

    visualLayerIds: string[];

  };



  config: DungeonConfig;



  worldGraph: WorldGraph;

  areaGraphs: AreaGraph[];

  roomGraph: RoomGraph;



  rooms: ResolvedRoom[];

  edges: ResolvedEdge[];

  branches: ResolvedBranch[];

  depthLayers: DepthLayer[];



  starts: PlayerStart[];

  completion: CompletionDefinition;

  objectives: ResolvedObjective[];



  grid: {

    width: number;

    height: number;

    tileTypes: Uint8Array;

    roomIds: Int16Array;

    corridorMask: Uint8Array;

    doorwayMask: Uint8Array;

    navigationMask: Uint8Array;

    clearanceField: Float32Array;

    distanceField: Int32Array;

    unauthorizedContactMask: Uint8Array;

  };



  construction: ConstructionPlacement[];

  gameplay: GameplayPlacement[];



  encounters: ResolvedEncounter[];

  monsters: ResolvedMonsterSpawn[];

  reinforcementSockets: ReinforcementSocket[];

  hazards: ResolvedHazard[];

  events: ResolvedEvent[];

  rewards: ResolvedReward[];

  bosses: ResolvedBoss[];



  assets: ResolvedAssetUsage[];

  materialGroups: MaterialGroupSummary[];

  drawCallGroups: DrawCallGroupSummary[];



  metrics: DungeonMetrics;

  validation: ValidationResult;

  diagnostics: GenerationDiagnostics;



  canonicalChecksum: string;

}



All top-level `ResolvedDungeon` sections must be visible in the utility.



Provide:



- Expand/collapse tree viewer

- Search/filter

- Copy selected value

- Copy JSON

- Export JSON

- Summary view

- Raw canonical-data view



Typed arrays must be presented as:



- Type

- Length

- Minimum

- Maximum

- Nonzero count

- Compact preview

- Optional full export



Do not dump thousands of values into the DOM by default.



GENERATION DIAGNOSTICS CONTRACT



Implement:



interface GenerationDiagnostics {

  valid: boolean;

  qualityScore: number;

  attemptCount: number;

  finalAttemptSeed: number;



  timings: Record<string, number>;



  issues: GenerationDiagnostic[];



  stageSummaries: {

    scatter: StageDiagnosticSummary;

    separation: StageDiagnosticSummary;

    graph: StageDiagnosticSummary;

    roomAssignment: StageDiagnosticSummary;

    spatialEmbedding: StageDiagnosticSummary;

    corridorRouting: StageDiagnosticSummary;

    rasterization: StageDiagnosticSummary;

    construction: StageDiagnosticSummary;

    gameplay: StageDiagnosticSummary;

    assetResolution: StageDiagnosticSummary;

    validation: StageDiagnosticSummary;

    checksum: StageDiagnosticSummary;

  };



  graphMetrics: GraphDiagnosticMetrics;

  spatialMetrics: SpatialDiagnosticMetrics;

  gameplayMetrics: GameplayDiagnosticMetrics;

  assetMetrics: AssetDiagnosticMetrics;

  performanceMetrics: PerformanceDiagnosticMetrics;

}



interface GenerationDiagnostic {

  id: string;

  severity: "info" | "warning" | "error";

  stage: string;

  code: string;

  message: string;



  graphId?: string;

  nodeIds?: string[];

  edgeIds?: string[];

  roomIds?: string[];

  assetIds?: string[];

  coordinates?: Array<{ x: number; y: number; level?: number }>;



  constraintId?: string;

  attempt: number;

  resolved: boolean;

  simulated?: boolean;

}



The diagnostics panel must support:



- Severity filters

- Stage filters

- Code filter/search

- Unresolved-only toggle

- Sort by severity/stage/code

- Click diagnostic to focus relevant graph node, room, edge, asset, or tile

- Copy diagnostic

- Export diagnostics

- Clear client-only diagnostics

- Error/warning/info counts

- Timing bars per stage

- Quality-score display

- Attempt history



Clearly mark placeholder diagnostic values as `SIMULATED` until a real implementation supplies them.



INSPECTOR LAYOUT



Use a desktop developer-workbench layout:



- Left: collapsible parameter/configuration panel

- Center: Three.js dungeon viewport

- Right: collapsible inspector panel

- Bottom: optional diagnostics/timeline drawer

- Top: environment, seed, generation state, checksum, and main actions



On small screens:



- Panels become drawers or tabs

- Viewport remains usable

- Controls remain keyboard accessible

- No mandatory hover-only interactions



RIGHT INSPECTOR TABS



Create these tabs:



1. Graph

2. Spatial

3. Gameplay

4. Assets

5. Resolved Dungeon

6. Diagnostics

7. Tests

8. Performance



GRAPH INSPECTOR



Display and independently toggle:



- Primary trunk

- Secondary trunks

- Divergence nodes

- Reconvergence nodes

- Immediate loops

- Conditional loops

- Secret branches

- Secret loops

- Dead ends

- Critical path

- Initial critical path

- Final critical path after shortcuts

- Depth layers

- Room degrees

- Node functions

- Node categories

- Node scales

- Branch IDs

- Edge direction

- Edge state

- Edge criticality

- Start

- Primary finish

- Structural exits

- Articulation points

- Invalid degrees

- Forbidden adjacencies



Required graph interaction:



- Hover node for tooltip

- Click node to select it

- Click edge to inspect it

- Focus selected node in viewport

- Filter by function, scale, degree, depth, or branch

- Show graph metrics

- Show node/edge table

- Highlight shortest route

- Highlight selected branch

- Highlight diagnostic targets



Use stable colors and line styles:



- Primary trunk: bright white or gold

- Secondary trunk: blue

- Immediate loop: cyan solid

- Conditional loop: orange dashed

- Secret: violet dotted

- Critical path: red

- Invalid: magenta

- Start: teal

- Finish/boss: crimson



Do not rely on color alone. Use different line styles, thicknesses, glyphs, and labels.



SPATIAL INSPECTOR



Display and independently toggle:



- Room footprints

- Grid anchors

- Graph grid

- Tile grid

- Corridor paths

- Corridor centerlines

- Doorways

- Wall boundaries

- Room padding

- Door padding

- Overlaps

- Clearance fields

- Navigation regions

- Non-walkable regions

- Player traversal field

- Monster traversal field

- Boss clearance

- Unauthorized contacts

- Corridor crossings

- Junction promotions

- Room ownership

- Distance field

- Area bounds



Required interaction:



- Inspect a tile

- Display tile coordinates

- Display room owner

- Display tile type

- Display navigation flags

- Display clearance value

- Display distance value

- Display collision and unauthorized-contact flags

- Focus selected room

- Show room footprint and reserved regions

- Highlight overlap and padding violations



Clearance and distance fields need selectable heatmaps with legends.



GAMEPLAY INSPECTOR



Display and independently toggle:



- Primary player start

- Late-join starts

- Checkpoints

- Monster spawns

- Monster families

- Monster roles

- Encounter regions

- Encounter budgets

- Budget utilization

- Reinforcement sockets

- Patrol paths

- Hazards

- Hazard telegraphs

- Hazard safe regions

- Objectives

- Objective dependency edges

- Boss

- Boss arena

- Boss clearance

- Boss phase sockets

- Event regions

- Reward locations

- Treasure rooms

- Shrines

- Side bosses

- Interaction points

- Room-lock boundaries



Required interaction:



- Filter by content category

- Select encounter and view composition

- Select spawn and view monster definition

- Select hazard and view counterplay data

- Select objective and view dependency chain

- Select boss and view arena requirements

- Display room budget calculations

- Highlight placements marked simulated or placeholder



ASSET INSPECTOR



Display:



- Asset IDs

- Asset category

- Authored asset URI/reference

- Procedural fallback ID

- Resolution status

- Missing assets

- Fallback usage

- Collision footprints

- Navigation footprints

- Material groups

- Texture groups

- LOD definitions

- Active LOD

- Draw-call groups

- Instance counts

- Triangle estimates

- Texture-memory estimates

- Geometry-memory estimates

- Quality-tier support

- Unused loaded assets

- Duplicate material candidates



Required asset states:



- AUTHORED

- FALLBACK

- MISSING

- PLACEHOLDER

- INVALID



Required asset controls:



- Show only missing

- Show only fallbacks

- Show only invalid

- Force all fallbacks

- Compare authored/fallback footprint

- Highlight asset instances in viewport

- Sort by estimated memory

- Sort by instance count

- Export asset-usage report



Use procedural fallback assets for the initial utility. Mark them visibly as fallbacks without making the dungeon unreadable.



CONTROL-PANEL OVERLAYS



Every overlay must have an independent checkbox.



Also provide:



- Enable all overlays

- Disable all overlays

- Reset overlay defaults

- Solo selected overlay

- Graph preset

- Spatial preset

- Gameplay preset

- Asset preset

- Validation preset

- Screenshot preset



Persist purely local UI preferences in `localStorage`, but do not let them affect canonical generation.



LIVE STATISTICS



Display at minimum:



Graph:



- Nodes

- Edges

- Primary-trunk nodes

- Secondary trunks

- Branches

- Divergences

- Reconvergences

- Immediate loops

- Conditional loops

- Secrets

- Dead ends

- Articulation points

- Cyclomatic number

- Critical-path length

- Maximum depth

- Average degree

- Quality score



Spatial:



- Grid width/height

- Room area

- Floor tiles

- Corridor tiles

- Wall boundaries

- Doorways

- Overlaps

- Padding violations

- Unauthorized contacts

- Reachable percentage

- Minimum critical-path clearance



Gameplay:



- Player starts

- Encounters

- Monsters

- Encounter budget

- Budget utilization

- Reinforcement sockets

- Hazards

- Objectives

- Events

- Rewards

- Side bosses

- Main bosses



Assets/rendering:



- Resolved assets

- Missing assets

- Fallback assets

- Material groups

- Texture-memory estimate

- Geometry-memory estimate

- Draw calls

- Triangles

- Instanced objects

- Dynamic lights

- Particles

- FPS

- Frame time



Generation:



- Attempt count

- Stage timings

- Total generation time

- Validation time

- Canonicalization time

- Checksum time

- Warning count

- Error count

- Final seed/attempt seed

- Canonical checksum



LEGENDS



Provide dynamic legends for:



- Room functions

- Node scales

- Node categories

- Graph edge types

- Edge states

- Depth heatmap

- Clearance heatmap

- Navigation regions

- Gameplay placements

- Asset states

- Diagnostic severity



Legends must update when overlays change.



STAGED BUILD ANIMATION



Implement optional animation controlled by `animateBuild`.



Stages:



1. Candidate rooms scatter

2. Rooms separate

3. Graph candidates appear

4. Primary trunk resolves

5. Secondary trunks resolve

6. Divergences and reconvergences appear

7. Immediate, conditional, and secret edges appear

8. Room functions are assigned

9. Spatial embedding settles

10. Corridors carve

11. Floors flood outward using the distance field

12. Walls rise

13. Doors and arches appear

14. Structural assets rise

15. Props pop

16. Gameplay markers appear

17. Validation overlays flash/highlight

18. Checksum and completion state appear



Required animation controls:



- Play

- Pause

- Restart

- Skip

- Previous stage

- Next stage

- Playback speed

- Timeline scrubber

- Current stage name

- Stage timing

- Reduced-motion behavior



When `prefers-reduced-motion` is active:



- Default `animateBuild` to false

- Preserve manual stage stepping

- Avoid rapid flashing



The animation visualizes already-generated stage snapshots. Animation timing must not affect generation output.



GENERATION STAGE SNAPSHOTS



Store lightweight stage snapshots or diagnostic views sufficient to replay:



- Candidate room anchors

- Separated room anchors

- Candidate edges

- Accepted graph

- Room assignments

- Embedded footprints

- Routed corridors

- Rasterized tiles

- Construction placements

- Gameplay placements

- Final validation



Do not duplicate full large typed arrays unnecessarily.



IMPORT/EXPORT



Implement:



- Import configuration JSON

- Export configuration JSON

- Import predefined graph template JSON

- Export current graph as template JSON

- Import resolved dungeon JSON

- Export resolved dungeon JSON

- Export canonical JSON

- Export diagnostics JSON

- Export asset report JSON

- Export test report JSON

- Copy checksum

- Copy seed

- Download viewport PNG

- Download minimap PNG if implemented



Validate imported data and display actionable errors. Never execute imported content.



TEST HARNESS



Include an in-page test tab and “Run Tests” action.



Tests:



- Same seed/config produces identical checksum three times

- Different seeds normally produce different checksums

- Named RNG streams are stable

- Graph is connected

- Required rooms reachable

- At least one immediate loop

- Dead-end minimum satisfied

- Every branch has a purpose

- Reconvergences occur deeper than divergences

- Node degrees are legal

- Adjacencies are legal

- No room overlaps

- Corridor routes exist

- No unauthorized spatial contacts

- Tile reachability is 100% for required walkable tiles

- Player-start clearance passes

- Objective reachability passes

- Boss arena clearance passes

- No gameplay placement overlaps blocked geometry

- Every asset resolves or has a fallback

- Dynamic-light budget passes

- Draw-call budget reports pass/fail

- Serialization is canonical

- Imported/exported configuration round-trips

- ResolvedDungeon export/import round-trips



Show:



- Pass/fail

- Duration

- Error details

- Relevant diagnostic targets

- Copy/export report



Add a bounded multi-seed test:



- User-configurable seed count

- Default 100

- Maximum appropriate for the browser

- Progress indicator

- Cancel button

- Failure-seed list

- Aggregate distributions

- Run in time-sliced batches so the UI remains responsive

- Use a Web Worker created from an inline Blob where practical



DETERMINISM



Use seeded RNG only.



Create named RNG streams:



- graph

- roomAssignment

- spatialEmbedding

- corridorRouting

- construction

- encounters

- hazards

- objectives

- bosses

- props

- naming



Ban generation decisions based on:



- `Math.random`

- `Date.now`

- frame time

- unordered iteration

- GPU results

- animation timing



The dice button may use browser cryptographic randomness only to select a new root seed. Once selected, that seed fully determines authoritative output.



Use explicit stable tie-breaking and stable sorting.



DIAGNOSTIC PLACEHOLDERS



Some Blueprint systems may not yet exist.



When a system is absent:



- Do not fabricate production behavior.

- Produce clearly marked simulated diagnostic fixtures only when needed to demonstrate the inspector.

- Add `simulated: true`.

- Label the UI with `SIMULATED`.

- Keep simulated data out of the canonical authoritative checksum unless the demo mode explicitly includes it.

- Provide a control to disable all simulated content.

- Show “Not implemented” instead of fake success when no fixture is appropriate.



SCENE BUILDER



Use an isometric orthographic camera by default.



Render:



- Floors

- Edge-based walls

- Doorways

- Procedural fallback doors

- Corridors

- Simple columns/arches

- Placeholder props

- Player-start markers

- Monster markers

- Hazard markers

- Objective markers

- Boss-clearance region

- Reward markers

- Debug overlays



Use:



- InstancedMesh for repeated geometry

- Shared materials

- No individual mesh per tile

- No shadowed point lights

- At most the configured dynamic-light budget

- Frustum culling where appropriate

- Reliable disposal on regeneration



Keep debug overlays separate from production geometry.



ACCESSIBILITY



- Semantic buttons, labels, tabs, and form controls

- Keyboard navigation

- Visible focus states

- ARIA labels

- Sufficient contrast

- No color-only status communication

- Reduced-motion support

- Tooltips available by focus, not hover only

- Resizable or collapsible panels

- Text-size-friendly layout



ERROR HANDLING



Do not throw raw errors into the page.



Provide:



- Visible generation-failure banner

- Diagnostic issue

- Stage name

- Attempt count

- Constraint code

- Suggested corrective parameter

- Copy error details

- Return to last valid dungeon



Never display a known-invalid dungeon as valid.



If generation fails:



- Keep the last valid dungeon visible

- Show failed candidate overlays only when explicitly requested

- Do not silently change environment, game type, or difficulty

- Do not repair disconnected graphs with teleporters



REFERENCE-PAGE CHANGES



The attached `index.html` currently:



- Uses external CSS

- Uses an external `src/main.js`

- Contains old prototype themes

- Exposes only a few controls

- Has one general graph toggle

- Has a compact fixed telemetry panel



For this utility:



- Inline the CSS and JavaScript

- Replace old themes with the environment registry

- Expand controls using the schema-driven system

- Split graph/spatial/gameplay/asset inspection into dedicated tabs

- Preserve the strong dark visual design

- Preserve compact live statistics

- Preserve useful camera and keyboard interactions

- Add complete diagnostics and import/export support



KEYBOARD SHORTCUTS



At minimum:



- R: regenerate

- Shift+R: random seed and regenerate

- Space: pause/resume build

- Escape: skip build or close active dialog

- Left/Right: previous/next build stage when paused

- G: graph inspector preset

- S: spatial inspector preset

- Y: gameplay inspector preset

- A: asset inspector preset

- D: diagnostics panel

- F: focus selected object

- 0: reset camera

- Ctrl/Cmd+E: export configuration

- Ctrl/Cmd+I: import configuration

- ?: show shortcut help



Do not intercept shortcuts while the user is typing in an input or editor.



QUALITY REQUIREMENTS



- No console errors during normal use.

- No unresolved references.

- No hidden nondeterminism.

- No per-tile Mesh objects.

- No event-listener leaks during regeneration.

- No retained dungeon-specific GPU resources after disposal.

- UI remains responsive during multi-seed testing.

- Invalid inputs show inline validation.

- Controls and data viewers remain usable with large configurations.

- The current dungeon checksum is visible at all times.

- Every overlay listed in this prompt is represented by an independent control.

- Every top-level ResolvedDungeon and GenerationDiagnostics section is inspectable.

- Future environments can extend controls and inspectors through registries without rewriting the core UI.



SELF-VERIFICATION



Before finishing:



1. Open the page through a static HTTP server.

2. Generate at least three seeds.

3. Run the in-page test suite.

4. Verify repeated-seed checksums.

5. Exercise every inspector tab.

6. Toggle every overlay category.

7. Import/export a configuration.

8. Export and reimport a ResolvedDungeon.

9. Force procedural fallbacks.

10. Trigger a controlled generation failure.

11. Verify the last valid dungeon remains visible.

12. Regenerate repeatedly and check for resource growth.

13. Test reduced-motion behavior.

14. Test desktop and narrow responsive layouts.

15. Report any intentionally stubbed features in an in-page “Implementation Status” section.



FINAL RESPONSE



Return:



- The completed `dungeon-generator-workbench.html`

- A concise feature summary

- How to serve it locally

- Implemented versus simulated systems

- Test results

- Known limitations

- Confirmation that the old prototype environment themes were not retainedYou are a senior procedural-generation, developer-tooling, Three.js, and browser-performance engineer.



Build a single-file diagnostic application for the online Web Dungeon Generator.



This is a utility and test workbench, not the final production dungeon generator. Its purpose is to visualize, inspect, test, configure, import, export, and diagnose generator implementations as the environment Blueprints are completed.



REFERENCE FILE



First inspect the attached/reference `index.html`.



Preserve and improve its useful interaction patterns:



- Dark gothic developer-tool aesthetic

- Collapsible control panel

- Seed control and dice button

- Forge/regenerate action

- Generation-pipeline indicator

- Overlay toggles

- Room-function legend

- Live generation and rendering statistics

- Drag to pan

- Wheel to zoom

- Shift-drag or right-drag to orbit

- Keyboard shortcuts

- Responsive presentation



Do not retain its prototype environments:



- ancient

- molten

- frost

- grim

- verdant



The initial environment is:



- Catacombs



Reserve disabled/placeholder registry entries for:



- Garden Maze

- Dark Tower

- Hell’s Canyon

- Future environments



DELIVERABLE



Produce exactly one source file:



- `dungeon-generator-workbench.html`



The HTML file must contain:



- All HTML

- All CSS

- All utility JavaScript

- Generator module

- Validation module

- Diagnostics module

- Scene builder

- Inspectors

- Control panel

- Legends

- Import/export tools

- Test harness

- Default Catacombs profile

- Procedural fallback assets



Do not create separate CSS, JavaScript, JSON, image, shader, or configuration files.



No build step and no framework.



The only permitted external runtime dependency is one pinned Three.js ESM import from a stable CDN. Put the import URL in one obvious constant/comment so it can later be replaced by a bundled or locally hosted version.



If the existing project already provides an approved Three.js version, use that version. Otherwise use a pinned modern Three.js version compatible with WebGL2.



The page must run from a basic static HTTP server. Detect `file://` loading and show a clear message explaining that an HTTP server is required for module loading.



PRIMARY PURPOSE



The workbench must let developers:



1. Configure every exposed generator parameter.

2. Generate a deterministic Catacombs dungeon.

3. Inspect every generation stage.

4. Inspect the abstract graph.

5. Inspect spatial embedding.

6. Inspect gameplay placements.

7. Inspect asset resolution and fallbacks.

8. View all generation diagnostics.

9. Import and export configurations, graph templates, resolved dungeons, and diagnostics.

10. Compare output checksums.

11. Test future environment definitions without redesigning the UI.

12. Distinguish implemented data from placeholder/simulated diagnostic data.



ARCHITECTURAL RULES



Separate the following modules inside the HTML:



1. Type/schema documentation

2. Stable utilities and canonical serialization

3. Seeded RNG streams

4. Configuration registry

5. Environment registry

6. Graph generator

7. Room assignment

8. Spatial embedding

9. Corridor routing and rasterization

10. Gameplay placement

11. Asset registry and fallback resolution

12. Validation and diagnostics

13. ResolvedDungeon assembly

14. Three.js scene builder

15. Overlay/inspector renderer

16. Control-panel builder

17. Import/export functions

18. Test harness

19. Application bootstrap and animation loop



Use clearly labeled source sections.



GENERATOR/PRESENTATION SEPARATION



The generator must not create Three.js objects.



The generator returns typed arrays and plain data objects only.



The scene builder consumes a `ResolvedDungeon` and owns:



- Three.js scene objects

- Geometries

- Materials

- textures

- Instanced meshes

- Lights

- Effects

- Overlay objects

- GPU resource disposal



Implement:



- `generateDungeon(config): GenerationResult`

- `validateDungeon(dungeon): ValidationResult`

- `buildDungeonScene(dungeon, viewOptions): SceneHandle`

- `disposeDungeonScene(sceneHandle): void`

- `canonicalizeDungeon(dungeon): string`

- `checksumDungeon(dungeon): Promise<string>`



The scene handle must expose a reliable `dispose()` method.



INITIAL GRAPH MODEL



Implement the current Catacombs Graph Layout as a diagnostic reference generator.



The graph is a layered braided graph:



- One primary trunk

- Zero or more secondary trunks

- Divergence nodes

- Forward reconvergence nodes

- Immediate loops created by divergent routes that reconnect

- Conditional loops represented by initially closed shortcut edges

- Secret branches and secret loops

- Intentional dead ends

- Critical path from start to primary finish

- Forward depth layers

- Bidirectional normal traversal

- No arbitrary lateral cross-links

- No undeclared spatial contacts



Use separate representations for:



1. World/area graph

2. Room graph

3. Tile-navigation grid

4. Rendered Three.js scene



A grid tile is not the same thing as a room-graph node.



CONFIGURATION SYSTEM



Do not hard-code the entire control panel manually.



Create a schema-driven configuration registry.



Each configurable field declares:



- Stable ID

- Display label

- Group

- Description/tooltip

- Data type

- Input type

- Default

- Minimum

- Maximum

- Step

- Allowed options

- Whether regeneration is required

- Whether it is advanced

- Whether it is currently implemented

- Environment compatibility



Example:



{

  id: "graph.roomCount",

  label: "Room Count",

  group: "Graph",

  description: "Target physical room-node count.",

  type: "integer",

  input: "range-number",

  default: 42,

  min: 12,

  max: 80,

  step: 1,

  requiresRegeneration: true,

  implemented: true

}



Generate appropriate UI controls:



- Range sliders with synchronized number inputs

- Checkboxes

- Radio groups

- Select boxes

- Multi-select controls

- Color inputs

- Text inputs

- Number inputs

- Seed input

- Buttons

- Editable JSON text areas for advanced structures



Every writable parameter must have:



- Label

- Current value

- Reset-to-default control

- Tooltip or inline description

- Validation feedback



Add actions:



- Reset current section

- Reset all

- Copy configuration

- Export configuration

- Import configuration

- Forge dungeon

- Regenerate current stage where supported

- Randomize seed

- Previous seed

- Next seed



CONTROL GROUPS



At minimum expose these collapsible groups.



A. Session



- Seed

- Generator version

- Generation mode:

  - procedural

  - predefined

  - hybrid

- Environment

- Sub-biome

- Modifiers

- Visual layers

- Game type

- Difficulty

- Player count

- Quality tier

- animateBuild



B. Graph



- Dungeon size profile

- Target room count

- Candidate multiplier

- Depth-layer count

- Primary-trunk length

- Secondary-trunk count

- Branch count

- Dead-end count/range

- Immediate-loop count/range

- Immediate-loop chance

- Conditional-loop count/range

- Conditional-loop chance

- Secret count/range

- Secret chance

- Divergence count/range

- Reconvergence count/range

- Minimum branch length

- Maximum branch length

- Critical-path minimum

- Critical-path maximum

- Boss minimum normalized depth

- Minimum node degree

- Maximum node degree

- Maximum graph attempts

- Candidate graph count

- Minimum graph-quality score

- Allow one-way edges

- Allow conditional shortcuts

- Allow secret loops



C. Rooms



- Small-room weight

- Medium-room weight

- Large-room weight

- Landmark-room weight

- Room-shape weights

- Minimum/maximum room width

- Minimum/maximum room height

- Room padding

- Door padding

- Large-room requirement

- Landmark requirement

- Archetype weights

- Room-function weights

- Required room archetypes

- Maximum consecutive combat rooms

- Release-room frequency



D. Spatial embedding



- Grid width

- Grid height

- Graph-grid scale

- Tile scale

- Forward-axis spacing

- Branch-lane spacing

- Scatter radius

- Separation iterations

- Spatial attempts

- Corridor width by edge role

- Maximum corridor length

- Maximum corridor bends

- Corridor-routing mode

- Allow corridor crossings

- Promote crossings to junctions

- Minimum doorway width

- Minimum player clearance

- Eight-player staging clearance



E. Construction and decoration



- Decoration density

- Prop-cluster density

- Debris density

- Decal density

- Torch spacing

- Light density

- Dynamic-light budget

- Particle budget

- Floor variation

- Wall-height variation

- Damage-state frequency

- Secret-clue visibility

- Use authored assets

- Permit procedural fallbacks

- Show fallback markers



F. Gameplay



- Enable gameplay placement

- Encounter-density multiplier

- Encounter-budget multiplier

- Elite frequency

- Monster-family selection

- Hazard density

- Event frequency

- Objective count

- Side-boss count

- Reinforcement-wave count

- Player-start clearance

- Monster-start separation

- Boss-clearance profile

- Reward frequency

- Game-type transformation

- Player-count scaling

- Difficulty scaling



G. Validation



- Validate graph reachability

- Validate tile reachability

- Validate loop counts

- Validate dead ends

- Validate branch purpose

- Validate forward reconvergence

- Validate room degrees

- Validate adjacency

- Validate overlaps

- Validate padding

- Validate corridor authorization

- Validate navigation clearance

- Validate objectives

- Validate boss arena

- Validate assets

- Validate performance

- Treat warnings as errors

- Maximum generation attempts



H. Rendering



- Orthographic/perspective diagnostic camera

- Camera yaw

- Camera pitch

- Camera distance

- Zoom

- Floor visibility

- Wall visibility

- Ceiling visibility

- Prop visibility

- Light visibility

- Particle visibility

- Spawn-marker visibility

- Hazard visibility

- Objective visibility

- Post-processing

- Fog

- Shadows

- Isometric wall cutaway

- Low/medium/high quality profile



I. Animation



- Animate build

- Playback speed

- Pause

- Resume

- Step backward

- Step forward

- Restart animation

- Skip to completed dungeon

- Scatter duration

- Separation duration

- Graph duration

- Flood duration

- Wall-rise duration

- Prop-pop duration

- Freeze live effects while paused



FUTURE ENVIRONMENT SUPPORT



Build an environment registry:



{

  id,

  displayName,

  version,

  status,

  supportedLayouts,

  supportedGameTypes,

  configSchemaExtensions,

  inspectorExtensions,

  palette,

  assetNamespace

}



Initial registry:



- Catacombs:

  - enabled

  - implemented

  - layout: graph

- Garden Maze:

  - disabled

  - status: planned

  - layout: maze

- Dark Tower:

  - disabled

  - status: planned

  - layout: tower

- Hell’s Canyon:

  - disabled

  - status: planned

  - layout: tree-linear



The control panel must derive environment choices from this registry.



Disabled environments must be visible and labeled “Planned,” but must not pretend to generate valid content.



Do not restore the old prototype environments.



RESOLVED DUNGEON CONTRACT



Implement and document an expandable `ResolvedDungeon` contract containing at minimum:



interface ResolvedDungeon {

  identity: {

    dungeonId: string;

    seed: number;

    name: string;

    schemaVersion: string;

    generatorVersion: string;

    generationMode: "procedural" | "predefined" | "hybrid";

    layoutProfileId: string;

    environmentProfileId: string;

    environmentVersion: string;

    subBiomeId?: string;

    modifierIds: string[];

    visualLayerIds: string[];

  };



  config: DungeonConfig;



  worldGraph: WorldGraph;

  areaGraphs: AreaGraph[];

  roomGraph: RoomGraph;



  rooms: ResolvedRoom[];

  edges: ResolvedEdge[];

  branches: ResolvedBranch[];

  depthLayers: DepthLayer[];



  starts: PlayerStart[];

  completion: CompletionDefinition;

  objectives: ResolvedObjective[];



  grid: {

    width: number;

    height: number;

    tileTypes: Uint8Array;

    roomIds: Int16Array;

    corridorMask: Uint8Array;

    doorwayMask: Uint8Array;

    navigationMask: Uint8Array;

    clearanceField: Float32Array;

    distanceField: Int32Array;

    unauthorizedContactMask: Uint8Array;

  };



  construction: ConstructionPlacement[];

  gameplay: GameplayPlacement[];



  encounters: ResolvedEncounter[];

  monsters: ResolvedMonsterSpawn[];

  reinforcementSockets: ReinforcementSocket[];

  hazards: ResolvedHazard[];

  events: ResolvedEvent[];

  rewards: ResolvedReward[];

  bosses: ResolvedBoss[];



  assets: ResolvedAssetUsage[];

  materialGroups: MaterialGroupSummary[];

  drawCallGroups: DrawCallGroupSummary[];



  metrics: DungeonMetrics;

  validation: ValidationResult;

  diagnostics: GenerationDiagnostics;



  canonicalChecksum: string;

}



All top-level `ResolvedDungeon` sections must be visible in the utility.



Provide:



- Expand/collapse tree viewer

- Search/filter

- Copy selected value

- Copy JSON

- Export JSON

- Summary view

- Raw canonical-data view



Typed arrays must be presented as:



- Type

- Length

- Minimum

- Maximum

- Nonzero count

- Compact preview

- Optional full export



Do not dump thousands of values into the DOM by default.



GENERATION DIAGNOSTICS CONTRACT



Implement:



interface GenerationDiagnostics {

  valid: boolean;

  qualityScore: number;

  attemptCount: number;

  finalAttemptSeed: number;



  timings: Record<string, number>;



  issues: GenerationDiagnostic[];



  stageSummaries: {

    scatter: StageDiagnosticSummary;

    separation: StageDiagnosticSummary;

    graph: StageDiagnosticSummary;

    roomAssignment: StageDiagnosticSummary;

    spatialEmbedding: StageDiagnosticSummary;

    corridorRouting: StageDiagnosticSummary;

    rasterization: StageDiagnosticSummary;

    construction: StageDiagnosticSummary;

    gameplay: StageDiagnosticSummary;

    assetResolution: StageDiagnosticSummary;

    validation: StageDiagnosticSummary;

    checksum: StageDiagnosticSummary;

  };



  graphMetrics: GraphDiagnosticMetrics;

  spatialMetrics: SpatialDiagnosticMetrics;

  gameplayMetrics: GameplayDiagnosticMetrics;

  assetMetrics: AssetDiagnosticMetrics;

  performanceMetrics: PerformanceDiagnosticMetrics;

}



interface GenerationDiagnostic {

  id: string;

  severity: "info" | "warning" | "error";

  stage: string;

  code: string;

  message: string;



  graphId?: string;

  nodeIds?: string[];

  edgeIds?: string[];

  roomIds?: string[];

  assetIds?: string[];

  coordinates?: Array<{ x: number; y: number; level?: number }>;



  constraintId?: string;

  attempt: number;

  resolved: boolean;

  simulated?: boolean;

}



The diagnostics panel must support:



- Severity filters

- Stage filters

- Code filter/search

- Unresolved-only toggle

- Sort by severity/stage/code

- Click diagnostic to focus relevant graph node, room, edge, asset, or tile

- Copy diagnostic

- Export diagnostics

- Clear client-only diagnostics

- Error/warning/info counts

- Timing bars per stage

- Quality-score display

- Attempt history



Clearly mark placeholder diagnostic values as `SIMULATED` until a real implementation supplies them.



INSPECTOR LAYOUT



Use a desktop developer-workbench layout:



- Left: collapsible parameter/configuration panel

- Center: Three.js dungeon viewport

- Right: collapsible inspector panel

- Bottom: optional diagnostics/timeline drawer

- Top: environment, seed, generation state, checksum, and main actions



On small screens:



- Panels become drawers or tabs

- Viewport remains usable

- Controls remain keyboard accessible

- No mandatory hover-only interactions



RIGHT INSPECTOR TABS



Create these tabs:



1. Graph

2. Spatial

3. Gameplay

4. Assets

5. Resolved Dungeon

6. Diagnostics

7. Tests

8. Performance



GRAPH INSPECTOR



Display and independently toggle:



- Primary trunk

- Secondary trunks

- Divergence nodes

- Reconvergence nodes

- Immediate loops

- Conditional loops

- Secret branches

- Secret loops

- Dead ends

- Critical path

- Initial critical path

- Final critical path after shortcuts

- Depth layers

- Room degrees

- Node functions

- Node categories

- Node scales

- Branch IDs

- Edge direction

- Edge state

- Edge criticality

- Start

- Primary finish

- Structural exits

- Articulation points

- Invalid degrees

- Forbidden adjacencies



Required graph interaction:



- Hover node for tooltip

- Click node to select it

- Click edge to inspect it

- Focus selected node in viewport

- Filter by function, scale, degree, depth, or branch

- Show graph metrics

- Show node/edge table

- Highlight shortest route

- Highlight selected branch

- Highlight diagnostic targets



Use stable colors and line styles:



- Primary trunk: bright white or gold

- Secondary trunk: blue

- Immediate loop: cyan solid

- Conditional loop: orange dashed

- Secret: violet dotted

- Critical path: red

- Invalid: magenta

- Start: teal

- Finish/boss: crimson



Do not rely on color alone. Use different line styles, thicknesses, glyphs, and labels.



SPATIAL INSPECTOR



Display and independently toggle:



- Room footprints

- Grid anchors

- Graph grid

- Tile grid

- Corridor paths

- Corridor centerlines

- Doorways

- Wall boundaries

- Room padding

- Door padding

- Overlaps

- Clearance fields

- Navigation regions

- Non-walkable regions

- Player traversal field

- Monster traversal field

- Boss clearance

- Unauthorized contacts

- Corridor crossings

- Junction promotions

- Room ownership

- Distance field

- Area bounds



Required interaction:



- Inspect a tile

- Display tile coordinates

- Display room owner

- Display tile type

- Display navigation flags

- Display clearance value

- Display distance value

- Display collision and unauthorized-contact flags

- Focus selected room

- Show room footprint and reserved regions

- Highlight overlap and padding violations



Clearance and distance fields need selectable heatmaps with legends.



GAMEPLAY INSPECTOR



Display and independently toggle:



- Primary player start

- Late-join starts

- Checkpoints

- Monster spawns

- Monster families

- Monster roles

- Encounter regions

- Encounter budgets

- Budget utilization

- Reinforcement sockets

- Patrol paths

- Hazards

- Hazard telegraphs

- Hazard safe regions

- Objectives

- Objective dependency edges

- Boss

- Boss arena

- Boss clearance

- Boss phase sockets

- Event regions

- Reward locations

- Treasure rooms

- Shrines

- Side bosses

- Interaction points

- Room-lock boundaries



Required interaction:



- Filter by content category

- Select encounter and view composition

- Select spawn and view monster definition

- Select hazard and view counterplay data

- Select objective and view dependency chain

- Select boss and view arena requirements

- Display room budget calculations

- Highlight placements marked simulated or placeholder



ASSET INSPECTOR



Display:



- Asset IDs

- Asset category

- Authored asset URI/reference

- Procedural fallback ID

- Resolution status

- Missing assets

- Fallback usage

- Collision footprints

- Navigation footprints

- Material groups

- Texture groups

- LOD definitions

- Active LOD

- Draw-call groups

- Instance counts

- Triangle estimates

- Texture-memory estimates

- Geometry-memory estimates

- Quality-tier support

- Unused loaded assets

- Duplicate material candidates



Required asset states:



- AUTHORED

- FALLBACK

- MISSING

- PLACEHOLDER

- INVALID



Required asset controls:



- Show only missing

- Show only fallbacks

- Show only invalid

- Force all fallbacks

- Compare authored/fallback footprint

- Highlight asset instances in viewport

- Sort by estimated memory

- Sort by instance count

- Export asset-usage report



Use procedural fallback assets for the initial utility. Mark them visibly as fallbacks without making the dungeon unreadable.



CONTROL-PANEL OVERLAYS



Every overlay must have an independent checkbox.



Also provide:



- Enable all overlays

- Disable all overlays

- Reset overlay defaults

- Solo selected overlay

- Graph preset

- Spatial preset

- Gameplay preset

- Asset preset

- Validation preset

- Screenshot preset



Persist purely local UI preferences in `localStorage`, but do not let them affect canonical generation.



LIVE STATISTICS



Display at minimum:



Graph:



- Nodes

- Edges

- Primary-trunk nodes

- Secondary trunks

- Branches

- Divergences

- Reconvergences

- Immediate loops

- Conditional loops

- Secrets

- Dead ends

- Articulation points

- Cyclomatic number

- Critical-path length

- Maximum depth

- Average degree

- Quality score



Spatial:



- Grid width/height

- Room area

- Floor tiles

- Corridor tiles

- Wall boundaries

- Doorways

- Overlaps

- Padding violations

- Unauthorized contacts

- Reachable percentage

- Minimum critical-path clearance



Gameplay:



- Player starts

- Encounters

- Monsters

- Encounter budget

- Budget utilization

- Reinforcement sockets

- Hazards

- Objectives

- Events

- Rewards

- Side bosses

- Main bosses



Assets/rendering:



- Resolved assets

- Missing assets

- Fallback assets

- Material groups

- Texture-memory estimate

- Geometry-memory estimate

- Draw calls

- Triangles

- Instanced objects

- Dynamic lights

- Particles

- FPS

- Frame time



Generation:



- Attempt count

- Stage timings

- Total generation time

- Validation time

- Canonicalization time

- Checksum time

- Warning count

- Error count

- Final seed/attempt seed

- Canonical checksum



LEGENDS



Provide dynamic legends for:



- Room functions

- Node scales

- Node categories

- Graph edge types

- Edge states

- Depth heatmap

- Clearance heatmap

- Navigation regions

- Gameplay placements

- Asset states

- Diagnostic severity



Legends must update when overlays change.



STAGED BUILD ANIMATION



Implement optional animation controlled by `animateBuild`.



Stages:



1. Candidate rooms scatter

2. Rooms separate

3. Graph candidates appear

4. Primary trunk resolves

5. Secondary trunks resolve

6. Divergences and reconvergences appear

7. Immediate, conditional, and secret edges appear

8. Room functions are assigned

9. Spatial embedding settles

10. Corridors carve

11. Floors flood outward using the distance field

12. Walls rise

13. Doors and arches appear

14. Structural assets rise

15. Props pop

16. Gameplay markers appear

17. Validation overlays flash/highlight

18. Checksum and completion state appear



Required animation controls:



- Play

- Pause

- Restart

- Skip

- Previous stage

- Next stage

- Playback speed

- Timeline scrubber

- Current stage name

- Stage timing

- Reduced-motion behavior



When `prefers-reduced-motion` is active:



- Default `animateBuild` to false

- Preserve manual stage stepping

- Avoid rapid flashing



The animation visualizes already-generated stage snapshots. Animation timing must not affect generation output.



GENERATION STAGE SNAPSHOTS



Store lightweight stage snapshots or diagnostic views sufficient to replay:



- Candidate room anchors

- Separated room anchors

- Candidate edges

- Accepted graph

- Room assignments

- Embedded footprints

- Routed corridors

- Rasterized tiles

- Construction placements

- Gameplay placements

- Final validation



Do not duplicate full large typed arrays unnecessarily.



IMPORT/EXPORT



Implement:



- Import configuration JSON

- Export configuration JSON

- Import predefined graph template JSON

- Export current graph as template JSON

- Import resolved dungeon JSON

- Export resolved dungeon JSON

- Export canonical JSON

- Export diagnostics JSON

- Export asset report JSON

- Export test report JSON

- Copy checksum

- Copy seed

- Download viewport PNG

- Download minimap PNG if implemented



Validate imported data and display actionable errors. Never execute imported content.



TEST HARNESS



Include an in-page test tab and “Run Tests” action.



Tests:



- Same seed/config produces identical checksum three times

- Different seeds normally produce different checksums

- Named RNG streams are stable

- Graph is connected

- Required rooms reachable

- At least one immediate loop

- Dead-end minimum satisfied

- Every branch has a purpose

- Reconvergences occur deeper than divergences

- Node degrees are legal

- Adjacencies are legal

- No room overlaps

- Corridor routes exist

- No unauthorized spatial contacts

- Tile reachability is 100% for required walkable tiles

- Player-start clearance passes

- Objective reachability passes

- Boss arena clearance passes

- No gameplay placement overlaps blocked geometry

- Every asset resolves or has a fallback

- Dynamic-light budget passes

- Draw-call budget reports pass/fail

- Serialization is canonical

- Imported/exported configuration round-trips

- ResolvedDungeon export/import round-trips



Show:



- Pass/fail

- Duration

- Error details

- Relevant diagnostic targets

- Copy/export report



Add a bounded multi-seed test:



- User-configurable seed count

- Default 100

- Maximum appropriate for the browser

- Progress indicator

- Cancel button

- Failure-seed list

- Aggregate distributions

- Run in time-sliced batches so the UI remains responsive

- Use a Web Worker created from an inline Blob where practical



DETERMINISM



Use seeded RNG only.



Create named RNG streams:



- graph

- roomAssignment

- spatialEmbedding

- corridorRouting

- construction

- encounters

- hazards

- objectives

- bosses

- props

- naming



Ban generation decisions based on:



- `Math.random`

- `Date.now`

- frame time

- unordered iteration

- GPU results

- animation timing



The dice button may use browser cryptographic randomness only to select a new root seed. Once selected, that seed fully determines authoritative output.



Use explicit stable tie-breaking and stable sorting.



DIAGNOSTIC PLACEHOLDERS



Some Blueprint systems may not yet exist.



When a system is absent:



- Do not fabricate production behavior.

- Produce clearly marked simulated diagnostic fixtures only when needed to demonstrate the inspector.

- Add `simulated: true`.

- Label the UI with `SIMULATED`.

- Keep simulated data out of the canonical authoritative checksum unless the demo mode explicitly includes it.

- Provide a control to disable all simulated content.

- Show “Not implemented” instead of fake success when no fixture is appropriate.



SCENE BUILDER



Use an isometric orthographic camera by default.



Render:



- Floors

- Edge-based walls

- Doorways

- Procedural fallback doors

- Corridors

- Simple columns/arches

- Placeholder props

- Player-start markers

- Monster markers

- Hazard markers

- Objective markers

- Boss-clearance region

- Reward markers

- Debug overlays



Use:



- InstancedMesh for repeated geometry

- Shared materials

- No individual mesh per tile

- No shadowed point lights

- At most the configured dynamic-light budget

- Frustum culling where appropriate

- Reliable disposal on regeneration



Keep debug overlays separate from production geometry.



ACCESSIBILITY



- Semantic buttons, labels, tabs, and form controls

- Keyboard navigation

- Visible focus states

- ARIA labels

- Sufficient contrast

- No color-only status communication

- Reduced-motion support

- Tooltips available by focus, not hover only

- Resizable or collapsible panels

- Text-size-friendly layout



ERROR HANDLING



Do not throw raw errors into the page.



Provide:



- Visible generation-failure banner

- Diagnostic issue

- Stage name

- Attempt count

- Constraint code

- Suggested corrective parameter

- Copy error details

- Return to last valid dungeon



Never display a known-invalid dungeon as valid.



If generation fails:



- Keep the last valid dungeon visible

- Show failed candidate overlays only when explicitly requested

- Do not silently change environment, game type, or difficulty

- Do not repair disconnected graphs with teleporters



REFERENCE-PAGE CHANGES



The attached `index.html` currently:



- Uses external CSS

- Uses an external `src/main.js`

- Contains old prototype themes

- Exposes only a few controls

- Has one general graph toggle

- Has a compact fixed telemetry panel



For this utility:



- Inline the CSS and JavaScript

- Replace old themes with the environment registry

- Expand controls using the schema-driven system

- Split graph/spatial/gameplay/asset inspection into dedicated tabs

- Preserve the strong dark visual design

- Preserve compact live statistics

- Preserve useful camera and keyboard interactions

- Add complete diagnostics and import/export support



KEYBOARD SHORTCUTS



At minimum:



- R: regenerate

- Shift+R: random seed and regenerate

- Space: pause/resume build

- Escape: skip build or close active dialog

- Left/Right: previous/next build stage when paused

- G: graph inspector preset

- S: spatial inspector preset

- Y: gameplay inspector preset

- A: asset inspector preset

- D: diagnostics panel

- F: focus selected object

- 0: reset camera

- Ctrl/Cmd+E: export configuration

- Ctrl/Cmd+I: import configuration

- ?: show shortcut help



Do not intercept shortcuts while the user is typing in an input or editor.



QUALITY REQUIREMENTS



- No console errors during normal use.

- No unresolved references.

- No hidden nondeterminism.

- No per-tile Mesh objects.

- No event-listener leaks during regeneration.

- No retained dungeon-specific GPU resources after disposal.

- UI remains responsive during multi-seed testing.

- Invalid inputs show inline validation.

- Controls and data viewers remain usable with large configurations.

- The current dungeon checksum is visible at all times.

- Every overlay listed in this prompt is represented by an independent control.

- Every top-level ResolvedDungeon and GenerationDiagnostics section is inspectable.

- Future environments can extend controls and inspectors through registries without rewriting the core UI.



SELF-VERIFICATION



Before finishing:



1. Open the page through a static HTTP server.

2. Generate at least three seeds.

3. Run the in-page test suite.

4. Verify repeated-seed checksums.

5. Exercise every inspector tab.

6. Toggle every overlay category.

7. Import/export a configuration.

8. Export and reimport a ResolvedDungeon.

9. Force procedural fallbacks.

10. Trigger a controlled generation failure.

11. Verify the last valid dungeon remains visible.

12. Regenerate repeatedly and check for resource growth.

13. Test reduced-motion behavior.

14. Test desktop and narrow responsive layouts.

15. Report any intentionally stubbed features in an in-page “Implementation Status” section.



FINAL RESPONSE



Return:



- The completed `dungeon-generator-workbench.html`

- A concise feature summary

- How to serve it locally

- Implemented versus simulated systems

- Test results

- Known limitations

- Confirmation that the old prototype environment themes were not retainedYou are a senior procedural-generation, developer-tooling, Three.js, and browser-performance engineer.



Build a single-file diagnostic application for the online Web Dungeon Generator.



This is a utility and test workbench, not the final production dungeon generator. Its purpose is to visualize, inspect, test, configure, import, export, and diagnose generator implementations as the environment Blueprints are completed.



REFERENCE FILE



First inspect the attached/reference `index.html`. If it's not attached check out the repository.



Preserve and improve its useful interaction patterns:



- Dark gothic developer-tool aesthetic

- Collapsible control panel

- Seed control and dice button

- Forge/regenerate action

- Generation-pipeline indicator

- Overlay toggles

- Room-function legend

- Live generation and rendering statistics

- Drag to pan

- Wheel to zoom

- Shift-drag or right-drag to orbit

- Keyboard shortcuts

- Responsive presentation



Do not retain its prototype environments:



- ancient

- molten

- frost

- grim

- verdant



The initial environment is:



- Catacombs



Reserve disabled/placeholder registry entries for:



- Garden Maze

- Dark Tower

- Hell’s Canyon

- Future environments



DELIVERABLE



Produce exactly one source file:



- `dungeon-generator-workbench.html`



The HTML file must contain:



- All HTML

- All CSS

- All utility JavaScript

- Generator module

- Validation module

- Diagnostics module

- Scene builder

- Inspectors

- Control panel

- Legends

- Import/export tools

- Test harness

- Default Catacombs profile

- Procedural fallback assets



Do not create separate CSS, JavaScript, JSON, image, shader, or configuration files.



No build step and no framework.



The only permitted external runtime dependency is one pinned Three.js ESM import from a stable CDN. Put the import URL in one obvious constant/comment so it can later be replaced by a bundled or locally hosted version.



If the existing project already provides an approved Three.js version, use that version. Otherwise use a pinned modern Three.js version compatible with WebGL2.



The page must run from a basic static HTTP server. Detect `file://` loading and show a clear message explaining that an HTTP server is required for module loading.



PRIMARY PURPOSE



The workbench must let developers:



1. Configure every exposed generator parameter.

2. Generate a deterministic Catacombs dungeon.

3. Inspect every generation stage.

4. Inspect the abstract graph.

5. Inspect spatial embedding.

6. Inspect gameplay placements.

7. Inspect asset resolution and fallbacks.

8. View all generation diagnostics.

9. Import and export configurations, graph templates, resolved dungeons, and diagnostics.

10. Compare output checksums.

11. Test future environment definitions without redesigning the UI.

12. Distinguish implemented data from placeholder/simulated diagnostic data.



ARCHITECTURAL RULES



Separate the following modules inside the HTML:



1. Type/schema documentation

2. Stable utilities and canonical serialization

3. Seeded RNG streams

4. Configuration registry

5. Environment registry

6. Graph generator

7. Room assignment

8. Spatial embedding

9. Corridor routing and rasterization

10. Gameplay placement

11. Asset registry and fallback resolution

12. Validation and diagnostics

13. ResolvedDungeon assembly

14. Three.js scene builder

15. Overlay/inspector renderer

16. Control-panel builder

17. Import/export functions

18. Test harness

19. Application bootstrap and animation loop



Use clearly labeled source sections.



GENERATOR/PRESENTATION SEPARATION



The generator must not create Three.js objects.



The generator returns typed arrays and plain data objects only.



The scene builder consumes a `ResolvedDungeon` and owns:



- Three.js scene objects

- Geometries

- Materials

- textures

- Instanced meshes

- Lights

- Effects

- Overlay objects

- GPU resource disposal



Implement:



- `generateDungeon(config): GenerationResult`

- `validateDungeon(dungeon): ValidationResult`

- `buildDungeonScene(dungeon, viewOptions): SceneHandle`

- `disposeDungeonScene(sceneHandle): void`

- `canonicalizeDungeon(dungeon): string`

- `checksumDungeon(dungeon): Promise<string>`



The scene handle must expose a reliable `dispose()` method.



INITIAL GRAPH MODEL



Implement the current Catacombs Graph Layout as a diagnostic reference generator.



The graph is a layered braided graph:



- One primary trunk

- Zero or more secondary trunks

- Divergence nodes

- Forward reconvergence nodes

- Immediate loops created by divergent routes that reconnect

- Conditional loops represented by initially closed shortcut edges

- Secret branches and secret loops

- Intentional dead ends

- Critical path from start to primary finish

- Forward depth layers

- Bidirectional normal traversal

- No arbitrary lateral cross-links

- No undeclared spatial contacts



Use separate representations for:



1. World/area graph

2. Room graph

3. Tile-navigation grid

4. Rendered Three.js scene



A grid tile is not the same thing as a room-graph node.



CONFIGURATION SYSTEM



Do not hard-code the entire control panel manually.



Create a schema-driven configuration registry.



Each configurable field declares:



- Stable ID

- Display label

- Group

- Description/tooltip

- Data type

- Input type

- Default

- Minimum

- Maximum

- Step

- Allowed options

- Whether regeneration is required

- Whether it is advanced

- Whether it is currently implemented

- Environment compatibility



Example:



{

  id: "graph.roomCount",

  label: "Room Count",

  group: "Graph",

  description: "Target physical room-node count.",

  type: "integer",

  input: "range-number",

  default: 42,

  min: 12,

  max: 80,

  step: 1,

  requiresRegeneration: true,

  implemented: true

}



Generate appropriate UI controls:



- Range sliders with synchronized number inputs

- Checkboxes

- Radio groups

- Select boxes

- Multi-select controls

- Color inputs

- Text inputs

- Number inputs

- Seed input

- Buttons

- Editable JSON text areas for advanced structures



Every writable parameter must have:



- Label

- Current value

- Reset-to-default control

- Tooltip or inline description

- Validation feedback



Add actions:



- Reset current section

- Reset all

- Copy configuration

- Export configuration

- Import configuration

- Forge dungeon

- Regenerate current stage where supported

- Randomize seed

- Previous seed

- Next seed



CONTROL GROUPS



At minimum expose these collapsible groups.



A. Session



- Seed

- Generator version

- Generation mode:

  - procedural

  - predefined

  - hybrid

- Environment

- Sub-biome

- Modifiers

- Visual layers

- Game type

- Difficulty

- Player count

- Quality tier

- animateBuild



B. Graph



- Dungeon size profile

- Target room count

- Candidate multiplier

- Depth-layer count

- Primary-trunk length

- Secondary-trunk count

- Branch count

- Dead-end count/range

- Immediate-loop count/range

- Immediate-loop chance

- Conditional-loop count/range

- Conditional-loop chance

- Secret count/range

- Secret chance

- Divergence count/range

- Reconvergence count/range

- Minimum branch length

- Maximum branch length

- Critical-path minimum

- Critical-path maximum

- Boss minimum normalized depth

- Minimum node degree

- Maximum node degree

- Maximum graph attempts

- Candidate graph count

- Minimum graph-quality score

- Allow one-way edges

- Allow conditional shortcuts

- Allow secret loops



C. Rooms



- Small-room weight

- Medium-room weight

- Large-room weight

- Landmark-room weight

- Room-shape weights

- Minimum/maximum room width

- Minimum/maximum room height

- Room padding

- Door padding

- Large-room requirement

- Landmark requirement

- Archetype weights

- Room-function weights

- Required room archetypes

- Maximum consecutive combat rooms

- Release-room frequency



D. Spatial embedding



- Grid width

- Grid height

- Graph-grid scale

- Tile scale

- Forward-axis spacing

- Branch-lane spacing

- Scatter radius

- Separation iterations

- Spatial attempts

- Corridor width by edge role

- Maximum corridor length

- Maximum corridor bends

- Corridor-routing mode

- Allow corridor crossings

- Promote crossings to junctions

- Minimum doorway width

- Minimum player clearance

- Eight-player staging clearance



E. Construction and decoration



- Decoration density

- Prop-cluster density

- Debris density

- Decal density

- Torch spacing

- Light density

- Dynamic-light budget

- Particle budget

- Floor variation

- Wall-height variation

- Damage-state frequency

- Secret-clue visibility

- Use authored assets

- Permit procedural fallbacks

- Show fallback markers



F. Gameplay



- Enable gameplay placement

- Encounter-density multiplier

- Encounter-budget multiplier

- Elite frequency

- Monster-family selection

- Hazard density

- Event frequency

- Objective count

- Side-boss count

- Reinforcement-wave count

- Player-start clearance

- Monster-start separation

- Boss-clearance profile

- Reward frequency

- Game-type transformation

- Player-count scaling

- Difficulty scaling



G. Validation



- Validate graph reachability

- Validate tile reachability

- Validate loop counts

- Validate dead ends

- Validate branch purpose

- Validate forward reconvergence

- Validate room degrees

- Validate adjacency

- Validate overlaps

- Validate padding

- Validate corridor authorization

- Validate navigation clearance

- Validate objectives

- Validate boss arena

- Validate assets

- Validate performance

- Treat warnings as errors

- Maximum generation attempts



H. Rendering



- Orthographic/perspective diagnostic camera

- Camera yaw

- Camera pitch

- Camera distance

- Zoom

- Floor visibility

- Wall visibility

- Ceiling visibility

- Prop visibility

- Light visibility

- Particle visibility

- Spawn-marker visibility

- Hazard visibility

- Objective visibility

- Post-processing

- Fog

- Shadows

- Isometric wall cutaway

- Low/medium/high quality profile



I. Animation



- Animate build

- Playback speed

- Pause

- Resume

- Step backward

- Step forward

- Restart animation

- Skip to completed dungeon

- Scatter duration

- Separation duration

- Graph duration

- Flood duration

- Wall-rise duration

- Prop-pop duration

- Freeze live effects while paused



FUTURE ENVIRONMENT SUPPORT



Build an environment registry:



{

  id,

  displayName,

  version,

  status,

  supportedLayouts,

  supportedGameTypes,

  configSchemaExtensions,

  inspectorExtensions,

  palette,

  assetNamespace

}



Initial registry:



- Catacombs:

  - enabled

  - implemented

  - layout: graph

- Garden Maze:

  - disabled

  - status: planned

  - layout: maze

- Dark Tower:

  - disabled

  - status: planned

  - layout: tower

- Hell’s Canyon:

  - disabled

  - status: planned

  - layout: tree-linear



The control panel must derive environment choices from this registry.



Disabled environments must be visible and labeled “Planned,” but must not pretend to generate valid content.



Do not restore the old prototype environments.



RESOLVED DUNGEON CONTRACT



Implement and document an expandable `ResolvedDungeon` contract containing at minimum:



interface ResolvedDungeon {

  identity: {

    dungeonId: string;

    seed: number;

    name: string;

    schemaVersion: string;

    generatorVersion: string;

    generationMode: "procedural" | "predefined" | "hybrid";

    layoutProfileId: string;

    environmentProfileId: string;

    environmentVersion: string;

    subBiomeId?: string;

    modifierIds: string[];

    visualLayerIds: string[];

  };



  config: DungeonConfig;



  worldGraph: WorldGraph;

  areaGraphs: AreaGraph[];

  roomGraph: RoomGraph;



  rooms: ResolvedRoom[];

  edges: ResolvedEdge[];

  branches: ResolvedBranch[];

  depthLayers: DepthLayer[];



  starts: PlayerStart[];

  completion: CompletionDefinition;

  objectives: ResolvedObjective[];



  grid: {

    width: number;

    height: number;

    tileTypes: Uint8Array;

    roomIds: Int16Array;

    corridorMask: Uint8Array;

    doorwayMask: Uint8Array;

    navigationMask: Uint8Array;

    clearanceField: Float32Array;

    distanceField: Int32Array;

    unauthorizedContactMask: Uint8Array;

  };



  construction: ConstructionPlacement[];

  gameplay: GameplayPlacement[];



  encounters: ResolvedEncounter[];

  monsters: ResolvedMonsterSpawn[];

  reinforcementSockets: ReinforcementSocket[];

  hazards: ResolvedHazard[];

  events: ResolvedEvent[];

  rewards: ResolvedReward[];

  bosses: ResolvedBoss[];



  assets: ResolvedAssetUsage[];

  materialGroups: MaterialGroupSummary[];

  drawCallGroups: DrawCallGroupSummary[];



  metrics: DungeonMetrics;

  validation: ValidationResult;

  diagnostics: GenerationDiagnostics;



  canonicalChecksum: string;

}



All top-level `ResolvedDungeon` sections must be visible in the utility.



Provide:



- Expand/collapse tree viewer

- Search/filter

- Copy selected value

- Copy JSON

- Export JSON

- Summary view

- Raw canonical-data view



Typed arrays must be presented as:



- Type

- Length

- Minimum

- Maximum

- Nonzero count

- Compact preview

- Optional full export



Do not dump thousands of values into the DOM by default.



GENERATION DIAGNOSTICS CONTRACT



Implement:



interface GenerationDiagnostics {

  valid: boolean;

  qualityScore: number;

  attemptCount: number;

  finalAttemptSeed: number;



  timings: Record<string, number>;



  issues: GenerationDiagnostic[];



  stageSummaries: {

    scatter: StageDiagnosticSummary;

    separation: StageDiagnosticSummary;

    graph: StageDiagnosticSummary;

    roomAssignment: StageDiagnosticSummary;

    spatialEmbedding: StageDiagnosticSummary;

    corridorRouting: StageDiagnosticSummary;

    rasterization: StageDiagnosticSummary;

    construction: StageDiagnosticSummary;

    gameplay: StageDiagnosticSummary;

    assetResolution: StageDiagnosticSummary;

    validation: StageDiagnosticSummary;

    checksum: StageDiagnosticSummary;

  };



  graphMetrics: GraphDiagnosticMetrics;

  spatialMetrics: SpatialDiagnosticMetrics;

  gameplayMetrics: GameplayDiagnosticMetrics;

  assetMetrics: AssetDiagnosticMetrics;

  performanceMetrics: PerformanceDiagnosticMetrics;

}



interface GenerationDiagnostic {

  id: string;

  severity: "info" | "warning" | "error";

  stage: string;

  code: string;

  message: string;



  graphId?: string;

  nodeIds?: string[];

  edgeIds?: string[];

  roomIds?: string[];

  assetIds?: string[];

  coordinates?: Array<{ x: number; y: number; level?: number }>;



  constraintId?: string;

  attempt: number;

  resolved: boolean;

  simulated?: boolean;

}



The diagnostics panel must support:



- Severity filters

- Stage filters

- Code filter/search

- Unresolved-only toggle

- Sort by severity/stage/code

- Click diagnostic to focus relevant graph node, room, edge, asset, or tile

- Copy diagnostic

- Export diagnostics

- Clear client-only diagnostics

- Error/warning/info counts

- Timing bars per stage

- Quality-score display

- Attempt history



Clearly mark placeholder diagnostic values as `SIMULATED` until a real implementation supplies them.



INSPECTOR LAYOUT



Use a desktop developer-workbench layout:



- Left: collapsible parameter/configuration panel

- Center: Three.js dungeon viewport

- Right: collapsible inspector panel

- Bottom: optional diagnostics/timeline drawer

- Top: environment, seed, generation state, checksum, and main actions



On small screens:



- Panels become drawers or tabs

- Viewport remains usable

- Controls remain keyboard accessible

- No mandatory hover-only interactions



RIGHT INSPECTOR TABS



Create these tabs:



1. Graph

2. Spatial

3. Gameplay

4. Assets

5. Resolved Dungeon

6. Diagnostics

7. Tests

8. Performance



GRAPH INSPECTOR



Display and independently toggle:



- Primary trunk

- Secondary trunks

- Divergence nodes

- Reconvergence nodes

- Immediate loops

- Conditional loops

- Secret branches

- Secret loops

- Dead ends

- Critical path

- Initial critical path

- Final critical path after shortcuts

- Depth layers

- Room degrees

- Node functions

- Node categories

- Node scales

- Branch IDs

- Edge direction

- Edge state

- Edge criticality

- Start

- Primary finish

- Structural exits

- Articulation points

- Invalid degrees

- Forbidden adjacencies



Required graph interaction:



- Hover node for tooltip

- Click node to select it

- Click edge to inspect it

- Focus selected node in viewport

- Filter by function, scale, degree, depth, or branch

- Show graph metrics

- Show node/edge table

- Highlight shortest route

- Highlight selected branch

- Highlight diagnostic targets



Use stable colors and line styles:



- Primary trunk: bright white or gold

- Secondary trunk: blue

- Immediate loop: cyan solid

- Conditional loop: orange dashed

- Secret: violet dotted

- Critical path: red

- Invalid: magenta

- Start: teal

- Finish/boss: crimson



Do not rely on color alone. Use different line styles, thicknesses, glyphs, and labels.



SPATIAL INSPECTOR



Display and independently toggle:



- Room footprints

- Grid anchors

- Graph grid

- Tile grid

- Corridor paths

- Corridor centerlines

- Doorways

- Wall boundaries

- Room padding

- Door padding

- Overlaps

- Clearance fields

- Navigation regions

- Non-walkable regions

- Player traversal field

- Monster traversal field

- Boss clearance

- Unauthorized contacts

- Corridor crossings

- Junction promotions

- Room ownership

- Distance field

- Area bounds



Required interaction:



- Inspect a tile

- Display tile coordinates

- Display room owner

- Display tile type

- Display navigation flags

- Display clearance value

- Display distance value

- Display collision and unauthorized-contact flags

- Focus selected room

- Show room footprint and reserved regions

- Highlight overlap and padding violations



Clearance and distance fields need selectable heatmaps with legends.



GAMEPLAY INSPECTOR



Display and independently toggle:



- Primary player start

- Late-join starts

- Checkpoints

- Monster spawns

- Monster families

- Monster roles

- Encounter regions

- Encounter budgets

- Budget utilization

- Reinforcement sockets

- Patrol paths

- Hazards

- Hazard telegraphs

- Hazard safe regions

- Objectives

- Objective dependency edges

- Boss

- Boss arena

- Boss clearance

- Boss phase sockets

- Event regions

- Reward locations

- Treasure rooms

- Shrines

- Side bosses

- Interaction points

- Room-lock boundaries



Required interaction:



- Filter by content category

- Select encounter and view composition

- Select spawn and view monster definition

- Select hazard and view counterplay data

- Select objective and view dependency chain

- Select boss and view arena requirements

- Display room budget calculations

- Highlight placements marked simulated or placeholder



ASSET INSPECTOR



Display:



- Asset IDs

- Asset category

- Authored asset URI/reference

- Procedural fallback ID

- Resolution status

- Missing assets

- Fallback usage

- Collision footprints

- Navigation footprints

- Material groups

- Texture groups

- LOD definitions

- Active LOD

- Draw-call groups

- Instance counts

- Triangle estimates

- Texture-memory estimates

- Geometry-memory estimates

- Quality-tier support

- Unused loaded assets

- Duplicate material candidates



Required asset states:



- AUTHORED

- FALLBACK

- MISSING

- PLACEHOLDER

- INVALID



Required asset controls:



- Show only missing

- Show only fallbacks

- Show only invalid

- Force all fallbacks

- Compare authored/fallback footprint

- Highlight asset instances in viewport

- Sort by estimated memory

- Sort by instance count

- Export asset-usage report



Use procedural fallback assets for the initial utility. Mark them visibly as fallbacks without making the dungeon unreadable.



CONTROL-PANEL OVERLAYS



Every overlay must have an independent checkbox.



Also provide:



- Enable all overlays

- Disable all overlays

- Reset overlay defaults

- Solo selected overlay

- Graph preset

- Spatial preset

- Gameplay preset

- Asset preset

- Validation preset

- Screenshot preset



Persist purely local UI preferences in `localStorage`, but do not let them affect canonical generation.



LIVE STATISTICS



Display at minimum:



Graph:



- Nodes

- Edges

- Primary-trunk nodes

- Secondary trunks

- Branches

- Divergences

- Reconvergences

- Immediate loops

- Conditional loops

- Secrets

- Dead ends

- Articulation points

- Cyclomatic number

- Critical-path length

- Maximum depth

- Average degree

- Quality score



Spatial:



- Grid width/height

- Room area

- Floor tiles

- Corridor tiles

- Wall boundaries

- Doorways

- Overlaps

- Padding violations

- Unauthorized contacts

- Reachable percentage

- Minimum critical-path clearance



Gameplay:



- Player starts

- Encounters

- Monsters

- Encounter budget

- Budget utilization

- Reinforcement sockets

- Hazards

- Objectives

- Events

- Rewards

- Side bosses

- Main bosses



Assets/rendering:



- Resolved assets

- Missing assets

- Fallback assets

- Material groups

- Texture-memory estimate

- Geometry-memory estimate

- Draw calls

- Triangles

- Instanced objects

- Dynamic lights

- Particles

- FPS

- Frame time



Generation:



- Attempt count

- Stage timings

- Total generation time

- Validation time

- Canonicalization time

- Checksum time

- Warning count

- Error count

- Final seed/attempt seed

- Canonical checksum



LEGENDS



Provide dynamic legends for:



- Room functions

- Node scales

- Node categories

- Graph edge types

- Edge states

- Depth heatmap

- Clearance heatmap

- Navigation regions

- Gameplay placements

- Asset states

- Diagnostic severity



Legends must update when overlays change.



STAGED BUILD ANIMATION



Implement optional animation controlled by `animateBuild`.



Stages:



1. Candidate rooms scatter

2. Rooms separate

3. Graph candidates appear

4. Primary trunk resolves

5. Secondary trunks resolve

6. Divergences and reconvergences appear

7. Immediate, conditional, and secret edges appear

8. Room functions are assigned

9. Spatial embedding settles

10. Corridors carve

11. Floors flood outward using the distance field

12. Walls rise

13. Doors and arches appear

14. Structural assets rise

15. Props pop

16. Gameplay markers appear

17. Validation overlays flash/highlight

18. Checksum and completion state appear



Required animation controls:



- Play

- Pause

- Restart

- Skip

- Previous stage

- Next stage

- Playback speed

- Timeline scrubber

- Current stage name

- Stage timing

- Reduced-motion behavior



When `prefers-reduced-motion` is active:



- Default `animateBuild` to false

- Preserve manual stage stepping

- Avoid rapid flashing



The animation visualizes already-generated stage snapshots. Animation timing must not affect generation output.



GENERATION STAGE SNAPSHOTS



Store lightweight stage snapshots or diagnostic views sufficient to replay:



- Candidate room anchors

- Separated room anchors

- Candidate edges

- Accepted graph

- Room assignments

- Embedded footprints

- Routed corridors

- Rasterized tiles

- Construction placements

- Gameplay placements

- Final validation



Do not duplicate full large typed arrays unnecessarily.



IMPORT/EXPORT



Implement:



- Import configuration JSON

- Export configuration JSON

- Import predefined graph template JSON

- Export current graph as template JSON

- Import resolved dungeon JSON

- Export resolved dungeon JSON

- Export canonical JSON

- Export diagnostics JSON

- Export asset report JSON

- Export test report JSON

- Copy checksum

- Copy seed

- Download viewport PNG

- Download minimap PNG if implemented



Validate imported data and display actionable errors. Never execute imported content.



TEST HARNESS



Include an in-page test tab and “Run Tests” action.



Tests:



- Same seed/config produces identical checksum three times

- Different seeds normally produce different checksums

- Named RNG streams are stable

- Graph is connected

- Required rooms reachable

- At least one immediate loop

- Dead-end minimum satisfied

- Every branch has a purpose

- Reconvergences occur deeper than divergences

- Node degrees are legal

- Adjacencies are legal

- No room overlaps

- Corridor routes exist

- No unauthorized spatial contacts

- Tile reachability is 100% for required walkable tiles

- Player-start clearance passes

- Objective reachability passes

- Boss arena clearance passes

- No gameplay placement overlaps blocked geometry

- Every asset resolves or has a fallback

- Dynamic-light budget passes

- Draw-call budget reports pass/fail

- Serialization is canonical

- Imported/exported configuration round-trips

- ResolvedDungeon export/import round-trips



Show:



- Pass/fail

- Duration

- Error details

- Relevant diagnostic targets

- Copy/export report



Add a bounded multi-seed test:



- User-configurable seed count

- Default 100

- Maximum appropriate for the browser

- Progress indicator

- Cancel button

- Failure-seed list

- Aggregate distributions

- Run in time-sliced batches so the UI remains responsive

- Use a Web Worker created from an inline Blob where practical



DETERMINISM



Use seeded RNG only.



Create named RNG streams:



- graph

- roomAssignment

- spatialEmbedding

- corridorRouting

- construction

- encounters

- hazards

- objectives

- bosses

- props

- naming



Ban generation decisions based on:



- `Math.random`

- `Date.now`

- frame time

- unordered iteration

- GPU results

- animation timing



The dice button may use browser cryptographic randomness only to select a new root seed. Once selected, that seed fully determines authoritative output.



Use explicit stable tie-breaking and stable sorting.



DIAGNOSTIC PLACEHOLDERS



Some Blueprint systems may not yet exist.



When a system is absent:



- Do not fabricate production behavior.

- Produce clearly marked simulated diagnostic fixtures only when needed to demonstrate the inspector.

- Add `simulated: true`.

- Label the UI with `SIMULATED`.

- Keep simulated data out of the canonical authoritative checksum unless the demo mode explicitly includes it.

- Provide a control to disable all simulated content.

- Show “Not implemented” instead of fake success when no fixture is appropriate.



SCENE BUILDER



Use an isometric orthographic camera by default.



Render:



- Floors

- Edge-based walls

- Doorways

- Procedural fallback doors

- Corridors

- Simple columns/arches

- Placeholder props

- Player-start markers

- Monster markers

- Hazard markers

- Objective markers

- Boss-clearance region

- Reward markers

- Debug overlays



Use:



- InstancedMesh for repeated geometry

- Shared materials

- No individual mesh per tile

- No shadowed point lights

- At most the configured dynamic-light budget

- Frustum culling where appropriate

- Reliable disposal on regeneration



Keep debug overlays separate from production geometry.



ACCESSIBILITY



- Semantic buttons, labels, tabs, and form controls

- Keyboard navigation

- Visible focus states

- ARIA labels

- Sufficient contrast

- No color-only status communication

- Reduced-motion support

- Tooltips available by focus, not hover only

- Resizable or collapsible panels

- Text-size-friendly layout



ERROR HANDLING



Do not throw raw errors into the page.



Provide:



- Visible generation-failure banner

- Diagnostic issue

- Stage name

- Attempt count

- Constraint code

- Suggested corrective parameter

- Copy error details

- Return to last valid dungeon



Never display a known-invalid dungeon as valid.



If generation fails:



- Keep the last valid dungeon visible

- Show failed candidate overlays only when explicitly requested

- Do not silently change environment, game type, or difficulty

- Do not repair disconnected graphs with teleporters



REFERENCE-PAGE CHANGES



The attached `index.html` currently:



- Uses external CSS

- Uses an external `src/main.js`

- Contains old prototype themes

- Exposes only a few controls

- Has one general graph toggle

- Has a compact fixed telemetry panel



For this utility:



- Inline the CSS and JavaScript

- Replace old themes with the environment registry

- Expand controls using the schema-driven system

- Split graph/spatial/gameplay/asset inspection into dedicated tabs

- Preserve the strong dark visual design

- Preserve compact live statistics

- Preserve useful camera and keyboard interactions

- Add complete diagnostics and import/export support



KEYBOARD SHORTCUTS



At minimum:



- R: regenerate

- Shift+R: random seed and regenerate

- Space: pause/resume build

- Escape: skip build or close active dialog

- Left/Right: previous/next build stage when paused

- G: graph inspector preset

- S: spatial inspector preset

- Y: gameplay inspector preset

- A: asset inspector preset

- D: diagnostics panel

- F: focus selected object

- 0: reset camera

- Ctrl/Cmd+E: export configuration

- Ctrl/Cmd+I: import configuration

- ?: show shortcut help



Do not intercept shortcuts while the user is typing in an input or editor.



QUALITY REQUIREMENTS



- No console errors during normal use.

- No unresolved references.

- No hidden nondeterminism.

- No per-tile Mesh objects.

- No event-listener leaks during regeneration.

- No retained dungeon-specific GPU resources after disposal.

- UI remains responsive during multi-seed testing.

- Invalid inputs show inline validation.

- Controls and data viewers remain usable with large configurations.

- The current dungeon checksum is visible at all times.

- Every overlay listed in this prompt is represented by an independent control.

- Every top-level ResolvedDungeon and GenerationDiagnostics section is inspectable.

- Future environments can extend controls and inspectors through registries without rewriting the core UI.



SELF-VERIFICATION



Before finishing:



1. Open the page through a static HTTP server.

2. Generate at least three seeds.

3. Run the in-page test suite.

4. Verify repeated-seed checksums.

5. Exercise every inspector tab.

6. Toggle every overlay category.

7. Import/export a configuration.

8. Export and reimport a ResolvedDungeon.

9. Force procedural fallbacks.

10. Trigger a controlled generation failure.

11. Verify the last valid dungeon remains visible.

12. Regenerate repeatedly and check for resource growth.

13. Test reduced-motion behavior.

14. Test desktop and narrow responsive layouts.

15. Report any intentionally stubbed features in an in-page “Implementation Status” section.



FINAL RESPONSE



Return:



- The completed `dungeon-generator-workbench.html`

- A concise feature summary

- How to serve it locally

- Implemented versus simulated systems

- Test results

- Known limitations

- Confirmation that the old prototype environment themes were not retainedYou are a senior procedural-generation, developer-tooling, Three.js, and browser-performance engineer.



Build a single-file diagnostic application for the online Web Dungeon Generator.



This is a utility and test workbench, not the final production dungeon generator. Its purpose is to visualize, inspect, test, configure, import, export, and diagnose generator implementations as the environment Blueprints are completed.



REFERENCE FILE



First inspect the attached/reference `index.html`.



Preserve and improve its useful interaction patterns:



- Dark gothic developer-tool aesthetic

- Collapsible control panel

- Seed control and dice button

- Forge/regenerate action

- Generation-pipeline indicator

- Overlay toggles

- Room-function legend

- Live generation and rendering statistics

- Drag to pan

- Wheel to zoom

- Shift-drag or right-drag to orbit

- Keyboard shortcuts

- Responsive presentation



Do not retain its prototype environments:



- ancient

- molten

- frost

- grim

- verdant



The initial environment is:



- Catacombs



Reserve disabled/placeholder registry entries for:



- Garden Maze

- Dark Tower

- Hell’s Canyon

- Future environments



DELIVERABLE



Produce exactly one source file:



- `dungeon-generator-workbench.html`



The HTML file must contain:



- All HTML

- All CSS

- All utility JavaScript

- Generator module

- Validation module

- Diagnostics module

- Scene builder

- Inspectors

- Control panel

- Legends

- Import/export tools

- Test harness

- Default Catacombs profile

- Procedural fallback assets



Do not create separate CSS, JavaScript, JSON, image, shader, or configuration files.



No build step and no framework.



The only permitted external runtime dependency is one pinned Three.js ESM import from a stable CDN. Put the import URL in one obvious constant/comment so it can later be replaced by a bundled or locally hosted version.



If the existing project already provides an approved Three.js version, use that version. Otherwise use a pinned modern Three.js version compatible with WebGL2.



The page must run from a basic static HTTP server. Detect `file://` loading and show a clear message explaining that an HTTP server is required for module loading.



PRIMARY PURPOSE



The workbench must let developers:



1. Configure every exposed generator parameter.

2. Generate a deterministic Catacombs dungeon.

3. Inspect every generation stage.

4. Inspect the abstract graph.

5. Inspect spatial embedding.

6. Inspect gameplay placements.

7. Inspect asset resolution and fallbacks.

8. View all generation diagnostics.

9. Import and export configurations, graph templates, resolved dungeons, and diagnostics.

10. Compare output checksums.

11. Test future environment definitions without redesigning the UI.

12. Distinguish implemented data from placeholder/simulated diagnostic data.



ARCHITECTURAL RULES



Separate the following modules inside the HTML:



1. Type/schema documentation

2. Stable utilities and canonical serialization

3. Seeded RNG streams

4. Configuration registry

5. Environment registry

6. Graph generator

7. Room assignment

8. Spatial embedding

9. Corridor routing and rasterization

10. Gameplay placement

11. Asset registry and fallback resolution

12. Validation and diagnostics

13. ResolvedDungeon assembly

14. Three.js scene builder

15. Overlay/inspector renderer

16. Control-panel builder

17. Import/export functions

18. Test harness

19. Application bootstrap and animation loop



Use clearly labeled source sections.



GENERATOR/PRESENTATION SEPARATION



The generator must not create Three.js objects.



The generator returns typed arrays and plain data objects only.



The scene builder consumes a `ResolvedDungeon` and owns:



- Three.js scene objects

- Geometries

- Materials

- textures

- Instanced meshes

- Lights

- Effects

- Overlay objects

- GPU resource disposal



Implement:



- `generateDungeon(config): GenerationResult`

- `validateDungeon(dungeon): ValidationResult`

- `buildDungeonScene(dungeon, viewOptions): SceneHandle`

- `disposeDungeonScene(sceneHandle): void`

- `canonicalizeDungeon(dungeon): string`

- `checksumDungeon(dungeon): Promise<string>`



The scene handle must expose a reliable `dispose()` method.



INITIAL GRAPH MODEL



Implement the current Catacombs Graph Layout as a diagnostic reference generator.



The graph is a layered braided graph:



- One primary trunk

- Zero or more secondary trunks

- Divergence nodes

- Forward reconvergence nodes

- Immediate loops created by divergent routes that reconnect

- Conditional loops represented by initially closed shortcut edges

- Secret branches and secret loops

- Intentional dead ends

- Critical path from start to primary finish

- Forward depth layers

- Bidirectional normal traversal

- No arbitrary lateral cross-links

- No undeclared spatial contacts



Use separate representations for:



1. World/area graph

2. Room graph

3. Tile-navigation grid

4. Rendered Three.js scene



A grid tile is not the same thing as a room-graph node.



CONFIGURATION SYSTEM



Do not hard-code the entire control panel manually.



Create a schema-driven configuration registry.



Each configurable field declares:



- Stable ID

- Display label

- Group

- Description/tooltip

- Data type

- Input type

- Default

- Minimum

- Maximum

- Step

- Allowed options

- Whether regeneration is required

- Whether it is advanced

- Whether it is currently implemented

- Environment compatibility



Example:



{

  id: "graph.roomCount",

  label: "Room Count",

  group: "Graph",

  description: "Target physical room-node count.",

  type: "integer",

  input: "range-number",

  default: 42,

  min: 12,

  max: 80,

  step: 1,

  requiresRegeneration: true,

  implemented: true

}



Generate appropriate UI controls:



- Range sliders with synchronized number inputs

- Checkboxes

- Radio groups

- Select boxes

- Multi-select controls

- Color inputs

- Text inputs

- Number inputs

- Seed input

- Buttons

- Editable JSON text areas for advanced structures



Every writable parameter must have:



- Label

- Current value

- Reset-to-default control

- Tooltip or inline description

- Validation feedback



Add actions:



- Reset current section

- Reset all

- Copy configuration

- Export configuration

- Import configuration

- Forge dungeon

- Regenerate current stage where supported

- Randomize seed

- Previous seed

- Next seed



CONTROL GROUPS



At minimum expose these collapsible groups.



A. Session



- Seed

- Generator version

- Generation mode:

  - procedural

  - predefined

  - hybrid

- Environment

- Sub-biome

- Modifiers

- Visual layers

- Game type

- Difficulty

- Player count

- Quality tier

- animateBuild



B. Graph



- Dungeon size profile

- Target room count

- Candidate multiplier

- Depth-layer count

- Primary-trunk length

- Secondary-trunk count

- Branch count

- Dead-end count/range

- Immediate-loop count/range

- Immediate-loop chance

- Conditional-loop count/range

- Conditional-loop chance

- Secret count/range

- Secret chance

- Divergence count/range

- Reconvergence count/range

- Minimum branch length

- Maximum branch length

- Critical-path minimum

- Critical-path maximum

- Boss minimum normalized depth

- Minimum node degree

- Maximum node degree

- Maximum graph attempts

- Candidate graph count

- Minimum graph-quality score

- Allow one-way edges

- Allow conditional shortcuts

- Allow secret loops



C. Rooms



- Small-room weight

- Medium-room weight

- Large-room weight

- Landmark-room weight

- Room-shape weights

- Minimum/maximum room width

- Minimum/maximum room height

- Room padding

- Door padding

- Large-room requirement

- Landmark requirement

- Archetype weights

- Room-function weights

- Required room archetypes

- Maximum consecutive combat rooms

- Release-room frequency



D. Spatial embedding



- Grid width

- Grid height

- Graph-grid scale

- Tile scale

- Forward-axis spacing

- Branch-lane spacing

- Scatter radius

- Separation iterations

- Spatial attempts

- Corridor width by edge role

- Maximum corridor length

- Maximum corridor bends

- Corridor-routing mode

- Allow corridor crossings

- Promote crossings to junctions

- Minimum doorway width

- Minimum player clearance

- Eight-player staging clearance



E. Construction and decoration



- Decoration density

- Prop-cluster density

- Debris density

- Decal density

- Torch spacing

- Light density

- Dynamic-light budget

- Particle budget

- Floor variation

- Wall-height variation

- Damage-state frequency

- Secret-clue visibility

- Use authored assets

- Permit procedural fallbacks

- Show fallback markers



F. Gameplay



- Enable gameplay placement

- Encounter-density multiplier

- Encounter-budget multiplier

- Elite frequency

- Monster-family selection

- Hazard density

- Event frequency

- Objective count

- Side-boss count

- Reinforcement-wave count

- Player-start clearance

- Monster-start separation

- Boss-clearance profile

- Reward frequency

- Game-type transformation

- Player-count scaling

- Difficulty scaling



G. Validation



- Validate graph reachability

- Validate tile reachability

- Validate loop counts

- Validate dead ends

- Validate branch purpose

- Validate forward reconvergence

- Validate room degrees

- Validate adjacency

- Validate overlaps

- Validate padding

- Validate corridor authorization

- Validate navigation clearance

- Validate objectives

- Validate boss arena

- Validate assets

- Validate performance

- Treat warnings as errors

- Maximum generation attempts



H. Rendering



- Orthographic/perspective diagnostic camera

- Camera yaw

- Camera pitch

- Camera distance

- Zoom

- Floor visibility

- Wall visibility

- Ceiling visibility

- Prop visibility

- Light visibility

- Particle visibility

- Spawn-marker visibility

- Hazard visibility

- Objective visibility

- Post-processing

- Fog

- Shadows

- Isometric wall cutaway

- Low/medium/high quality profile



I. Animation



- Animate build

- Playback speed

- Pause

- Resume

- Step backward

- Step forward

- Restart animation

- Skip to completed dungeon

- Scatter duration

- Separation duration

- Graph duration

- Flood duration

- Wall-rise duration

- Prop-pop duration

- Freeze live effects while paused



FUTURE ENVIRONMENT SUPPORT



Build an environment registry:



{

  id,

  displayName,

  version,

  status,

  supportedLayouts,

  supportedGameTypes,

  configSchemaExtensions,

  inspectorExtensions,

  palette,

  assetNamespace

}



Initial registry:



- Catacombs:

  - enabled

  - implemented

  - layout: graph

- Garden Maze:

  - disabled

  - status: planned

  - layout: maze

- Dark Tower:

  - disabled

  - status: planned

  - layout: tower

- Hell’s Canyon:

  - disabled

  - status: planned

  - layout: tree-linear



The control panel must derive environment choices from this registry.



Disabled environments must be visible and labeled “Planned,” but must not pretend to generate valid content.



Do not restore the old prototype environments.



RESOLVED DUNGEON CONTRACT



Implement and document an expandable `ResolvedDungeon` contract containing at minimum:



interface ResolvedDungeon {

  identity: {

    dungeonId: string;

    seed: number;

    name: string;

    schemaVersion: string;

    generatorVersion: string;

    generationMode: "procedural" | "predefined" | "hybrid";

    layoutProfileId: string;

    environmentProfileId: string;

    environmentVersion: string;

    subBiomeId?: string;

    modifierIds: string[];

    visualLayerIds: string[];

  };



  config: DungeonConfig;



  worldGraph: WorldGraph;

  areaGraphs: AreaGraph[];

  roomGraph: RoomGraph;



  rooms: ResolvedRoom[];

  edges: ResolvedEdge[];

  branches: ResolvedBranch[];

  depthLayers: DepthLayer[];



  starts: PlayerStart[];

  completion: CompletionDefinition;

  objectives: ResolvedObjective[];



  grid: {

    width: number;

    height: number;

    tileTypes: Uint8Array;

    roomIds: Int16Array;

    corridorMask: Uint8Array;

    doorwayMask: Uint8Array;

    navigationMask: Uint8Array;

    clearanceField: Float32Array;

    distanceField: Int32Array;

    unauthorizedContactMask: Uint8Array;

  };



  construction: ConstructionPlacement[];

  gameplay: GameplayPlacement[];



  encounters: ResolvedEncounter[];

  monsters: ResolvedMonsterSpawn[];

  reinforcementSockets: ReinforcementSocket[];

  hazards: ResolvedHazard[];

  events: ResolvedEvent[];

  rewards: ResolvedReward[];

  bosses: ResolvedBoss[];



  assets: ResolvedAssetUsage[];

  materialGroups: MaterialGroupSummary[];

  drawCallGroups: DrawCallGroupSummary[];



  metrics: DungeonMetrics;

  validation: ValidationResult;

  diagnostics: GenerationDiagnostics;



  canonicalChecksum: string;

}



All top-level `ResolvedDungeon` sections must be visible in the utility.



Provide:



- Expand/collapse tree viewer

- Search/filter

- Copy selected value

- Copy JSON

- Export JSON

- Summary view

- Raw canonical-data view



Typed arrays must be presented as:



- Type

- Length

- Minimum

- Maximum

- Nonzero count

- Compact preview

- Optional full export



Do not dump thousands of values into the DOM by default.



GENERATION DIAGNOSTICS CONTRACT



Implement:



interface GenerationDiagnostics {

  valid: boolean;

  qualityScore: number;

  attemptCount: number;

  finalAttemptSeed: number;



  timings: Record<string, number>;



  issues: GenerationDiagnostic[];



  stageSummaries: {

    scatter: StageDiagnosticSummary;

    separation: StageDiagnosticSummary;

    graph: StageDiagnosticSummary;

    roomAssignment: StageDiagnosticSummary;

    spatialEmbedding: StageDiagnosticSummary;

    corridorRouting: StageDiagnosticSummary;

    rasterization: StageDiagnosticSummary;

    construction: StageDiagnosticSummary;

    gameplay: StageDiagnosticSummary;

    assetResolution: StageDiagnosticSummary;

    validation: StageDiagnosticSummary;

    checksum: StageDiagnosticSummary;

  };



  graphMetrics: GraphDiagnosticMetrics;

  spatialMetrics: SpatialDiagnosticMetrics;

  gameplayMetrics: GameplayDiagnosticMetrics;

  assetMetrics: AssetDiagnosticMetrics;

  performanceMetrics: PerformanceDiagnosticMetrics;

}



interface GenerationDiagnostic {

  id: string;

  severity: "info" | "warning" | "error";

  stage: string;

  code: string;

  message: string;



  graphId?: string;

  nodeIds?: string[];

  edgeIds?: string[];

  roomIds?: string[];

  assetIds?: string[];

  coordinates?: Array<{ x: number; y: number; level?: number }>;



  constraintId?: string;

  attempt: number;

  resolved: boolean;

  simulated?: boolean;

}



The diagnostics panel must support:



- Severity filters

- Stage filters

- Code filter/search

- Unresolved-only toggle

- Sort by severity/stage/code

- Click diagnostic to focus relevant graph node, room, edge, asset, or tile

- Copy diagnostic

- Export diagnostics

- Clear client-only diagnostics

- Error/warning/info counts

- Timing bars per stage

- Quality-score display

- Attempt history



Clearly mark placeholder diagnostic values as `SIMULATED` until a real implementation supplies them.



INSPECTOR LAYOUT



Use a desktop developer-workbench layout:



- Left: collapsible parameter/configuration panel

- Center: Three.js dungeon viewport

- Right: collapsible inspector panel

- Bottom: optional diagnostics/timeline drawer

- Top: environment, seed, generation state, checksum, and main actions



On small screens:



- Panels become drawers or tabs

- Viewport remains usable

- Controls remain keyboard accessible

- No mandatory hover-only interactions



RIGHT INSPECTOR TABS



Create these tabs:



1. Graph

2. Spatial

3. Gameplay

4. Assets

5. Resolved Dungeon

6. Diagnostics

7. Tests

8. Performance



GRAPH INSPECTOR



Display and independently toggle:



- Primary trunk

- Secondary trunks

- Divergence nodes

- Reconvergence nodes

- Immediate loops

- Conditional loops

- Secret branches

- Secret loops

- Dead ends

- Critical path

- Initial critical path

- Final critical path after shortcuts

- Depth layers

- Room degrees

- Node functions

- Node categories

- Node scales

- Branch IDs

- Edge direction

- Edge state

- Edge criticality

- Start

- Primary finish

- Structural exits

- Articulation points

- Invalid degrees

- Forbidden adjacencies



Required graph interaction:



- Hover node for tooltip

- Click node to select it

- Click edge to inspect it

- Focus selected node in viewport

- Filter by function, scale, degree, depth, or branch

- Show graph metrics

- Show node/edge table

- Highlight shortest route

- Highlight selected branch

- Highlight diagnostic targets



Use stable colors and line styles:



- Primary trunk: bright white or gold

- Secondary trunk: blue

- Immediate loop: cyan solid

- Conditional loop: orange dashed

- Secret: violet dotted

- Critical path: red

- Invalid: magenta

- Start: teal

- Finish/boss: crimson



Do not rely on color alone. Use different line styles, thicknesses, glyphs, and labels.



SPATIAL INSPECTOR



Display and independently toggle:



- Room footprints

- Grid anchors

- Graph grid

- Tile grid

- Corridor paths

- Corridor centerlines

- Doorways

- Wall boundaries

- Room padding

- Door padding

- Overlaps

- Clearance fields

- Navigation regions

- Non-walkable regions

- Player traversal field

- Monster traversal field

- Boss clearance

- Unauthorized contacts

- Corridor crossings

- Junction promotions

- Room ownership

- Distance field

- Area bounds



Required interaction:



- Inspect a tile

- Display tile coordinates

- Display room owner

- Display tile type

- Display navigation flags

- Display clearance value

- Display distance value

- Display collision and unauthorized-contact flags

- Focus selected room

- Show room footprint and reserved regions

- Highlight overlap and padding violations



Clearance and distance fields need selectable heatmaps with legends.



GAMEPLAY INSPECTOR



Display and independently toggle:



- Primary player start

- Late-join starts

- Checkpoints

- Monster spawns

- Monster families

- Monster roles

- Encounter regions

- Encounter budgets

- Budget utilization

- Reinforcement sockets

- Patrol paths

- Hazards

- Hazard telegraphs

- Hazard safe regions

- Objectives

- Objective dependency edges

- Boss

- Boss arena

- Boss clearance

- Boss phase sockets

- Event regions

- Reward locations

- Treasure rooms

- Shrines

- Side bosses

- Interaction points

- Room-lock boundaries



Required interaction:



- Filter by content category

- Select encounter and view composition

- Select spawn and view monster definition

- Select hazard and view counterplay data

- Select objective and view dependency chain

- Select boss and view arena requirements

- Display room budget calculations

- Highlight placements marked simulated or placeholder



ASSET INSPECTOR



Display:



- Asset IDs

- Asset category

- Authored asset URI/reference

- Procedural fallback ID

- Resolution status

- Missing assets

- Fallback usage

- Collision footprints

- Navigation footprints

- Material groups

- Texture groups

- LOD definitions

- Active LOD

- Draw-call groups

- Instance counts

- Triangle estimates

- Texture-memory estimates

- Geometry-memory estimates

- Quality-tier support

- Unused loaded assets

- Duplicate material candidates



Required asset states:



- AUTHORED

- FALLBACK

- MISSING

- PLACEHOLDER

- INVALID



Required asset controls:



- Show only missing

- Show only fallbacks

- Show only invalid

- Force all fallbacks

- Compare authored/fallback footprint

- Highlight asset instances in viewport

- Sort by estimated memory

- Sort by instance count

- Export asset-usage report



Use procedural fallback assets for the initial utility. Mark them visibly as fallbacks without making the dungeon unreadable.



CONTROL-PANEL OVERLAYS



Every overlay must have an independent checkbox.



Also provide:



- Enable all overlays

- Disable all overlays

- Reset overlay defaults

- Solo selected overlay

- Graph preset

- Spatial preset

- Gameplay preset

- Asset preset

- Validation preset

- Screenshot preset



Persist purely local UI preferences in `localStorage`, but do not let them affect canonical generation.



LIVE STATISTICS



Display at minimum:



Graph:



- Nodes

- Edges

- Primary-trunk nodes

- Secondary trunks

- Branches

- Divergences

- Reconvergences

- Immediate loops

- Conditional loops

- Secrets

- Dead ends

- Articulation points

- Cyclomatic number

- Critical-path length

- Maximum depth

- Average degree

- Quality score



Spatial:



- Grid width/height

- Room area

- Floor tiles

- Corridor tiles

- Wall boundaries

- Doorways

- Overlaps

- Padding violations

- Unauthorized contacts

- Reachable percentage

- Minimum critical-path clearance



Gameplay:



- Player starts

- Encounters

- Monsters

- Encounter budget

- Budget utilization

- Reinforcement sockets

- Hazards

- Objectives

- Events

- Rewards

- Side bosses

- Main bosses



Assets/rendering:



- Resolved assets

- Missing assets

- Fallback assets

- Material groups

- Texture-memory estimate

- Geometry-memory estimate

- Draw calls

- Triangles

- Instanced objects

- Dynamic lights

- Particles

- FPS

- Frame time



Generation:



- Attempt count

- Stage timings

- Total generation time

- Validation time

- Canonicalization time

- Checksum time

- Warning count

- Error count

- Final seed/attempt seed

- Canonical checksum



LEGENDS



Provide dynamic legends for:



- Room functions

- Node scales

- Node categories

- Graph edge types

- Edge states

- Depth heatmap

- Clearance heatmap

- Navigation regions

- Gameplay placements

- Asset states

- Diagnostic severity



Legends must update when overlays change.



STAGED BUILD ANIMATION



Implement optional animation controlled by `animateBuild`.



Stages:



1. Candidate rooms scatter

2. Rooms separate

3. Graph candidates appear

4. Primary trunk resolves

5. Secondary trunks resolve

6. Divergences and reconvergences appear

7. Immediate, conditional, and secret edges appear

8. Room functions are assigned

9. Spatial embedding settles

10. Corridors carve

11. Floors flood outward using the distance field

12. Walls rise

13. Doors and arches appear

14. Structural assets rise

15. Props pop

16. Gameplay markers appear

17. Validation overlays flash/highlight

18. Checksum and completion state appear



Required animation controls:



- Play

- Pause

- Restart

- Skip

- Previous stage

- Next stage

- Playback speed

- Timeline scrubber

- Current stage name

- Stage timing

- Reduced-motion behavior



When `prefers-reduced-motion` is active:



- Default `animateBuild` to false

- Preserve manual stage stepping

- Avoid rapid flashing



The animation visualizes already-generated stage snapshots. Animation timing must not affect generation output.



GENERATION STAGE SNAPSHOTS



Store lightweight stage snapshots or diagnostic views sufficient to replay:



- Candidate room anchors

- Separated room anchors

- Candidate edges

- Accepted graph

- Room assignments

- Embedded footprints

- Routed corridors

- Rasterized tiles

- Construction placements

- Gameplay placements

- Final validation



Do not duplicate full large typed arrays unnecessarily.



IMPORT/EXPORT



Implement:



- Import configuration JSON

- Export configuration JSON

- Import predefined graph template JSON

- Export current graph as template JSON

- Import resolved dungeon JSON

- Export resolved dungeon JSON

- Export canonical JSON

- Export diagnostics JSON

- Export asset report JSON

- Export test report JSON

- Copy checksum

- Copy seed

- Download viewport PNG

- Download minimap PNG if implemented



Validate imported data and display actionable errors. Never execute imported content.



TEST HARNESS



Include an in-page test tab and “Run Tests” action.



Tests:



- Same seed/config produces identical checksum three times

- Different seeds normally produce different checksums

- Named RNG streams are stable

- Graph is connected

- Required rooms reachable

- At least one immediate loop

- Dead-end minimum satisfied

- Every branch has a purpose

- Reconvergences occur deeper than divergences

- Node degrees are legal

- Adjacencies are legal

- No room overlaps

- Corridor routes exist

- No unauthorized spatial contacts

- Tile reachability is 100% for required walkable tiles

- Player-start clearance passes

- Objective reachability passes

- Boss arena clearance passes

- No gameplay placement overlaps blocked geometry

- Every asset resolves or has a fallback

- Dynamic-light budget passes

- Draw-call budget reports pass/fail

- Serialization is canonical

- Imported/exported configuration round-trips

- ResolvedDungeon export/import round-trips



Show:



- Pass/fail

- Duration

- Error details

- Relevant diagnostic targets

- Copy/export report



Add a bounded multi-seed test:



- User-configurable seed count

- Default 100

- Maximum appropriate for the browser

- Progress indicator

- Cancel button

- Failure-seed list

- Aggregate distributions

- Run in time-sliced batches so the UI remains responsive

- Use a Web Worker created from an inline Blob where practical



DETERMINISM



Use seeded RNG only.



Create named RNG streams:



- graph

- roomAssignment

- spatialEmbedding

- corridorRouting

- construction

- encounters

- hazards

- objectives

- bosses

- props

- naming



Ban generation decisions based on:



- `Math.random`

- `Date.now`

- frame time

- unordered iteration

- GPU results

- animation timing



The dice button may use browser cryptographic randomness only to select a new root seed. Once selected, that seed fully determines authoritative output.



Use explicit stable tie-breaking and stable sorting.



DIAGNOSTIC PLACEHOLDERS



Some Blueprint systems may not yet exist.



When a system is absent:



- Do not fabricate production behavior.

- Produce clearly marked simulated diagnostic fixtures only when needed to demonstrate the inspector.

- Add `simulated: true`.

- Label the UI with `SIMULATED`.

- Keep simulated data out of the canonical authoritative checksum unless the demo mode explicitly includes it.

- Provide a control to disable all simulated content.

- Show “Not implemented” instead of fake success when no fixture is appropriate.



SCENE BUILDER



Use an isometric orthographic camera by default.



Render:



- Floors

- Edge-based walls

- Doorways

- Procedural fallback doors

- Corridors

- Simple columns/arches

- Placeholder props

- Player-start markers

- Monster markers

- Hazard markers

- Objective markers

- Boss-clearance region

- Reward markers

- Debug overlays



Use:



- InstancedMesh for repeated geometry

- Shared materials

- No individual mesh per tile

- No shadowed point lights

- At most the configured dynamic-light budget

- Frustum culling where appropriate

- Reliable disposal on regeneration



Keep debug overlays separate from production geometry.



ACCESSIBILITY



- Semantic buttons, labels, tabs, and form controls

- Keyboard navigation

- Visible focus states

- ARIA labels

- Sufficient contrast

- No color-only status communication

- Reduced-motion support

- Tooltips available by focus, not hover only

- Resizable or collapsible panels

- Text-size-friendly layout



ERROR HANDLING



Do not throw raw errors into the page.



Provide:



- Visible generation-failure banner

- Diagnostic issue

- Stage name

- Attempt count

- Constraint code

- Suggested corrective parameter

- Copy error details

- Return to last valid dungeon



Never display a known-invalid dungeon as valid.



If generation fails:



- Keep the last valid dungeon visible

- Show failed candidate overlays only when explicitly requested

- Do not silently change environment, game type, or difficulty

- Do not repair disconnected graphs with teleporters



REFERENCE-PAGE CHANGES



The attached `index.html` currently:



- Uses external CSS

- Uses an external `src/main.js`

- Contains old prototype themes

- Exposes only a few controls

- Has one general graph toggle

- Has a compact fixed telemetry panel



For this utility:



- Inline the CSS and JavaScript

- Replace old themes with the environment registry

- Expand controls using the schema-driven system

- Split graph/spatial/gameplay/asset inspection into dedicated tabs

- Preserve the strong dark visual design

- Preserve compact live statistics

- Preserve useful camera and keyboard interactions

- Add complete diagnostics and import/export support



KEYBOARD SHORTCUTS



At minimum:



- R: regenerate

- Shift+R: random seed and regenerate

- Space: pause/resume build

- Escape: skip build or close active dialog

- Left/Right: previous/next build stage when paused

- G: graph inspector preset

- S: spatial inspector preset

- Y: gameplay inspector preset

- A: asset inspector preset

- D: diagnostics panel

- F: focus selected object

- 0: reset camera

- Ctrl/Cmd+E: export configuration

- Ctrl/Cmd+I: import configuration

- ?: show shortcut help



Do not intercept shortcuts while the user is typing in an input or editor.



QUALITY REQUIREMENTS



- No console errors during normal use.

- No unresolved references.

- No hidden nondeterminism.

- No per-tile Mesh objects.

- No event-listener leaks during regeneration.

- No retained dungeon-specific GPU resources after disposal.

- UI remains responsive during multi-seed testing.

- Invalid inputs show inline validation.

- Controls and data viewers remain usable with large configurations.

- The current dungeon checksum is visible at all times.

- Every overlay listed in this prompt is represented by an independent control.

- Every top-level ResolvedDungeon and GenerationDiagnostics section is inspectable.

- Future environments can extend controls and inspectors through registries without rewriting the core UI.



SELF-VERIFICATION



Before finishing:



1. Open the page through a static HTTP server.

2. Generate at least three seeds.

3. Run the in-page test suite.

4. Verify repeated-seed checksums.

5. Exercise every inspector tab.

6. Toggle every overlay category.

7. Import/export a configuration.

8. Export and reimport a ResolvedDungeon.

9. Force procedural fallbacks.

10. Trigger a controlled generation failure.

11. Verify the last valid dungeon remains visible.

12. Regenerate repeatedly and check for resource growth.

13. Test reduced-motion behavior.

14. Test desktop and narrow responsive layouts.

15. Report any intentionally stubbed features in an in-page “Implementation Status” section.



FINAL RESPONSE



Return:



- The completed `dungeon-generator-workbench.html`

- A concise feature summary

- How to serve it locally

- Implemented versus simulated systems

- Test results

- Known limitations

- Confirmation that the old prototype environment themes were not retained
