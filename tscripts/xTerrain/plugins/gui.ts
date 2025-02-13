import { Player, system, world } from '@minecraft/server'
import SIGN, {
    BEHAVIOR,
    BEHAVIOR_LIST,
    BEHAVIOR_ZH,
    exeBehavior,
    SIGN_TAG_LIST,
    SIGN_ZH
} from '../../lib/xboyPackage/YumeSignEnum'
import { ActionFormData, ModalFormData } from '@minecraft/server-ui'
import { SimulatedPlayer } from '@minecraft/server-gametest'
import { simulatedPlayers } from '../main'

// world.afterEvents.entityHitEntity.subscribe(({damagingEntity,hitEntity})=>{
//     if(!damagingEntity || !hitEntity)return;
//     if(!hitEntity.hasTag(SIGN.YUME_SIM_SIGN))return;
//     world.sendMessage(''+damagingEntity.typeId+' '+(hitEntity.typeId))
//     new ActionFormData().body('#x#').button('喵？')
//         .show(damagingEntity)
// })


world.beforeEvents.playerInteractWithEntity.subscribe(e=>{
    const {player,target} = e
    if(!player || player.typeId!=='minecraft:player')return
    if(!target || target.typeId!=='minecraft:player' || !simulatedPlayers[target.id])return// world.sendMessage('meow~ target');
    const SimPlayer = <SimulatedPlayer><unknown>target // what's unknow?
    if(!SimPlayer)return
    e.cancel=true

    const tagManager = ()=>{
        const mng = new ModalFormData().title('标签管理')
        // mng.('#x#').body(SimPlayer.nameTag)//.button('喵？');

        for (const signKey of SIGN_TAG_LIST) {
            mng.toggle(SIGN_ZH[SIGN[signKey]], SimPlayer.hasTag(signKey))
            // world.sendMessage('#tag=>'+signKey);
        }
        // @ts-ignore
        mng.show(<Player>player).then((response) => {
            SIGN_TAG_LIST.forEach((signKey, index) => {
                if (response.formValues[index] && !SimPlayer.hasTag(signKey))
                    SimPlayer.addTag(signKey);
                else if (!response.formValues[index] && SimPlayer.hasTag(signKey))
                    SimPlayer.removeTag(signKey);
            })
        },()=>0).catch(()=>0)
    }

    const behavior = ()=>{
        const mng = new ActionFormData()
            .title('功能')
            .body('#x#').body(SimPlayer.nameTag)

        for (const behavior of BEHAVIOR_LIST)
            mng.button((SimPlayer.hasTag(behavior)?'§l§e':'§l§1') + BEHAVIOR_ZH[BEHAVIOR[behavior]])

        // @ts-ignore
        mng.show(<Player>player).then((response) => {
            const behavior = BEHAVIOR_LIST[response.selection]
            exeBehavior(behavior)(SimPlayer,player)
        },()=>0).catch(()=>0)
    }

    system.run(player.isSneaking?tagManager:behavior)

})