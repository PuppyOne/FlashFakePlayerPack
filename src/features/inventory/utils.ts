import { EntityComponentTypes, type EquipmentSlot, type Player } from "@minecraft/server";
import type { SimulatedPlayer } from "@minecraft/server-gametest";

export const swapEquipment = (player: Player, simulatedPlayer: SimulatedPlayer, slot: EquipmentSlot): void => {
    const s = simulatedPlayer.getComponent(EntityComponentTypes.Equippable);
    const p = player.getComponent(EntityComponentTypes.Equippable);

    const _ = s.getEquipment(slot);
    const __ = p.getEquipment(slot);

    s.setEquipment(slot, __);
    p.setEquipment(slot, _);
};
