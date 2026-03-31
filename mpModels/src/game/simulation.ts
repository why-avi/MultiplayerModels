const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 80;
const SPEED = 200; // pixels per second

export interface PlayerInput {
    up?: boolean;
    down?: boolean;
    left: boolean;
    right: boolean;
}

interface PlayerState {
    x: number;
    y: number;
    radius: number;
    color: string;
    speed: number;
}

export interface GameState {
    players: { x: number; y: number; radius: number; color: string }[];
}

export class Simulation {
    private players: PlayerState[];

    constructor() {
        this.players = [
            { x: 150, y: 200, radius: 20, color: '#4af', speed: SPEED },
            { x: 450, y: 200, radius: 20, color: '#f84', speed: SPEED },
        ];
    }

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
    }

    // Returns a snapshot of game state — network layer will use this.
    getState(): GameState {
        return {
            players: this.players.map(p => ({ x: p.x, y: p.y, radius: p.radius, color: p.color })),
        };
    }

    // Applies a state snapshot from server/network — network layer will call this.
    applyState(state: GameState) {
        state.players.forEach((snap, i) => {
            this.players[i].x = snap.x;
            this.players[i].y = snap.y;
        });
    }
}
