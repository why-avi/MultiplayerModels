import { Render }     from './src/game/Render.js';
import { GameLoop } from './src/game/GameLoop.js';
import { Keys }      from './src/game/Input.js';



const el = (id: string): HTMLCanvasElement => {
    const element = document.getElementById(id);
    if (!element) throw new Error(`Element #${id} not found`);
    return element as HTMLCanvasElement;
};

const simulation = new GameLoop();


const renders = [
    new Render(el('canvas_player1')),
    new Render(el('canvas_player2')),
    new Render(el('canvas_server')),
];

let lastTime: number | null = null;

function loop(timestamp: number): void {
    if (lastTime === null) lastTime = timestamp;
    const dt = (timestamp - lastTime) / 1000;
    lastTime = timestamp;

    const inputs = input.getInputs();
    simulation.update(dt, inputs);

    const state = simulation.getState();
    for (const render of renders) {
        render.draw(state);
    }

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
