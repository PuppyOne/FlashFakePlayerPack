import { EntityComponentTypes, type EquipmentSlot, type Player } from "@minecraft/server";

export const swapEquipment = (playerA: Player, playerB: Player, slot: EquipmentSlot): void => {
    const s = playerB.getComponent(EntityComponentTypes.Equippable);
    const p = playerA.getComponent(EntityComponentTypes.Equippable);

    const _ = s.getEquipment(slot);
    const __ = p.getEquipment(slot);

    s.setEquipment(slot, __);
    p.setEquipment(slot, _);
};
