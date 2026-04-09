import { GameLoop } from "./GameLoop"
import { Proxy } from "../network/Proxy";
import { InputPacket } from "./Input";
import { Entity } from "./Entity";
/**
 * Extension of the gameloop class for LockStep Synchronization.
 * Requires command processing and acks from each client before proceeding.
 */

export class LockStep extends GameLoop {
    private peers: Proxy[] = [];
    private tick: number = 0;
    private sentInput: boolean = false;
    private tickInputs: Map<number, InputPacket[]> = new Map();

    constructor(canvas: HTMLCanvasElement, id: number) {
        super(canvas, id)
        this.state.entities[this.playerID] = new Entity(this.playerID)
    }

    public connect(peer: LockStep): void {
        this.peers.push(peer.network);
        if (!this.state.entities[peer.playerID]){
            const entity = new Entity(peer.playerID);
            this.state.entities[peer.playerID] = entity;
        }
    }

    update(): void {
        this.processMessages();

        if (!this.sentInput) {
            this.sendInput();
            this.sentInput = true;
        }

        const inputs = this.tickInputs.get(this.tick);
        if (inputs && inputs.length >= this.peers.length + 1) {
            inputs.sort((a, b) => a.entityID - b.entityID);
            inputs.forEach(input => this.state.entities[input.entityID]?.applyInput(input));
            this.tickInputs.delete(this.tick);
            this.tick++;
            this.sentInput = false;
        }

        this.renderer.draw({entities: {}}, this.state, 0)
    }

    private sendInput(): void {
        const input = this.localInput.getTickInput(1 / this.tickRate, this.playerID);

        this.collectInput(this.tick, input);

        this.peers.forEach(peer => 
            peer.send({type: 'lockstep', payload: {tick: this.tick, inputs: input}},
                 this.latency));
    }

    private processMessages(): void {
        const messages = this.network.receive();

        for (const message of messages) {
            if (message.type === 'lockstep')
                this.collectInput(message.payload.tick, message.payload.inputs);
        }
    }

    private collectInput(tick: number, input: InputPacket): void {
        if (!this.tickInputs.has(tick)) this.tickInputs.set(tick, []);
        this.tickInputs.get(tick)!.push(input);
    }


}