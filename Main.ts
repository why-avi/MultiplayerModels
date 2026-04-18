import { LockStep } from './src/game/Lockstep';
import { SnapshotClient } from './src/game/Snapshot/SnapshotClient';
import { SnapshotServer } from './src/game/Snapshot/SnapshotServer';
import { PLAYERS } from './src/game/Constants';
import { SettingsManager } from './src/network/Settings';

const element = (id: string): HTMLCanvasElement => {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Canvas #${id} not found`);
    return el as HTMLCanvasElement;
};

interface Games {
    Snapshot: SnapshotClient[];
    Lockstep: LockStep[];
    Server: SnapshotServer;
}

function init() {
    const Games = initGames(); 
    const settingsManager = new SettingsManager(Games.Snapshot, Games.Lockstep, Games.Server);
    
    for (const client of Games.Snapshot) {
        Games.Server.connect(client);
    }
    Games.Lockstep[0].connect(Games.Lockstep[1])
    Games.Lockstep[1].connect(Games.Lockstep[0])

    // Start the Games!
    function gameLoop() {
        Games.Lockstep.forEach(client => client.update());
        Games.Server.update();
        Games.Snapshot.forEach(client => client.update());
        requestAnimationFrame(gameLoop);
    }
    requestAnimationFrame(gameLoop);
}

function initGames(): Games {
    return {
        Snapshot: PLAYERS.map((_, playerID) => new SnapshotClient(element(`snapshotCanvas${playerID}`), playerID)),
        Lockstep: PLAYERS.map((_, playerID) => new LockStep(element(`lockstepCanvas${playerID}`), playerID)),
        Server: new SnapshotServer(element('serverCanvas'))
    }
}

if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

