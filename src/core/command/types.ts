import type { Dimension, Player, Vector3 } from "@minecraft/server";
import type { SimulatedPlayer } from "@minecraft/server-gametest";

export interface Executable {
    execute: (commandInfo: Context) => void;
}

export interface Context {
    prefix: string;
    args: string[];
    player?: Player;
    location?: Vector3;
    dimension?: Dimension;
    simulatedPlayer?: SimulatedPlayer;
}

export type BaseContext = Omit<Context, "args" | "prefix">;

export type Handler = (commandInfo: Context) => void;

export type Condition = (commandInfo: Context) => boolean;
