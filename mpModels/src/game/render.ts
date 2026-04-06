/**
 * Renderer for each simulation panel.
 * Wraps a canvas element and provides a draw method for each frame.
 * Each client holds the entities, their locations, their owner and appearance locally. Only locations ever 
 *  get updated in both snapshot and lockstep.
 */

import { Entity } from './Entity.js';
import { GameState } from './GameLoop.js';
import { Point2D, toUnsafePoint2D, UnsafePoint2D } from './Point.js';

interface RenderOptions {
    interpolation?: boolean;
    serverPositions?: boolean;
}

export class Render {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private interpolation: boolean = false;
    private options: RenderOptions;
    private localID: number;

    constructor(canvas: HTMLCanvasElement, options: RenderOptions = {}, localEntityID: number) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.options = options;
        this.localID = localEntityID;
    }

    public setInterp(set: boolean) {
        this.interpolation = set;
    }

    public draw(oldState: GameState, newState: GameState, alpha: number): void {
        if (!oldState || !newState) return;

        this.clear();
        this.drawEntities(oldState, newState, alpha);        
    }

    private clear(): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    private drawEntities(oldState: GameState, newState: GameState, alpha: number): void {
        Object.values(newState.entities).forEach((entity) => {
            this.drawCircle(entity as Entity, 
                // Translate entity positions and interpolate
                this.interpolate(
                    toUnsafePoint2D((oldState.entities[entity.id] as Entity).location),
                    toUnsafePoint2D((newState.entities[entity.id] as Entity).location),
                    alpha
                )
            )
            if (this.options.serverPositions) {
                this.drawServerPositons(entity, toUnsafePoint2D(entity.serverLocation));
            }
        });
    }

    private drawCircle(entity: Entity, {x, y}: UnsafePoint2D): void {
        const radius = this.canvas.height * 0.9 / 2;
        this.ctx.fillStyle = entity.color;
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    private drawServerPositons(entity: Entity, {x, y}: UnsafePoint2D): void {
        if (this.localID == entity.id) {
            
        }
    }
    
    private interpolate({x: oldX, y: oldY}: UnsafePoint2D, {x: newX, y: newY}: UnsafePoint2D, alpha: number): UnsafePoint2D {
        // No interpolation 
        if (!this.options.interpolation) return {x: newX, y: newY};

        // Interpolated positons
        return {
            x: oldX + (newX - oldX) * alpha,
            y: oldY + (newY - oldY) * alpha
        };
    }


}
