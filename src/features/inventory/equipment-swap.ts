import { commandManager } from "@/core/command";
import { getSimPlayer } from "@/core/queries";
import { EquipmentSlot } from "@minecraft/server";
import type { SimulatedPlayer } from "@minecraft/server-gametest";
import { swapEquipment } from "./utils";

commandManager.add(['假人装备交换','假人交换装备'], ({player,simulatedPlayer: sim}) => {
    const simulatedPlayer:SimulatedPlayer = sim || getSimPlayer.fromView(player)
    if(!player && !sim)return

    for (const i in  EquipmentSlot) {
        if (i === EquipmentSlot.Mainhand) continue
        swapEquipment(player, simulatedPlayer, EquipmentSlot[i])
    }
});
