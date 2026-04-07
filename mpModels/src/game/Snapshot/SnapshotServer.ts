import { Proxy } from "../../network/Proxy";
import { Entity } from "../Entity";
import { GameState } from "../GameLoop";
import { Render } from "../Render";
import { SnapshotClient } from "./SnapshotClient";
import { InputPacket } from "../Input";
import { Point2D } from "../Point";
import { NetworkMessage } from "../../network/Proxy";

export interface Snapshot {
    entityID: number;
    location: Point2D;
    lastSequenceNumber: number;
}

export class SnapshotServer {
    private clients: Array<SnapshotClient> = [];
    private tickRate: number = 10;
    private state: GameState = {entities: {}};
    private renderer: Render;
    private lastSequenceNumber: Record<number, number> = {};
    
    public network: Proxy = new Proxy();

    constructor(canvas: HTMLCanvasElement) {
        this.renderer = new Render(canvas, {interpolation: false}, -1);
    }
 
    // Connect a client to this server.
    connect(client: SnapshotClient) {
        const clientID = this.clients.length;
        client.setID(clientID)
        client.setServer(this.network);
        client.setTickRate(this.tickRate);
        this.clients.push(client);

        // Create a new entity with the same ID as the connected client.
        const entity = new Entity(clientID);
        this.state.entities[clientID] = entity;
    }

    setTickRate(rate: number) {
        this.tickRate = rate;
    }

    update() {
        this.processMessages();
        this.sendGameState();
        this.renderer.draw({entities: {}}, this.state, 0);
    }

    // Process inputs sent from the clients
    processMessages() {
        // Get the messages in the buffer.
        const messages = this.network.receive();
        
        if (!messages) return; // Stop the process if there are no messages.

        for (let i = 0; i < messages.length; i++) {
            const message = messages[i];
            // Make sure the message is what we're expecting and verify it looks valid.
            if (message.type === 'inputPacket' && this.validateInput(message.payload)){
                // ADD LOGGING HERE
                const id = message.payload.entityID;
                this.state.entities[id].applyInput(message.payload);
                this.lastSequenceNumber[id] = message.payload.sequenceNumber;
            }
        }
    }

    // Validate input
    validateInput(input: InputPacket) {
        if (Math.abs(input.pressTime) > 2 / this.tickRate) return false;
        return true;
    }
    
    // Send game state to clients
    sendGameState(){
        // Create an array holding the state of each entity to send
        let snapshot: Snapshot[] = [];

        Object.values(this.state.entities).forEach((entity) => {
            snapshot.push({
                entityID: entity.id,
                location: entity.location,
                lastSequenceNumber: this.lastSequenceNumber[entity.id]
            });
        })
        const message: NetworkMessage = {type: 'snapshot', payload: snapshot}

        // Send game state snapshot to each client.        
        for (let i = 0; i < this.clients.length; i++) {
            this.clients[i].network.send(message, this.clients[i].latency);
        }
    }
}