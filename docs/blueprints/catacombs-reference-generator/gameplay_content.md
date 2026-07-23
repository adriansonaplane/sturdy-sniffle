**DOC1 status:** Supporting/historical reference. For current implemented authority, lifecycle, runtime, and commands, defer to [README.md](README.md), [main_blueprint.md](main_blueprint.md), and [doc1_operations.md](doc1_operations.md).

# Gameplay Content

[Package README](README.md) · [Main Blueprint](main_blueprint.md) · [Traceability](requirements_traceability.md) · [Glossary](glossary.md)

## Monster families and roles
Restless Dead: shambling pressure, swarmer, corpse archer. Bone Guard: shield bearer, halberd sentinel, ossuary captain. Crypt Scavengers: bone rat pack, tomb picker, carrion leaper. Mourning Spirits: wailer, phasing mourner, silence shade. Tomb Constructs: stone guardian, funerary obelisk, crawling urn. Ritual Cult: acolyte, grave chanter, blood mason. Corpse Growth: root pustule, corpse bloom, grave tendril. Tomb Wardens: key warden, sepulcher knight, royal warden.

## Placement rules
Encounter budgets and recipes are versioned content-table references. Spawn methods include room entry, server wave, reinforcement socket, ambush reveal, and boss phase. Hazards, events, objectives, interactables, side bosses, main bosses, rewards, and sockets are immutable placements with mutable server state keys.

## Transformations and scaling
Generate a valid neutral Catacombs graph first. Speed Run reduces optional detours and adds timers/checkpoints. Hunt emphasizes target rooms and tracking objectives. Endurance adds reinforcement sockets and pacing rooms. Normal/Hard/Expert/Nightmare/Hell and party size 1-8 scale budgets through content tables, not generator-local combat stats.

## Validation
Room-content compatibility, objective dependency reachability, hazard telegraph clearance, boss arena contracts, spawn overlap, reinforcement access, and reward authority are validated.
