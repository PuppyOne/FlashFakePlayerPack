import type {Block, Dimension, Entity, EntityQueryOptions, Player, Vector3} from '@minecraft/server'
import {SimulatedPlayer} from '@minecraft/server-gametest'
import { SIGN } from '@/constants'


export function getSimulatedPlayerFromView(e: Entity, maxDistance = 16): SimulatedPlayer {
    return e.getEntitiesFromViewDirection({ maxDistance, tags: [SIGN.YUME_SIM_SIGN] })[0]?.entity as SimulatedPlayer;
}

export function getClosestMob(location:Vector3, dimension:Dimension, maxDistance:number, Options={}): Entity{
    return dimension.getEntities({
        excludeTypes: ["minecraft:player", "minecraft:arrow", "minecraft:xp_orb", "minecraft:item"],
        closest: 1,
        location,
        maxDistance,
        ...Options,
    })[0];
}
export function getClosestPlayer(who:Entity|Block, maxDistance:number, defEntityQueryOptions:EntityQueryOptions={}):Player {
    return who.dimension.getPlayers({
        excludeTags: [SIGN.YUME_SIM_SIGN],
        closest: 1,
        location: who.location,
        maxDistance,
        ...defEntityQueryOptions,
    })[0];
}