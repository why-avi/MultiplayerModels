import { Proxy } from "../../network/Proxy";
import { Entity } from "../Entity";
import { GameState } from "../GameLoop";
import { Render } from "../Render";
import { SnapshotClient } from "./SnapshotClient";
import { InputPacket } from "../Input";
import { Point2D } from "../Point";
import { NetworkMessage } from "../../network/Proxy";
import { DEFAULT_SETTINGS } from "../Constants";
import { cloneDeep } from "lodash";

export interface Snapshot {
    entityID: number;
    location: Point2D;
    lastSequenceNumber: number;
}

export class SnapshotServer {
    private clients: Array<SnapshotClient> = [];
    private tickRate: number = DEFAULT_SETTINGS.global.tickRate;
    private state: GameState = {entities: {}};
    private renderer: Render;
    private lastSequenceNumber: Record<number, number> = {};
    private lastSend: number = 0;
    
    public network: Proxy = new Proxy();

    constructor(canvas: HTMLCanvasElement) {
        this.renderer = new Render(canvas, {interpolation: false}, -1);
    }
 
    // Connect a client to this server.
    public connect(client: SnapshotClient): void {
        if (this.clients[client.playerID]) return;

        client.setServer(this.network);
        this.clients.push(client);
        
        // Create a new entity with the same ID as the connected client.
        const entity = new Entity(client.playerID);
        this.state.entities[client.playerID] = entity;
    }

    public setTickRate(rate: number): void {
        this.tickRate = rate;
    }

    public update(): void {
        this.processMessages();

        const now = +new Date();
        if (now - this.lastSend >= 1000 / this.tickRate) {
            this.sendGameState();
            this.lastSend = now;
        }
        this.renderer.draw({entities: {}}, this.state, 0);
    }

    // Process inputs sent from the clients
    private processMessages(): void {
        // Get the messages in the buffer.
        const messages = this.network.receive();
        
        if (!messages) return; // Stop the process if there are no messages.

        for (const message of messages) {
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
    private validateInput(input: InputPacket): boolean {
        if (Math.abs(input.pressTime) > 2 / this.tickRate) return false;
        return true;
    }
    
    // Send game state to clients
    private sendGameState(): void {
        // Create an array holding the state of each entity to send
        let snapshot: Snapshot[] = [];

        Object.values(this.state.entities).forEach((entity) => {
            snapshot.push({
                entityID: entity.id,
                location: cloneDeep(entity.location),
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