import { Proxy } from "../../network/proxy";
import { GameConstructor, GameLoop, GameState } from "../gameloop";
import { Input } from "../input";
import { Render } from "../render";


export interface ServerConstructor {
    players: [];
    tickRate: number;
    state: GameState;
    renderer: Render;
    network: Proxy;
}

export class SnapshotServer {
    private readonly players: [];
    private readonly tickRate: number;
    private state: GameState;
    private renderer: Render;
    private network: Proxy;

    constructor({tickRate, state, renderer}:ServerConstructor) {
        this.tickRate = tickRate;
        this.state = state;
        this.renderer = renderer;
        this.network = new Proxy();
        this.players = [];
    }


}