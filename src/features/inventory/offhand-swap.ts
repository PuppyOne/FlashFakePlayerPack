import { commandManager } from "@/core/command";
import { getSimPlayer } from "@/core/queries";
import { EntityComponentTypes, EquipmentSlot } from "@minecraft/server";
import type { SimulatedPlayer } from "@minecraft/server-gametest";

commandManager.add('假人副手物品交换', ({player,simulatedPlayer: sim}) => {

    const simulatedPlayer:SimulatedPlayer = sim || getSimPlayer.fromView(player)

    const s = simulatedPlayer.getComponent(EntityComponentTypes.Equippable)

    const p = player.getComponent(EntityComponentTypes.Equippable)
    const i = EquipmentSlot.Offhand
    const _ = s.getEquipment(i)
    const __ = p.getEquipment(i)
    s.setEquipment(i, __)
    p.setEquipment(i, _)
});
