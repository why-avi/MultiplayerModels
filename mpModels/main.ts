import { LockStep } from './src/game/Lockstep';
import { SnapshotClient } from './src/game/Snapshot/SnapshotClient';
import { SnapshotServer } from './src/game/Snapshot/SnapshotServer';

const element = (id: string): HTMLCanvasElement => {
    const el = document.getElementById(id);
    if (!el) throw new Error(`Canvas #${id} not found`);
    return el as HTMLCanvasElement;
};


const lockstep0 = new LockStep(element('lockstepCanvas0'), 0);
const lockstep1 = new LockStep(element('lockstepCanvas1'), 1);

lockstep0.connect(lockstep1.network);
lockstep1.connect(lockstep0.network);

const snapshotClient0 = new SnapshotClient(element('snapshotCanvas0'));
const snapshotClient1 = new SnapshotClient(element('snapshotCanvas1'));
const snapshotServer  = new SnapshotServer(element('serverCanvas'));

snapshotServer.connect(snapshotClient0);
snapshotServer.connect(snapshotClient1);

function gameLoop() {
    lockstep0.update();
    lockstep1.update();
    snapshotServer.update();
    snapshotClient0.update();
    snapshotClient1.update();

}