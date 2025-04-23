import { commandManager } from "@/core/command";

commandManager.use(['showshowway', '假人命令列表'], ({ player }) => {
    player?.sendMessage(commandManager.prefixes.join('\n'));
});