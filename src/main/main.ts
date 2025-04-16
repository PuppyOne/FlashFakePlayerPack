// -302 65 -1556
import tpsShower  from '../core/tps/tpsShower';


import "../main.js";
import { world, system } from "@minecraft/server";
const overworld = world.getDimension("overworld");
const nether = world.getDimension("nether");
const the_end = world.getDimension("the end");
const nowTimeTemp    = new Date().getDate() +"日"+ new Date().getHours() +"时"+ new Date().getMinutes() +"分"+ new Date().getSeconds() +"秒"

// world.events.reloadFromCmd.subscribe(()=>{
//        console.error("你没事reload干嘛呢？")
//        overworld.runCommand("me 你没事reload干嘛呢？")
// })

system.runInterval(
       () => {
              tpsShower()
              // let i = overworld.runCommandAsync("list")
              // overworld.runCommandAsync("me "+JSON.stringify(i))
              // overworld.runCommandAsync("me #########")
       }
);//笑死，祖传代码-2023-5-31


// 🟧🟧🟧🟧🟧🟧🟧🟧
// 🟧🟧🟧🟧🟧🟧🟧🟧
// 🟧🟧🟧🟧🟧🟧🟧🟧
// ⬛️⬛️🟧🟧🟧🟧⬛️⬛️
// 🟧🟧⬜️⬛️⬛️⬜️🟧🟧
// ⬜️⬜️⬜️⬜️⬜️⬜️⬜️⬜️



