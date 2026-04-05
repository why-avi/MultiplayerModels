import { Entity } from "./Entity";
import { Input } from "./Input";
import { Render } from "./Render";
import { Proxy } from "../network/Proxy";
/**
 * Base gameloop class. Processes inputs by recording their press time 
 *  
 */

export interface GameState {
    entities: Record<number, Entity>;
}

export class GameLoop {
    protected playerID: number = -1;
    protected tickRate: number = 0;
    protected state: GameState = {entities: {}};
    protected renderer: Render;
    protected localInput!: Input;
    protected pendingInputs: Array<any> = [];
    
    public network: Proxy = new Proxy();
    public latency: number = 0; // MS delay in communication

    constructor(canvas: HTMLCanvasElement) {
        this.renderer = new Render(canvas);
    }

    setTickRate(rate: number) {
        this.tickRate = rate;
    }
    
    // Lets a server assign the client with an id. Determines keybindings for this client.
    setID(newID: number) {
        this.playerID = newID;
        this.localInput = new Input(this.playerID);
    }

}
