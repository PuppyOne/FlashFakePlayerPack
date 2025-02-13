import { Dimension, Vector3 } from "@minecraft/server";

const DIMENSION_MAPPING = {
    "minecraft:overworld": "Overworld",
    "minecraft:nether": "Nether",
    "minecraft:the_end": "The End"
};

export const spawnLog = (name: string, location: Vector3, dimension: Dimension) => {
    const { x, y, z } = location;
    console.log(`[模拟玩家·改] [spawn] ${name} at ${DIMENSION_MAPPING[dimension.id] ?? dimension.id}(${x}, ${y}, ${z})`);
};

export const disconnectLog = (name: string) => {
    console.log(`[模拟玩家·改] [disconnect] ${name}`);
};