import { GameConstructor, GameLoop } from "../gameloop";
import { SnapshotServer } from "./SnapshotServer"
import { Input } from "../input";
/** 
 * Extension of gameloop class for snapshot synchronization.
 * Clients update entitiy positions according to the authoritative server. Inputs are applied
 * to player entities and sent to authoritative server. If interpolation is enabled, entities are moved using
 * the difference between two positions.
 */

export interface SnapshotConstructor extends GameConstructor {
    server: SnapshotServer | null;
    prediction: boolean;
    reconciliation: boolean;
    pendingInputs: [];
    inputSequence: number;
    interpolation: boolean;
    serverPositions: boolean;
}

export class SnapshotLoop extends GameLoop {
    private server: SnapshotServer | null; // Authoritative Server

    // Optional Snapshot settings
    private prediction: boolean;
    private reconciliation: boolean;
    private interpolation: boolean;
    private serverPositions: boolean;

    // Optional Snapshot settings required variables
    private pendingInputs: Input[];
    private inputSequence: number;

    constructor({playerID, tickRate, state, renderer, localInput, network}:SnapshotConstructor) {
        super({playerID, tickRate, state, renderer, localInput, network});
        this.server = null;
        this.prediction = false;
        this.reconciliation = false;
        this.interpolation = false;
        this.serverPositions = false;
        this.pendingInputs = [];
        this.inputSequence = 0;

    }

    setTickRate(rate: number) {

    }

    update() {

    }

    processInput() {

    }
    
    processMessages() {

    }

    inerpolateEntities() {

    }
}