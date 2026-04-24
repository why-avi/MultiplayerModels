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
    private tickInputs: Map<number, InputPacket[]> = new Map();
    private inputHistory: Map<number, InputPacket> = new Map();
    private peerMinTick: number = 0;
    private lastTickTime: number = 0;
    private lastSendTime: number = 0;
    private resendInterval: number = 100;
    private lsEntitySpeed: number = 20;

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

        const now = +new Date();

        if (now - this.lastSendTime >= this.resendInterval || this.lastSendTime === 0) {
            this.sendInput();
            this.lastSendTime = now;
        }

        const inputs = this.tickInputs.get(this.tick);
        if (inputs && inputs.length >= this.peers.length + 1 && now - this.lastTickTime >= 1000 / this.tickRate) {
            inputs.sort((a, b) => a.entityID - b.entityID);
            inputs.forEach(input => this.state.entities[input.entityID]?.applyInput(input));
            this.tickInputs.delete(this.tick);
            this.tick++;
            this.lastSendTime = 0;
            this.lastTickTime = now;
        }

        this.renderer.draw({entities: {}}, this.state, 0)
    }

    private sendInput(): void {
        if (!this.inputHistory.has(this.tick)) {
            const input = this.localInput.getTickInput(1 / this.tickRate, this.playerID);
            this.inputHistory.set(this.tick, input);
            this.collectInput(this.tick, input);
        }

        const startTick = Math.min(this.peerMinTick, this.tick);
        for (let t = startTick; t <= this.tick; t++) {
            const input = this.inputHistory.get(t);
            if (!input) continue;
            this.peers.forEach(peer =>
                peer.send({type: 'lockstep', payload: {tick: t, inputs: input}}, this.latency));
        }
    }

    private processMessages(): void {
        const messages = this.network.receive();

        for (const message of messages) {
            if (message.type === 'lockstep') {
                this.peerMinTick = Math.max(this.peerMinTick, message.payload.tick);
                this.collectInput(message.payload.tick, message.payload.inputs);
            }
        }
    }

    private collectInput(tick: number, input: InputPacket): void {
        if (tick < this.tick) return;
        if (!this.tickInputs.has(tick)) this.tickInputs.set(tick, []);
        const existing = this.tickInputs.get(tick)!;
        if (!existing.some(i => i.entityID === input.entityID)) existing.push(input);
    }


}