import { type Player, system,type Vector3, world} from "@minecraft/server"
import EventSignal from "./EventSignal";
import type { playerReadyAfterEventSignal } from "../../@types/globalThis";



// EventSignal
export const playerReady:playerReadyAfterEventSignal = new EventSignal<undefined>()
// console.error(JSON.stringify(world.getAllPlayers()[0].getViewDirection()))

const playerViewYMap = new Map<Player, number>()

const update = ()=>{
    const playerList = world.getAllPlayers()
          playerList.forEach(player=>{
              const {y: currentViewY} = player.getViewDirection()
              
              const storedViewY = playerViewYMap.get(player)
              
              if(storedViewY===undefined)
                // set to Map
            return playerViewYMap.set(player, currentViewY)
            
            if(storedViewY==currentViewY)
                // nothing
                return
            
            // update to Map && Event-trigger
            playerViewYMap.set(player, currentViewY)
              playerReady.trigger(undefined)

              system.clearRun(id)
          })
}

// export default  playerMove

const id=system.runInterval(update,4)
