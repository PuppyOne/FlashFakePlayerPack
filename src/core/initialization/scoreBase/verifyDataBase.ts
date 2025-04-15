import { world } from '@minecraft/server';

export class PIDManager {
    constructor(private readonly initialValue: number = 1) {}

    initialize(): void {
        if (!world.scoreboard.getObjective('##FlashPlayer##'))
            world.scoreboard.addObjective('##FlashPlayer##');

        if (!world.scoreboard.getObjective('##FlashPlayer##').hasParticipant('##currentPID'))
            world.scoreboard.getObjective('##FlashPlayer##').setScore('##currentPID', this.initialValue);
    }

    next(): number {
        const pid = world.scoreboard.getObjective('##FlashPlayer##').addScore('##currentPID', 1);
        return pid;
    }

    reset(): number {
        const currentPID = world.scoreboard.getObjective('##FlashPlayer##').getScore('##currentPID');
        world.scoreboard.getObjective('##FlashPlayer##').setScore('##currentPID', this.initialValue);
        return currentPID;
    }
}
