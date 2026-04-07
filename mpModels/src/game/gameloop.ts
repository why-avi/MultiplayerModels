import { Entity } from "./Entity";
import { Input, InputPacket } from "./Input";
import { Render } from "./Render";
import { Proxy } from "../network/Proxy";
/**
 * Base gameloop class. Processes inputs by recording their press time 
 *  
 */

export interface GameState {
    entities: Record<number, Entity>;
}

export abstract class GameLoop {
    public playerID: number = -1;
    protected tickRate: number = 0;
    protected state: GameState = {entities: {}};
    protected oldState: GameState = {entities: {}};
    protected renderer: Render;
    protected localInput!: Input;
    protected pendingInputs: Array<InputPacket> = [];
    
    public network: Proxy = new Proxy();
    public latency: number = 10; // MS delay in communication

    abstract update(): void

    constructor(canvas: HTMLCanvasElement) {
        this.renderer = new Render(canvas, {interpolation: false}, this.playerID);
    }

    setTickRate(rate: number) {
        this.tickRate = rate;
    }

    setID(id: number) {
        this.playerID = id;
        this.renderer.localID = id;
        this.localInput = new Input(id);
    }

}
