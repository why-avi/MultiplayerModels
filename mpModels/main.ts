
import { LockStep } from './src/game/Lockstep.js';
import { SnapshotClient } from './src/game/Snapshot/SnapshotClient.js';
import { SnapshotServer } from './src/game/Snapshot/SnapshotServer.js';



const element = (id: string): HTMLCanvasElement => {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Element #${id} not found`);
    return element as HTMLCanvasElement;
};

const lockstep0 = new LockStep(element('lockstepCanvas0'));
const lockstep1 = new LockStep(element('lockstepCanvas1'));

lockstep0.connect(lockstep1.network);
lockstep1.connect(lockstep0.network);

const snapshotClient0 = new SnapshotClient(element('snapshotCanvas0'));
const snapshotClient1 = new SnapshotClient(element('snapshotCanvas1'));
const snapshotServer = new SnapshotServer(element('serverCanvas'));

snapshotServer.connect(snapshotClient0);
snapshotServer.connect(snapshotClient1);
