import { InputPacket } from "../game/input";
import { Snapshot } from "../game/Snapshot/SnapshotServer";
/**
 * Message queue that with simulated latency and packet loss. Payload messages
 * may contain information for either snapshot or lockstep sync models.
 */

interface Message {
    payload: NetworkMessage
    arrivalTime: number;
}

export type NetworkMessage = 
| { type: 'inputPacket'; payload: InputPacket }
| { type: 'snapshot';   payload:  Snapshot };

export class Proxy {
    private messages: Message[];   
    private lossRate: number; // Number between 0 and 1 representing percent of dropped packets.

    constructor() {
        this.messages = [];
        this.lossRate = 0; // Default to no lost packets.
    }

    // Takes a message from an authoritative server or fellow client and store in a queue.
    send(message: NetworkMessage, latency: number) {
        // Exits process if this packet is "lost"
        if (Math.random() < this.lossRate) return;
        this.messages.push({
            payload: message,
            arrivalTime: +new Date() + latency,
        });
    }

    // Return latest messages that have "arrived"
    receive() {
        const now = +new Date();
        const arrived = this.messages.filter(message => message.arrivalTime <= now);
        this.messages = this.messages.filter(message => message.arrivalTime > now);
        return arrived.map(message => message.payload);
    }

    // Change the packet loss rate setting.
    setLossRate(rate: number) {
        this.lossRate = rate;
    }
}