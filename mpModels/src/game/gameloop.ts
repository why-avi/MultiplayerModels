import { Entity, EntityID } from "./entity";
import { Input } from "./input";
import { Render } from "./render";
import { Proxy } from "../network/proxy";
/**
 * Base gameloop class. Processes inputs by recording their press time 
 *  
 */

export interface GameState {
    entities: Record<EntityID, Entity>;
}

export interface GameConstructor {
    playerID: number;
    tickRate: number;
    state: GameState;
    renderer: Render;
    localInput: Input;
    network: Proxy;
}

export class GameLoop {
    private playerID: number;
    private tickRate: number;
    private state: GameState;
    private renderer: Render;
    private localInput: Input;

    private network: Proxy;

    constructor({playerID, tickRate, state, renderer, localInput, network}:GameConstructor) {
        this.playerID = playerID;
        this.tickRate = tickRate;
        this.state = state;
        this.renderer = renderer
        this.localInput = localInput
        this.network = network

    }

   /* Listens for both player's inputs - pre-netwo implementation.  
    update(dt: number, inputs: PlayerInput[]) {
        const [p1Input, p2Input] = inputs;
        const [p1, p2] = this.players;

        if (p1Input.up)    p1.y -= p1.speed * dt;
        if (p1Input.down)  p1.y += p1.speed * dt;
        if (p1Input.left)  p1.x -= p1.speed * dt;
        if (p1Input.right) p1.x += p1.speed * dt;

        if (p2Input.left)  p2.x -= p2.speed * dt;
        if (p2Input.right) p2.x += p2.speed * dt;

        for (const p of this.players) {
            p.x = Math.max(p.radius, Math.min(CANVAS_WIDTH  - p.radius, p.x));
            p.y = Math.max(p.radius, Math.min(CANVAS_HEIGHT - p.radius, p.y));
        }
    } */
}
