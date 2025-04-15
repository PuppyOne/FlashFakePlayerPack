import type {SimulatedPlayer} from '@minecraft/server-gametest'

import {
    initSucceed,
    pidManager,
    simulatedPlayers,
    spawnSimulatedPlayer,
    spawnSimulatedPlayerByNameTag
} from './main'
import { type CommandInfo, commandManager, Command } from '../core/command'
import { Dimension, Vector3, world, type Player } from '@minecraft/server'
import {xyz_dododo} from "../utils/xyz_dododo";

const overworld = world.getDimension("overworld");

const spawnAndRegisterSimulatedPlayer = (entity: Player | undefined, location: Vector3, dimension: Dimension, nameTag?: string): void => {
    if (!initSucceed) {
        entity?.sendMessage('[假人] 插件未初始化完成，请重试');
        return;
    }

    const pid = pidManager.next();
    const simulatedPlayer: SimulatedPlayer = nameTag
        ? spawnSimulatedPlayerByNameTag(location, dimension, nameTag)
        : spawnSimulatedPlayer(location, dimension, pid);


    simulatedPlayers[pid] = simulatedPlayer;
    simulatedPlayers[simulatedPlayer.id] = pid;
};

const chatSpawnCommand = new Command();

// 假人生成
chatSpawnCommand.register(({ args }) => args.length === 0, ({ entity, location }) => {
    spawnAndRegisterSimulatedPlayer(entity, location, location.dimension);
});

// 假人生成 批量 count
chatSpawnCommand.register(({ args }) => args[0] === '批量', ({ args: [, countString], entity, location }) => {
    if (!countString) return entity?.sendMessage('[模拟玩家] 命令错误，请提供数字');
    if (!Number.isSafeInteger(Number(countString))) return entity?.sendMessage('[模拟玩家] 命令错误，期待数字却得到 ' + countString);

    let count = Number(countString);
    while (count-- > 0)
        spawnAndRegisterSimulatedPlayer(entity, location, location.dimension);
});

// 假人生成 name
chatSpawnCommand.register(({ args }) => args.length === 1, ({ args: [targetName], entity, location }) => {
    spawnAndRegisterSimulatedPlayer(entity, location, location.dimension, targetName);
});

// #56 参考：
// 假人生成 x y z name 维度序号（数字 0-主世界 1-下界 2-末地）
chatSpawnCommand.register(
    ({ args }) => args.length >= 3,
    ({
        args: [targetX, targetY, targetZ, targetName, targetDimension],
        entity,
        location: senderLocation,
    }: CommandInfo) => {
        let location: Vector3;
        let nameTag: string = null;

        // xyz
        try {
            const { x: sourceX, y: sourceY, z: sourceZ } = senderLocation;
            // @ts-ignore
            const [x, y, z] = xyz_dododo([targetX, targetY, targetZ], [sourceX, sourceY, sourceZ])
    
            location = { x, y, z };
    
            // 好烂，谁来改改
    
            // 改xx这代码😡
            // 还是我自己写个addon霸👆🤓
        }catch (e) {
            return entity?.sendMessage(`[模拟玩家] 命令错误，期待三个却得到错误的信息 ${targetX} ${targetY} ${targetZ}`);
        }

        // name
        if (targetName) 
            nameTag = targetName;

        // dimension
        let dimension: Dimension;
        if (targetDimension) {
            try {
                dimension = world.getDimension(['overworld', 'nether', 'the end'][Number(targetDimension)]);
            } catch (e) {
                return entity?.sendMessage('[模拟玩家] 命令错误，期待序号作为维度 (0-主世界 1-下界 2-末地) 却得到 ' + targetDimension);
            }
        }
        dimension ??= senderLocation.dimension ?? overworld;

        spawnAndRegisterSimulatedPlayer(entity, location, dimension, nameTag);
    }
);

// 捕获命令参数数量错误并提示
chatSpawnCommand.register(({ args, entity }) => {
    entity?.sendMessage(`[模拟玩家] 命令错误，期待3个坐标数字(x y z)或1个名称字符串("名称")，得到个数为${args.length}。带空格名称需用引号包裹`);
});

commandManager.registerCommand(['假人生成', '假人创建', 'ffpp'], chatSpawnCommand);

// world.afterEvents.chatSend.subscribe(({message, sender})=>{
//     const cmdArgs = CommandRegistry.parse(message)
//     if(commandRegistry.commandsList.has(cmdArgs[0]))
//         commandRegistry.executeCommand(cmdArgs[0],{entity:sender,isEntity:true,args:cmdArgs})

//     if(message==='showshowway'){
//         sender.sendMessage(commandRegistry.showList().toString())
//     }
// })

// console.error('[假人]内置插件chatSpawn加载成功')