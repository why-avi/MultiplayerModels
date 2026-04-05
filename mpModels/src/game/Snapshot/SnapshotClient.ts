import { GameLoop } from "../GameLoop";
import { SnapshotServer } from "./SnapshotServer"
import { Input, InputPacket } from "../Input";
import { Proxy } from "../../network/Proxy";
import { Entity } from "../Entity";
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
        if (this.prediction) this.state.entities[this.playerID].applyInput(input);

        // Save input for reconciliation.
        this.pendingInputs.push(input);
    }
    
    processMessages() {
        // Loop through entities sent by server and apply their location to local entities.
        const messages = this.network.receive();
        
        if (!messages) return; // Stop the process if ther are no messages.
        const messageCount =  messages.length;
        
        for (let i = 0; i < messageCount; i++) {
            const message = messages[i];

            if (message.type === 'snapshot') { 
                const snapshot = message.payload;
                
                // Add a representation of an entity if it doesn't already exist.
                if (!this.state.entities[snapshot[i].entityID]) {
                    const entity = new Entity(snapshot[i].entityID);
                    this.state.entities[entity.id] = entity;
                }

                const entity = this.state.entities[snapshot[i].entityID];
                entity.setServerLocation(entity.location);

                if (entity.id === this.playerID) { // Process for this player's entity.
                    // Official location of this player's entity received, set.
                    this.state.entities[this.playerID].setLocation(entity.location);

                    // Server reconciliation process.
                    // Execute all inputs that have been stored in the buffer starting from the 
                    //  last input the server has processed.
                    if (this.reconciliation) { 
                        let j = 0;
                        // Delete all buffered inputs that the server has reported as processed.
                        this.pendingInputs = this.pendingInputs.filter(input => input.sequenceNumber <= snapshot[i].lastSequenceNumber);
                        // Apply the leftover inputs.
                        while (j < this.pendingInputs.length) {
                            const input = this.pendingInputs[j];
                            entity.applyInput(input);
                            j++;
                        }
                    } else this.pendingInputs = []; // No reconcilliaton so drop the saved inputs.
                } else { // Process for other entities.
                    
                    if (!this.interpolation) {
                        // No interpolation, simply set the new location.
                        entity.setLocation(snapshot[i].location);
                    } else {
                        // Entity interpolation enabled, send location and timestamp to buffer.
                        const timestamp = +new Date();
                        entity.addToLocationBuffer([timestamp, snapshot[i].location])
                    }
                }
            }

        } 
    }

    inerpolateEntities() {
        // Move entities between two locations sent by the server that were stored in a buffer.
        
    }

    setServer(server: Proxy) {
        this.serverProxy = server;
    }


}