import { GameLoop } from "../GameLoop";
import { SnapshotServer } from "./SnapshotServer"
import { Input, InputPacket } from "../Input";
import { Proxy } from "../../network/Proxy";
/** 
 * Extension of gameloop class for snapshot synchronization.
 * Clients update entitiy positions according to the authoritative server. Inputs are applied
 * to player entities and sent to authoritative server. If interpolation is enabled, entities are moved using
 * the difference between two positions.
 */


export class SnapshotClient extends GameLoop {
    public serverProxy!: Proxy; // Authoritative Server
    private timestamp_last: number = 0;

    // Optional Snapshot settings
    private prediction: boolean = true;
    private reconciliation: boolean = false;
    private interpolation: boolean = false;
    private serverPositions: boolean = false;

    // Optional Snapshot settings required variables
    private inputSequence: number = 0;

    constructor(canvas: HTMLCanvasElement){
        super(canvas)
    }


    update() {
        // Process server messages
        this.processMessages();

        // Check for server connection.
        if (!this.serverProxy) {
            return;
        }

        // Process local inputs
        this.processInput();

        // Interpolate non-owned entities.
        if (this.interpolation) this.inerpolateEntities();
    }

    processInput() {
        const timestamp_now = +new Date();
        const timestamp_last = this.timestamp_last || timestamp_now;
        const timestamp_delta = (timestamp_now - timestamp_last) / 1000.0;
        this.timestamp_last = timestamp_now;

        // Record input with current delta time.
        const input = this.localInput.getTickInput(timestamp_delta, this.playerID);

        // Send input to server and iterate sequence.
        this.serverProxy.send({type: 'inputPacket', payload: input}, this.latency);
        // Client-side prediction

        // Save input for reconciliation.
    }
    
    processMessages() {

        // Loop through entities sent by server and apply their location to local entities.

    }

    inerpolateEntities() {
        // Move entities between two locations sent by the server that were stored in a buffer.

    }

    setServer(server: Proxy) {
        this.serverProxy = server;
    }


}