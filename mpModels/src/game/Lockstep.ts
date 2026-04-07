import { GameLoop } from "./GameLoop"
import { Proxy } from "../network/Proxy";
import { InputPacket } from "./Input";
/**
 * Extension of the gameloop class for LockStep Synchronization.
 * Requires command processing and acks from each client before proceeding.
 */

export class LockStep extends GameLoop {
    private peers: Proxy[] = [];
    private tick: number = 0;
    private sentInput: boolean = false;
    private tickInputs: Map<number, InputPacket[]> = new Map();

    constructor(canvas: HTMLCanvasElement) {
        super(canvas)
        this.tickRate = 10;
    }

    update(): void {

    }

    sendInput(): void {

    }

    processMessages(): void {

    }
}