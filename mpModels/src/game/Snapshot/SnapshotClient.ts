import { GameLoop } from "../GameLoop";
import { SnapshotServer } from "./SnapshotServer"
import { Input, InputPacket } from "../Input";
import { Proxy } from "../../network/Proxy";
import { Entity } from "../Entity";
import { cloneDeep } from 'lodash';

/** 
 * Extension of gameloop class for snapshot synchronization.
 * Clients update entitiy positions according to the authoritative server. Inputs are applied
 * to player entities and sent to authoritative server. If interpolation is enabled, entities are moved using
 * the difference between two positions.
 */


export class SnapshotClient extends GameLoop {
    private timestamp_last: number = 0;
    public server!: Proxy;

    // Optional Snapshot settings
    private prediction: boolean = false;
    private reconciliation: boolean = false;
    private interpolation: boolean = false;
    private serverPositions: boolean = false;

    // Optional Snapshot settings required variables
    private inputSequence: number = 0;

    constructor(canvas: HTMLCanvasElement){
        super(canvas);

    }


    update() {
        this.oldState = cloneDeep(this.state);
        // Process server messages
        this.processMessages();

        // Check for server connection.
        if (!this.server) {
            return;
        }

        // Process local inputs
        this.processInput();

        // Interpolate non-owned entities.
        if (this.interpolation) this.interpolateEntities();

        this.renderer.draw(this.oldState, this.state, 1);
    }

    processInput() {
        const timestamp_now = +new Date();
        const timestamp_last = this.timestamp_last || timestamp_now;
        const timestamp_delta = (timestamp_now - timestamp_last) / 1000.0;
        this.timestamp_last = timestamp_now;

        // Record input with current delta time.
        const input = this.localInput.getTickInput(timestamp_delta, this.playerID);

        // Send input to server and iterate sequence.
        this.server.send({type: 'inputPacket', payload: input}, this.latency);
        // Client-side prediction
        if (this.prediction) this.state.entities[this.playerID].applyInput(input);

        // Save input for reconciliation.
        this.pendingInputs.push(input);
    }
    
    processMessages() {
        // Loop through entities sent by server and apply their location to local entities.
        const messages = this.network.receive();
        
        if (!messages) return; // Stop the process if ther are no messages.
        
        for (const message of messages) {

            if (message.type === 'snapshot') { 
                const snapshot = message.payload;
                
                for (const snapEntity of snapshot) {
                    // Add a representation of an entity if it doesn't already exist.
                    if (!this.state.entities[snapEntity.entityID]) {
                        const entity = new Entity(snapEntity.entityID);
                        this.state.entities[entity.id] = entity;
                    }

                    const entity = this.state.entities[snapEntity.entityID];
                    entity.setServerLocation(snapEntity.location);

                    if (entity.id === this.playerID) { // Process for this player's entity.
                        // Official location of this player's entity received, set.
                        this.state.entities[this.playerID].setLocation(snapEntity.location);

                        // Server reconciliation process.
                        // Execute all inputs that have been stored in the buffer starting from the 
                        //  last input the server has processed.
                        if (this.reconciliation) { 
                            let k = 0;
                            // Delete all buffered inputs that the server has reported as processed.
                            this.pendingInputs = this.pendingInputs.filter(input => input.sequenceNumber > snapEntity.lastSequenceNumber);
                            // Apply the leftover inputs.
                            for (const input of this.pendingInputs) {
                                entity.applyInput(input);
                            }
                        } else this.pendingInputs = []; // No reconcilliaton so drop the saved inputs.
                    } else { // Process for other entities.
                        
                        if (!this.interpolation) {
                            // No interpolation, simply set the new location.
                            entity.setLocation(snapEntity.location);
                        } else {
                            // Entity interpolation enabled, send location and timestamp to buffer.
                            const timestamp = +new Date();
                            entity.addToLocationBuffer([timestamp, snapEntity.location])
                        }
                    }
                }
            }
        } 
    }

    interpolateEntities() {
        // Move entities between two locations sent by the server that were stored in a buffer.
        
        const now = +new Date();
        const renderTimestamp = now - (1000.0 / this.tickRate);

        for (const i in this.state.entities) {
            const entity = this.state.entities[i];

            // Do not interpolate this player's entity
            if (entity.id == this.playerID) continue;

            const buffer = entity.getBuffer();

            if (buffer.length >= 2 && buffer[0][0] <= renderTimestamp && renderTimestamp <= buffer[1][0]) {
                const time0 = buffer[0][0];
                const time1 = buffer[1][0];
                const loc0  = buffer[0][1];
                const loc1  = buffer[1][1];

                const time = (renderTimestamp - time0) / (time1 - time0);

                entity.location.x = loc0.x.add(loc1.x.sub(loc0.x).mul(time));
                entity.location.y = loc0.y.add(loc1.y.sub(loc0.y).mul(time));

                entity.saveInterpLocation(loc0, loc1); 
            } else {
                entity.saveInterpLocation(null, null);
            }

        }
    }

    setServer(server: Proxy) {
        this.server = server;
    }


}