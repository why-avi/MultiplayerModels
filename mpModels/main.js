import { Render }     from './src/game/render.js';
import { Simulation } from './src/game/simulation.js';
import { Input }      from './src/game/input.js';

const el = (id) => document.getElementById(id);

const simulation = new Simulation();
const input      = new Input();

const renders = [
    new Render(el('canvas_player1')),
    new Render(el('canvas_player2')),
    new Render(el('canvas_server')),
];

let lastTime = null;

function loop(timestamp) {
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
