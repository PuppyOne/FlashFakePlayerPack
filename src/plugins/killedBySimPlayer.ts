import type { Player } from '@minecraft/server';
import entityDeadByHurt from '../lib/xboyEvents/entityDeadByHurt'
import { simulatedPlayerManager } from './main';

entityDeadByHurt.subscribe(({ damageSource: { damagingEntity }, deadEntity }) => {
    if (deadEntity.typeId !== 'minecraft:player' || damagingEntity.typeId !== 'minecraft:player') return;

    if (!(simulatedPlayerManager.get(deadEntity.id) || simulatedPlayerManager.get(damagingEntity.id))) return;//TODO: 考虑has

    (<Player>damagingEntity).sendMessage('玩不起，就别玩');
    (<Player>deadEntity).sendMessage('菜，就多练');
});