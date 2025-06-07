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
    entity: Entity,
    maxDistance = 16
): SimulatedPlayer | undefined => {
    return entity.getEntitiesFromViewDirection({
        maxDistance,
        tags: [SIGN.YUME_SIM_SIGN],
    })[0]?.entity as SimulatedPlayer | undefined;
};

export const getClosestMob = (
    { dimension, location }: HasDimensionLocation,
    maxDistance: number = 16,
    options: Options = {}
): Entity | undefined => {
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
        ...options,
    })[0];
};

export const getClosestPlayer = (
    { dimension, location }: HasDimensionLocation,
    maxDistance: number = 16,
    options: Options = {}
): Player | undefined => {
    return dimension.getPlayers({
        excludeTags: [SIGN.YUME_SIM_SIGN],
        closest: 1,
        location,
        maxDistance,
        ...options,
    })[0];
};

interface HasDimensionLocation {
    dimension: Dimension;
    location: Vector3;
}

type Options = Omit<EntityQueryOptions, 'location' | 'maxDistance' | 'closest'>;
