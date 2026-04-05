/**
 * Renderer for each simulation panel.
 * Wraps a canvas element and provides a draw method for each frame.
 * Each client holds the entities, their locations, their owner and appearance locally. Only locations ever 
 *  get updated in both snapshot and lockstep.
 */

import { GameState } from './GameLoop.js';

export class Render {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
    }

    // Draws one frame given a state from Simulation.getState().
    draw(state: GameState) {
        const { ctx, canvas } = this;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        state.players.forEach((player, i) => {
            ctx.beginPath();
            ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
            ctx.fillStyle = player.color;
            ctx.fill();

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(`P${i + 1}`, player.x, player.y - player.radius - 6);
        });
    }
}
