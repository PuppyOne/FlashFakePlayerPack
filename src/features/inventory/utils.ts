import { EntityComponentTypes, type EquipmentSlot, type Player } from "@minecraft/server";

export const swapItems = (playerA: Player, playerB: Player) => {
    const inventoryA = playerA.getComponent(EntityComponentTypes.Inventory).container;
    const inventoryB = playerB.getComponent(EntityComponentTypes.Inventory).container;

    for (let i = inventoryA.size; i > 0; i--) {
        const itemA = inventoryA.getItem(i);
        const itemB = inventoryB.getItem(i);

        if (itemA && itemB) {
            inventoryA.swapItems(i, i, inventoryB);
        } else if (itemA) {
            inventoryA.moveItem(i, i, inventoryB);
        } else if (itemB) {
            inventoryB.moveItem(i, i, inventoryA);
        }
    }
};

export const swapEquipment = (playerA: Player, playerB: Player, slot: EquipmentSlot): void => {
    const componentA = playerA.getComponent(EntityComponentTypes.Equippable);
    const componentB = playerB.getComponent(EntityComponentTypes.Equippable);

    const itemA = componentA.getEquipment(slot);
    const itemB = componentB.getEquipment(slot);

    componentA.setEquipment(slot, itemB);
    componentB.setEquipment(slot, itemA);
};
