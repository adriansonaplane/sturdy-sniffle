# PROMPT — Procedural Dungeon Generator for an Isometric Three.js ARPG

## ROLE
You are a senior gameplay/graphics engineer specializing in procedural content generation and real-time WebGL. You write deterministic, allocation-conscious JavaScript and understand Three.js instancing, draw-call budgets, and forward-lighting costs at a deep level. You ship code that self-verifies.

## CONTEXT
Target: an isometric, Diablo-style ARPG built in Three.js (r128+, WebGL2). Camera is orthographic — yaw 45°, pitch 35–40°. World scale: **1 unit = 1 tile**, Y-up, grid (x, y) maps to world (x, z). Generation runs on the main thread on level load. No frameworks, no build step: one self-contained module.

## OBJECTIVE
Implement `generateDungeon(params) → Dungeon` (pure data, zero THREE imports) plus `buildDungeonScene(dungeon) → THREE .Group` (pure presentation). Dungeons must have:
- **Character** — irregular silhouettes, mixed room shapes, themed set-pieces, torch-lit atmosphere, a seeded name.
- **Depth** — branching with dead-end rewards, guaranteed loops (never a pure tree), secrets off the critical path, tension/release pacing.
- **Challenge** — a difficulty ramp keyed to graph distance from the entrance, elite gates on the critical path, boss at maximal depth.

## NON-NEGOTIABLE CONSTRAINTS
1. **Determinism.** One integer seed reproduces the dungeon bit-for-bit. `Math.random`, `Date .now`, and iteration order over unordered Sets/Maps feeding logic are banned. Use mulberry32 (or xoshiro128**), threaded explicitly through every stage.
2. **Connectivity.** Flood fill from the entrance must reach 100% of floor cells. On failure, re-roll internally with a derived seed (max 5 attempts) — never ship a broken layout, never "fix" islands with teleporters.
3. **Performance.** ≤ 50 ms generation at 60 rooms. Level geometry in ≤ 10 draw calls via `InstancedMesh` — zero per-tile `Mesh` objects. ≤ 12 dynamic point lights, no shadow maps on point lights.
4. **Separation of concerns.** Generator returns typed arrays + POJOs only. Renderer consumes that data and owns all THREE objects, with a `dispose()` that frees everything on regenerate.

## PIPELINE — implement as discrete, individually testable stages
1. **RNG.** mulberry32 with helpers: `float(a,b)`, `int(a,b)`, `pick(arr)`, `chance(p)`, `gaussian(mu,sigma)` (Box–Muller).
2. **Room scatter.** Spawn `roomCount × 1.4` candidates inside an ellipse (radius ∝ √roomCount so density stays constant). Archetype table — small 5–7 (45%), medium 8–12 (40%), large 13–18 (15%). Shape table — rectangle 60%, ellipse 22%, chamfered octagon 18%. Force ≥ 2 large rooms.
3. **Separation.** Iterative AABB push-apart with 2-cell padding until stable (cap 300 iterations), snap centers to integer grid, cull the smallest overflow down to `roomCount`.
4. **Connectivity graph.** Bowyer–Watson Delaunay over room centers → Prim MST as the skeleton → re-add non-MST Delaunay edges with probability `loopChance` (default 0.15), rejecting edges longer than 2.2× the mean MST edge. Loops are mandatory for ARPG flow: report the cyclomatic number (E − V + 1) and require ≥ 1 at defaults.
5. **Semantics before carving.** Boss = largest-area room. Entrance = degree-1 room maximizing graph distance from the boss. Critical path = BFS entrance→boss; remaining leaves → treasure (cap 4); 1–2 shrines mid-depth off-path; 1–2 elite arenas on the critical path at 55–85% depth; everything else combat. `difficulty = 0.15 + 0.85 × (depth / maxDepth)`, boss = 1.0.
6. **Corridor carve.** L-corridors center-to-center with seeded elbow direction (skip the elbow when spans overlap enough for a straight run). Width 3 on the critical path, 2 default, 1 permitted on treasure spurs. Stamp FLOOR; tag corridor cells for styling and doorway detection.
7. **Rasterize.** `Uint8Array` grid of {VOID, FLOOR, WALL}; WALL = any VOID cell with an 8-neighbor FLOOR (render only these — back rows stay void and vanish into fog). Doorway = corridor cell 4-adjacent to room floor. Compute a per-cell BFS distance field from the entrance (`Int16Array`, −1 for non-floor) — reused for pacing, reveal animation, and validation.
8. **Decoration (data only).** Pillar grids in large rooms (only cells whose 8 neighbors are all floor, ≥ 2 cells from any doorway). Torches on floor-facing walls with min Chebyshev spacing 4. Debris density ∝ `decorDensity`, higher in low-difficulty rooms. Braziers ringing the boss arena; one chest per treasure room; shrine crystal; entrance portal ring. Enemy spawns: `round(area / 18 × (0.5 + difficulty))` for combat/elite, none in entrance/treasure/shrine, never on a prop or doorway cell.
9. **Presentation metadata.** Seeded dungeon name from syllable tables ("The Ashen Vaults of Vor'gul"), per-room tint, stats block `{rooms, edges, loops, criticalLength, floorTiles, wallTiles, props, genMs}`.

