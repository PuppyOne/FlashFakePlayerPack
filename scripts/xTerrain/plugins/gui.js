﻿import { system, world } from '@minecraft/server';
import SIGN, { BEHAVIOR, BEHAVIOR_LIST, BEHAVIOR_ZH, exeBehavior, SIGN_TAG_LIST, SIGN_ZH } from "../../lib/xboyPackage/YumeSignEnum";
import { ActionFormData } from "@minecraft/server-ui";
import { getSimPlayer } from "../../lib/xboyPackage/Util";
world.beforeEvents.itemUse.subscribe(e => {
    const { source: player } = e;
    if (!player || player.typeId !== "minecraft:player")
        return;
    const SimPlayer = getSimPlayer.formView(player);
    if (!SimPlayer)
        return;
    e.cancel = true;
    player.isSneaking
        ?
            system.run(() => {
                const mng = new ActionFormData().title('标签管理（金色为启用）');
                mng.body('#x#').body(SimPlayer.nameTag);
                for (const signKey of SIGN_TAG_LIST) {
                    mng.button((SimPlayer.hasTag(signKey) ? '§l§e' : '§l§1') + SIGN_ZH[SIGN[signKey]]);
                }
                mng.show(player).then((response) => {
                    const tag = SIGN_TAG_LIST[response.selection];
                    SimPlayer.hasTag(tag) ? SimPlayer.removeTag(tag) : SimPlayer.addTag(tag);
                });
            })
        :
            system.run(() => {
                const mng = new ActionFormData().title('功能');
                mng.body('#x#').body(SimPlayer.nameTag);
                for (const behavior of BEHAVIOR_LIST) {
                    mng.button((SimPlayer.hasTag(behavior) ? '§l§e' : '§l§1') + BEHAVIOR_ZH[BEHAVIOR[behavior]]);
                }
                mng.show(player).then((response) => {
                    const behavior = BEHAVIOR_LIST[response.selection];
                    exeBehavior(behavior)(SimPlayer, player);
                });
            });
});