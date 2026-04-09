import { Entity } from "./Entity";
import { Input, InputPacket } from "./Input";
import { Render } from "./Render";
import { Proxy } from "../network/Proxy";
import { DEFAULT_SETTINGS } from "./Constants";
/**
 * Base gameloop class. Processes inputs by recording their press time 
 *  
 */

export interface GameState {
    entities: Record<number, Entity>;
}

export abstract class GameLoop {
    public playerID: number;
    protected readonly tickRate: number = DEFAULT_SETTINGS.global.tickRate;
    protected state: GameState = {entities: {}};
    protected oldState: GameState = {entities: {}};
    protected renderer: Render;
    protected localInput!: Input;
    protected pendingInputs: Array<InputPacket> = [];
    
    public network: Proxy;
    public latency: number = 0;

    abstract update(): void

    constructor(canvas: HTMLCanvasElement, id: number) {
        this.playerID = id;
        this.renderer = new Render(canvas, {interpolation: false}, this.playerID);
        this.network = new Proxy();
    }

    setID(id: number) {
        this.playerID = id;
        this.renderer.localID = id;
        this.localInput = new Input(id);
    }

}