## RENDERING SPEC
- One `InstancedMesh` per kind: floor, wall, pillar, torch bracket, flame, debris, chest, spawn marker, crystal.
- **Baked per-instance AO:** floor color = base × (1 − 0.09 × min(adjacentWalls₈, 4)) ± 5% value noise, blended ~18% toward the room tint; corridors darker and untinted. Wall height 2.0 ± 0.25 seeded jitter for a ruined silhouette.
- **Lighting:** dim blue hemisphere + faint directional for form; warm point lights (0xff8c3a, distance ≈ 9, decay 2) on a farthest-point-sampled subset of torches within budget, plus entrance/shrine/boss key lights. Per-frame flicker (intensity noise + flame scale jitter). `FogExp2` over a near-black clear color gives ortho depth falloff.
- **Materials:** Lambert for level geometry (vertex lighting reads pleasingly chunky at tile scale and is cheap under many lights); unlit/emissive for flames, crystals, markers.
- **Debug overlays (toggleable):** Delaunay (faint), MST (white), loop edges (cyan), critical path (red), difficulty heatmap recolor.

## DATA CONTRACT
```ts
interface Dungeon {
  params: Params; name: string;
  W: number; H: number;
  grid: Uint8Array;            // VOID | FLOOR | WALL
  bfs: Int16Array;             // per-cell distance from entrance, −1 = non-floor
  rooms: Room[];               // { id, cx, cy, w, h, shape, type, depth, difficulty, degree }
  edges: Edge[];               // { a, b, isLoop, isCritical }
  doorways: Cell[]; corridorCells: Cell[];
  props: Prop[];               // { kind, x, y, rot, scale, roomId }
  spawns: Spawn[];             // { x, y, tier, roomId }
  stats: Stats;
}
```

## ACCEPTANCE TESTS — must run automatically and print results
- Flood-fill reachability = 100% of floor cells.
- Same seed + params ⇒ identical grid checksum across 3 consecutive runs.
- Boss depth ≥ 60% of max BFS depth; entrance degree = 1; entrance ≠ boss-adjacent.
- ≥ 3 leaf rooms at 40+ rooms; loop count = cyclomatic number = E − V + 1.
- No prop or spawn on a doorway, wall, or void cell; light count within budget.
- 60-room generation < 50 ms (report the measured value).

## TUNABLES (expose with defaults)
`seed`, `roomCount = 42`, `loopChance = 0.15`, `decorDensity = 0.6`, `theme = 'crypt'`

## ANTI-GOALS
Uniform room sizes; corridor spaghetti (> 2 elbows per link); boss reachable in < 60% of max depth; per-tile meshes; shadow-mapped point lights; hidden nondeterminism; a pure-tree layout with zero cycles.

## DELIVERABLE
A single self-contained HTML file: generator module + scene builder + minimal control panel (seed input, dice, sliders for roomCount / loopChance / decorDensity, overlay toggles, live stats, legend). Include an optional staged build animation gated behind `animateBuild` — rooms scatter→separate, graph resolves Delaunay→MST+loops, floors flood outward along the BFS field, walls rise, props pop — so the algorithm itself is legible on screen.
