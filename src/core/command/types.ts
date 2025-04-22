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
    isEntity?: boolean;
    simulatedPlayer?: SimulatedPlayer;
} // | Player | Dimension | Entity

export type CommandInfoNoArgs = Omit<Context, "args" | "prefix">;

export type CommandHandler = (commandInfo: Context) => void;

export type CommandCondition = (commandInfo: Context) => boolean;
