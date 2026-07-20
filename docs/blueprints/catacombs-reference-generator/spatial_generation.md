# Spatial Generation

[Package README](README.md) · [Main Blueprint](main_blueprint.md) · [Traceability](requirements_traceability.md) · [Glossary](glossary.md)

## Process
Accept the abstract graph before embedding. Use integer forward-axis layers, branch lanes, grid anchors, rectangular/polygon footprints, candidate oversampling, separation, padding, and area bounds. Route corridors only for declared edges with max two bends, then A* fallback. Corridor crossings either reject or promote to declared Crypt Junction nodes before canonicalization.

## Raster/navigation
Rasterize room ownership, corridor ownership, edge-based walls, doorways, boundaries, distance fields, clearance fields, and navigation regions. Boundaries are edge-based rather than inferred from visual meshes.

## Proof obligations
Every graph edge must have one physical connection with matching `edgeId`. Every physical doorway/corridor connection must map to one graph edge. Flood-fill adjacent walkable components and boundary contacts to prove no overlapping floors create unauthorized adjacency. Clearance fields plus prop/hazard footprints prove required routes, eight-player entrance staging, and boss arena routes are not blocked.

## Retry behavior and diagnostics
Spatial failures emit targeted diagnostics, preserve failed attempt snapshots outside canonical data, and retry with deterministic attempt index/seed. Rejections include overlaps, unauthorized contacts, unrouteable edge, clearance failure, crossing not promoted, and bounds overflow.
