import { EntityComponentTypes, type EquipmentSlot, type Player } from "@minecraft/server";

export const swapEquipment = (playerA: Player, playerB: Player, slot: EquipmentSlot): void => {
    const componentB = playerB.getComponent(EntityComponentTypes.Equippable);
    const componentA = playerA.getComponent(EntityComponentTypes.Equippable);

    const itemB = componentB.getEquipment(slot);
    const itemA = componentA.getEquipment(slot);

    componentB.setEquipment(slot, itemA);
    componentA.setEquipment(slot, itemB);
};
