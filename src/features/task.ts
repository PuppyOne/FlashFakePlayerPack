import { SIGN } from '@/constants';
import type { Vector3 } from '@minecraft/server';
import { system } from '@minecraft/server';
import { getEntitiesNear, getPlayerNear } from '@/core/queries';
import { simulatedPlayerManager } from '@/core/simulated-player';
import { gameTestManager } from '@/core/gametest';

const simulatedPlayerStates: Record<string, { o?: Vector3; }> = {};

// behavior
// 改造后的主逻辑
function AUTO_BEHAVIOR() {
    for (const simulatedPlayer of simulatedPlayerManager.simulatedPlayers.values()) {
        // 提前计算公共参数
        const EntitiesFromView = simulatedPlayer.getEntitiesFromViewDirection({ maxDistance: 4 })[0]?.entity;
        const EntitiesNear = getEntitiesNear(simulatedPlayer.location, simulatedPlayer.dimension, 4, {})[0];

        // 新增 SIGN 行为映射表
        const SIGN_HANDLERS = {
            // 自动复活
            [SIGN.AUTO_RESPAWN_SIGN]: () => {
                if (simulatedPlayer.getComponent('minecraft:health').currentValue <= 0) {
                    simulatedPlayer.respawn();
                    return true; // 标记需要跳过后续逻辑
                }
                return false;
            },

            // 自动跳跃
            [SIGN.AUTO_JUMP_SIGN]: () => {
                simulatedPlayer.jump();
            },

            // 视野攻击
            [SIGN.ATTACK_SIGN]: () => {
                if (EntitiesFromView) simulatedPlayer.attackEntity(EntitiesFromView);
            },

            // 自动攻击（复合行为）
            [SIGN.AUTO_ATTACK_SIGN]: () => {
                if (EntitiesNear) simulatedPlayer.lookAtEntity(EntitiesNear);
                if (EntitiesFromView) simulatedPlayer.attackEntity(EntitiesFromView);
            },

            // 三叉戟投掷
            [SIGN.AUTO_TRIDENT_SIGN]: () => {
                simulatedPlayer.useItemInSlot(0)
                    && system.runTimeout(() => simulatedPlayer.stopUsingItem(), 10);
            },

            // 自动追击（独立模块）
            [SIGN.AUTO_CHASE_SIGN]: () => {
                // 原追击逻辑保持完全一致...
                const entities = getEntitiesNear(simulatedPlayer.location, simulatedPlayer.dimension, 12, { families: ["undead"] })
                    .concat(getEntitiesNear(simulatedPlayer.location, simulatedPlayer.dimension, 12, { families: ["monster"] }))
                    .concat(getPlayerNear(simulatedPlayer, 12, {}));

                simulatedPlayerStates[simulatedPlayer.id] || (simulatedPlayerStates[simulatedPlayer.id] = {});
                simulatedPlayerStates[simulatedPlayer.id]["o"] || (simulatedPlayerStates[simulatedPlayer.id]["o"] = simulatedPlayer.location);
                const r3 = (a: Vector3, b: Vector3, threshold: number) => Math.abs(a.x - b.x) > threshold || Math.abs(a.y - b.y) > threshold || Math.abs(a.z - b.z) > threshold;

                if (entities.length > 0) {

                    // walk to target
                    const target = entities[0];
                    if (!r3(target.location, simulatedPlayer.location, 4)) {
                        simulatedPlayer.moveToLocation(gameTestManager.test.relativeLocation(target.location));
                    }
                } else {
                    console.error("back");
                    if (r3(simulatedPlayer.location, simulatedPlayerStates[simulatedPlayer.id]["o"], 1))
                        simulatedPlayer.moveToLocation(gameTestManager.test.relativeLocation(simulatedPlayerStates[simulatedPlayer.id]["o"]));
                }
            }
        } as const satisfies Partial<Record<SIGN, () => boolean | void>>;


        // 遍历执行所有标签行为
        for (const [tag, handler] of Object.entries(SIGN_HANDLERS)) {
            if (simulatedPlayer.hasTag(tag)) {
                console.log(tag);

                const skip = handler();
                if (skip) break; // 如果有需要跳过的逻辑，直接跳出当前循环
            }
        }
    }
}

system.runInterval(AUTO_BEHAVIOR, 20);
