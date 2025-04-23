import { simulatedPlayerManager } from '@/core/simulated-player';
import { type Context, commandManager, Command } from '@/core/command'
import { Dimension, LocationOutOfWorldBoundariesError, Vector3, world, type Player } from '@minecraft/server'
import {parseCoordinates} from "@/utils";
import { NotReadyError } from '@/core/simulated-player';
import { dimensions } from '@/constants';

const overworld = world.getDimension("overworld");

const addSimulatedPlayer = (entity: Player | undefined, location: Vector3, dimension: Dimension, nameTag?: string): void => {
    try {// TODO: midware
        simulatedPlayerManager.add({ name: nameTag, dimension, location });
    } catch (e) {
        if (e instanceof NotReadyError)
            entity?.sendMessage('[假人] 插件未初始化完成，请重试');
        else if (e instanceof LocationOutOfWorldBoundariesError)
            entity?.sendMessage('[假人] 位置非法，请在合法位置重试');
        else
            throw e;
    }
};

const chatSpawnCommand = new Command();

// 假人生成
chatSpawnCommand.use(({ args }) => args.length === 0, ({ player, location, dimension }) => {
    addSimulatedPlayer(player, location, dimension);
});

// 假人生成 批量 count
chatSpawnCommand.use(({ args }) => args[0] === '批量', ({ args: [, countString], player, location, dimension }) => {
    if (!countString) return player?.sendMessage('[模拟玩家] 命令错误，请提供数字');
    if (!Number.isSafeInteger(Number(countString))) return player?.sendMessage('[模拟玩家] 命令错误，期待数字却得到 ' + countString);

    let count = Number(countString);
    while (count-- > 0)
        addSimulatedPlayer(player, location, dimension);
});

// 假人生成 name
chatSpawnCommand.use(({ args }) => args.length === 1, ({ args: [targetName], player, location, dimension }) => {
    addSimulatedPlayer(player, location, dimension, targetName);
});

// #56 参考：
// 假人生成 x y z name 维度序号（数字 0-主世界 1-下界 2-末地）
chatSpawnCommand.use(
    ({ args }) => args.length >= 3,
    ({
        args: [targetX, targetY, targetZ, targetName, targetDimension],
        player,
        location: senderLocation,
        dimension: senderDimension
    }: Context) => {
        let location: Vector3;
        let nameTag: string | null = null;

        // xyz
        try {
            const { x: sourceX, y: sourceY, z: sourceZ } = senderLocation;
            // @ts-ignore
            const [x, y, z] = parseCoordinates([targetX, targetY, targetZ], [sourceX, sourceY, sourceZ])
    
            location = { x, y, z };
    
            // 好烂，谁来改改
    
            // 改xx这代码😡
            // 还是我自己写个addon霸👆🤓
        }catch (e) {
            return player?.sendMessage(`[模拟玩家] 命令错误，期待三个却得到错误的信息 ${targetX} ${targetY} ${targetZ}`);
        }

        // name
        if (targetName) 
            nameTag = targetName;

        // dimension
        let dimension: Dimension;
        if (targetDimension) {
            try {
                dimension = world.getDimension(dimensions[Number(targetDimension)]);
            } catch (e) {
                return player?.sendMessage('[模拟玩家] 命令错误，期待序号作为维度 (0-主世界 1-下界 2-末地) 却得到 ' + targetDimension);
            }
        }
        dimension ??= senderDimension ?? overworld;

        addSimulatedPlayer(player, location, dimension, nameTag);
    }
);

// 捕获命令参数数量错误并提示
chatSpawnCommand.use(({ args, player }) => {
    player?.sendMessage(`[模拟玩家] 命令错误，期待3个坐标数字(x y z)或1个名称字符串("名称")，得到个数为${args.length}。带空格名称需用引号包裹`);
});

commandManager.use(['假人生成', '假人创建', 'ffpp'], chatSpawnCommand);

// world.afterEvents.chatSend.subscribe(({message, sender})=>{
//     const cmdArgs = CommandRegistry.parse(message)
//     if(commandRegistry.commandsList.has(cmdArgs[0]))
//         commandRegistry.executeCommand(cmdArgs[0],{entity:sender,isEntity:true,args:cmdArgs})

//     if(message==='showshowway'){
//         sender.sendMessage(commandRegistry.showList().toString())
//     }
// })

// console.error('[假人]内置插件chatSpawn加载成功')