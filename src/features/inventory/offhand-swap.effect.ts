import { commandManager } from "@/core/command";
import { getSimulatedPlayerFromView } from "@/utils";
import { EquipmentSlot } from "@minecraft/server";
import type { SimulatedPlayer } from "@minecraft/server-gametest";
import { swapEquipment } from "./utils";

commandManager.register('假人副手物品交换', ({player,simulatedPlayer: sim}) => {
    const simulatedPlayer:SimulatedPlayer = sim || getSimulatedPlayerFromView(player)

    swapEquipment(player, simulatedPlayer, EquipmentSlot.Offhand)
});
