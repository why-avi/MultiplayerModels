import { InputPacket } from "../game/Input";
import { Snapshot } from "../game/Snapshot/SnapshotServer";
/**
 * Message queue that with simulated latency and packet loss. Payload messages
 * may contain information for either snapshot or lockstep sync models.
 */

interface Message {
    payload: NetworkMessage
    arrivalTime: number;
}

interface LockstepTick {
    tick: number;
    inputs: InputPacket;
}

export type NetworkMessage = 
| { type: 'inputPacket'; payload: InputPacket }
| { type: 'snapshot';   payload:  Snapshot[] }
| { type: 'lockstep';   payload:  LockstepTick };

export class Proxy {
    private messages: Message[];   
    public lossRate: number = 0; // Number between 0 and 1 representing percent of dropped packets.

    constructor() {
        this.messages = [];
    }

    // Takes a message from an authoritative server or fellow client and store in a queue.
    public send(message: NetworkMessage, latency: number): void {
        // Exits process if this packet is "lost"
        if (Math.random() < this.lossRate / 100) return;
        this.messages.push({
            payload: message,
            arrivalTime: +new Date() + latency,
        });
    }

    // Return latest messages that have "arrived"
    public receive(): Array<NetworkMessage> {
        const now = +new Date();
        const arrived = this.messages.filter(message => message.arrivalTime <= now);
        this.messages = this.messages.filter(message => message.arrivalTime > now);
        return arrived.map(message => message.payload);
    }

    // Change the packet loss rate setting.
    public setLossRate(rate: number): void {
        this.lossRate = rate;
    }
}