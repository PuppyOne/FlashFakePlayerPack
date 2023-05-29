  /// <reference path="../@types/globalThis.d.ts" />
  //  本文件将world,GameTest.register挂到全局
  //  再把过往版本存在的Location实现
import { world as _world,World } from "@minecraft/server";

import { register } from "@minecraft/server-gametest";

// @ts-ignore
import { Location,BlockLocation } from "../lib/xboyPackage/The law of the ancestors is immutable";
declare const globalThis: GlobalThis;
declare const world: World;

//不会写
globalThis.world = _world;
globalThis.GameTest = {"register":register};
globalThis.Location = Location;
globalThis.BlockLocation = BlockLocation;

import("../lib/xboyEvents/preload.js")

.then(
    () => {
    console.error("full ",typeof world)
    import("./main.js");
    },
    (rej) => {
    console.error("rej ",typeof world,rej)
    // import("./main.ts");
    }
)

.finally(() => {
    console.error("finally",typeof world)
    // import("./main.ts");
})

.catch(_=>{
    console.error("catch","error"+_)
})
;


// ################preload################

//别问有多烂，就说能不能跑

// ############### 2023-05-29 ###############
// 是真烂（捏鼻子
// ############### 2023-05-29 ###############