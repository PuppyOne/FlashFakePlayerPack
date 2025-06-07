import { commandManager } from "@/core/command";
import { getSimulatedPlayerFromView } from "@/utils";
import type { SimulatedPlayer } from "@minecraft/server-gametest";
import { swapItems } from "./utils";

commandManager.register(['假人背包交换','假人交换背包'], ({player,simulatedPlayer: sim}) => {
    if(!player && !sim)return
    const simulatedPlayer:SimulatedPlayer = sim || getSimulatedPlayerFromView(player)
    if(!simulatedPlayer)return

    swapItems(simulatedPlayer, player);
});
