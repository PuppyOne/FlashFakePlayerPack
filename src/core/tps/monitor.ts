import { system } from "@minecraft/server";

export class TPSMonitor {
    private calculatedTPS: number = 0;
    private tpsCount: number = 0;
    private currentSeconds: number | undefined;
    private runId: number | undefined;

    on(): boolean {
        if (this.runId) return false;

        this.runId = system.runInterval(() => this.update());
        return true;
    }

    off(): boolean {
        if (!this.runId) return false;

        system.clearRun(this.runId);
        this.runId = undefined;
        return true;
    }

    get tps(): number {
        return this.calculatedTPS;
    }

    private update(): void {
        this.tpsCount++;

        if (new Date().getSeconds() === this.currentSeconds) return;

        this.currentSeconds = new Date().getSeconds();
        this.calculatedTPS = this.tpsCount;
        this.tpsCount = 0;
    }
}