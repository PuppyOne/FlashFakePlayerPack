import type { Vector3, Dimension } from "@minecraft/server";

export interface AddSimulatedPlayerOptions {
    name?: string;
    location: Vector3;
    dimension: Dimension;
    nameTag?: string;
}