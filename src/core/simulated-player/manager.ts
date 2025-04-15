import { LocationOutOfWorldBoundariesError, system, world, type Dimension, type Vector3 } from "@minecraft/server";
import { PIDManager, type PID } from "../pid";
import { Test, type SimulatedPlayer } from "@minecraft/server-gametest";
import SIGN from "../../constants/YumeSignEnum";
import { SimulatedPlayerNotFoundError, UninitializedError } from "./errors";
import type { AddSimulatedPlayerOptions } from "./types";

const overworld = world.getDimension('overworld');

export class SimulatedPlayerManager {
    private readonly initialSigns = [
        SIGN.YUME_SIM_SIGN,
        SIGN.AUTO_RESPAWN_SIGN
    ] as const;

    private _test: Test | null = null;
    private _initialized = false;

    private _pidToSimulatedPlayer = new Map<PID, SimulatedPlayer>();
    private _idToPid = new Map<string, PID>();

    constructor(public readonly pidManager: PIDManager = new PIDManager()) {}

    set test(test: Test) {
        this._test = test;
    }

    initialize() {//test 独立出单独方法？
        // 记分板PID初始化
        this.pidManager.initialize();

        const z = 11451400 + Math.floor(Math.random() * 114514 * 19);
        system.run(() => {
            try {
                overworld.runCommand(`execute positioned 15000000 256 ${z} run gametest run 我是云梦:假人`);
                this._initialized= true;
            } catch (e) {
                world.sendMessage('[模拟玩家] 报错了，我也不知道为什么' + e);
            }
        });
    }

    get ready(): boolean {
        return this._initialized && Boolean(this._test)
    }

    get simulatedPlayers(): Map<PID, SimulatedPlayer> {
        return this._pidToSimulatedPlayer;
    }

    get simulatedPlayerIdToPidMap(): Map<string, PID> {
        return this._idToPid;
    }

    private generateName(pid: PID) {
        return `工具人-${pid}`;
    }

    private spawn(location: Vector3, dimension: Dimension, name: string): SimulatedPlayer {
        const simulatedPlayer = this._test!.spawnSimulatedPlayer({ x: 0, y: 8, z: 0 }, name);
        simulatedPlayer.addTag('init');
        this.initialSigns.forEach(sign => simulatedPlayer.addTag(sign));
        try {
            //@ts-ignore
            simulatedPlayer.setSpawnPoint({ ...location, dimension });
            //@ts-ignore
            simulatedPlayer.teleport(location, { dimension });
        } catch (e) {
            if (e instanceof LocationOutOfWorldBoundariesError) {
                console.warn('[模拟玩家] 有东西尝试在非法位置生成假人，已阻止');
                simulatedPlayer.disconnect();
            } else {
                throw e;
            }
        }

        return simulatedPlayer;
    }

    add({ name, location, dimension }: AddSimulatedPlayerOptions) {
        console.log(this._initialized,this._test);
        
        if (!this.ready)
            throw new UninitializedError('call initialize() first');//改名

        const pid = this.pidManager.next();
        name ??= this.generateName(pid);

        const simulatedPlayer = this.spawn(location, dimension, name);

        this._pidToSimulatedPlayer.set(pid, simulatedPlayer);
        this._idToPid.set(simulatedPlayer.id, pid);
    }

    get(pid: PID): SimulatedPlayer | undefined;
    get(id: string): SimulatedPlayer | undefined;
    get(idOrPID: PID | string): SimulatedPlayer | undefined {
        if (typeof idOrPID === 'number') {
            return this._pidToSimulatedPlayer.get(idOrPID);
        } else {
            const pid = this.getPID(idOrPID);
            if (pid === undefined) return undefined;
            return this._pidToSimulatedPlayer.get(pid);
        }
    }

    has(pid: PID): boolean;
    has(id: string): boolean;
    has(simulatedPlayer: SimulatedPlayer): boolean;
    has(target: PID | string | SimulatedPlayer): boolean {
        if (typeof target === 'number')
            return this._pidToSimulatedPlayer.has(target);
        else if (typeof target === 'string')
            return this._idToPid.has(target);

        return this._idToPid.has(target.id);
    }

    getPID(id: string): PID | undefined {
        return this._idToPid.get(id);
    }

    remove(pid: PID): void;
    remove(simulatedPlayer: SimulatedPlayer): void;
    remove(pidOrSimulatedPlayer: PID | SimulatedPlayer): void {
        let pid: PID | undefined;
        let simulatedPlayer: SimulatedPlayer | undefined;

        if (typeof pidOrSimulatedPlayer === 'number') {
            pid = pidOrSimulatedPlayer;
            simulatedPlayer = this.get(pidOrSimulatedPlayer);
        } else {
            simulatedPlayer = pidOrSimulatedPlayer;
            pid = this.getPID(simulatedPlayer.id);
        }

        if (!simulatedPlayer || !pid)
            throw new SimulatedPlayerNotFoundError('SimulatedPlayer not found');

        simulatedPlayer.disconnect();

        this._idToPid.delete(simulatedPlayer.id);
        this._pidToSimulatedPlayer.delete(pid);
    }
}
