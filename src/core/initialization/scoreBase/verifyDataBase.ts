import { ScoreboardObjective, world } from '@minecraft/server';
import ScoreBase from './rw';

const verify = function () {
    world.scoreboard.getObjective('##FlashPlayer##') || world.scoreboard.addObjective('##FlashPlayer##')

    world.scoreboard
        .getObjective('##FlashPlayer##')
        .hasParticipant('##currentPID') ||
        world.scoreboard.getObjective('##FlashPlayer##').setScore('##currentPID', 1);
};

export default verify;
