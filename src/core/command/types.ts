import type { Dimension, Player, Vector3 } from "@minecraft/server";
import type { SimulatedPlayer } from "@minecraft/server-gametest";


export interface Context {
    prefix: string;
    args: string[];
    player?: Player;
    location?: Vector3;
    dimension?: Dimension;
    simulatedPlayer?: SimulatedPlayer;
}

export type BaseContext = Omit<Context, "args" | "prefix">;

export interface Executable {
    execute: (commandInfo: Context) => void;
}

export type Stack = [...middlewares: Middleware[], handler: Handler];

export type Middleware = (commandInfo: Context, next: Next) => void;

export type Handler = (commandInfo: Context) => void;

export type Next = () => void;

export type Condition = (commandInfo: Context) => boolean;
