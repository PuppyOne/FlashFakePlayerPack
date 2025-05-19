import { world } from '@minecraft/server'

import '@/features'

import {playerReady} from "@/features/events";
import { simulatedPlayerManager } from '@/core/simulated-player';
import { gameTestManager } from '@/core/gametest';

simulatedPlayerManager.initialize();
gameTestManager.initialize();

const test = await gameTestManager.ready;

simulatedPlayerManager.test = test;
console.log('[模拟玩家] 初始化完成，输入“假人创建”或“ffpp”');

await playerReady;
world.sendMessage('[模拟玩家] 初始化完成，输入“假人创建”或“ffpp”');
