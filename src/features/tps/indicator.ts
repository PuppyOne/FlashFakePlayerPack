import { system, world } from "@minecraft/server";
import { TPSMonitor } from "../../core/tps";
import { commandManager } from "../../core/command";

const TPS_TAG = 'tps';

const tpsMonitor = new TPSMonitor();

tpsMonitor.on();

system.runInterval(() => {
    world.getPlayers({ tags: [TPS_TAG] }).forEach(player => {
        player.onScreenDisplay.setActionBar(`§e§lTPS:§3${tpsMonitor.tps}`);
    });
});

commandManager.registerCommand('tps开', ({ entity }) => {
    if (!entity) return;

    entity.addTag(TPS_TAG);
});

commandManager.registerCommand('tps关', ({ entity }) => {
    if (!entity) return;

    entity.removeTag(TPS_TAG);
});