import { SIGN } from '@/constants';
import type {
    Dimension,
    Entity,
    EntityQueryOptions,
    Player,
    Vector3,
} from '@minecraft/server';
import type { SimulatedPlayer } from '@minecraft/server-gametest';

export const getSimulatedPlayerFromView = (
    e: Entity,
    maxDistance = 16
): SimulatedPlayer => {
    return e.getEntitiesFromViewDirection({
        maxDistance,
        tags: [SIGN.YUME_SIM_SIGN],
    })[0]?.entity as SimulatedPlayer;
};

export const getClosestMob = (
    { dimension, location }: HasDimensionLocation,
    maxDistance: number,
    Options = {}
): Entity => {
    return dimension.getEntities({
        excludeTypes: [
            'minecraft:player',
            'minecraft:arrow',
            'minecraft:xp_orb',
            'minecraft:item',
        ],
        closest: 1,
        location,
        maxDistance,
        ...Options,
    })[0];
};

export const getClosestPlayer = (
    { dimension, location }: HasDimensionLocation,
    maxDistance: number,
    defEntityQueryOptions: EntityQueryOptions = {}
): Player => {
    return dimension.getPlayers({
        excludeTags: [SIGN.YUME_SIM_SIGN],
        closest: 1,
        location,
        maxDistance,
        ...defEntityQueryOptions,
    })[0];
};

interface HasDimensionLocation {
    dimension: Dimension;
    location: Vector3;
}
