import { ScoreboardObjective, world } from '@minecraft/server';
import ScoreBase from './rw';

class ScoreboardManager {
    initialize() {
        world.scoreboard.getObjective('##FlashPlayer##') || world.scoreboard.addObjective('##FlashPlayer##');

        world.scoreboard
            .getObjective('##FlashPlayer##')
            .hasParticipant('##currentPID') ||
            world.scoreboard.getObjective('##FlashPlayer##').setScore('##currentPID', 1);
    }
}

export default new ScoreboardManager().initialize