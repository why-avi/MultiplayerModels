import { SnapshotOptions } from '../network/Settings.js';
import { Entity } from './Entity.js';
import { GameState } from './GameLoop.js';
import { toUnsafePoint2D, UnsafePoint2D } from './Point.js';
/**
 * Renderer for each simulation panel.
 * Wraps a canvas element and provides a draw method for each frame.
 * Each client holds the entities, their locations, their owner and appearance locally. Only locations ever 
 *  get updated in both snapshot and lockstep.
 */



export class Render {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    public options: SnapshotOptions;
    public localID: number;

    constructor(canvas: HTMLCanvasElement, options: SnapshotOptions = {}, localEntityID: number) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        this.options = options;
        this.localID = localEntityID;
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
            if (this.options.interpolation && oldState.entities[entity.id]) {
                this.drawCircle(entity.color,
                    // Translate entity positions and interpolate
                    this.interpolate(
                        toUnsafePoint2D((oldState.entities[entity.id] as Entity).location),
                        toUnsafePoint2D((newState.entities[entity.id] as Entity).location),
                        alpha
                    )                
                )
            } else {
                this.drawCircle(entity.color, toUnsafePoint2D(entity.location))
            }
            if (this.options.serverPositions) {
                this.drawServerPositions(entity);
            }
        });
    }

    private drawCircle(color: string, {x, y}: UnsafePoint2D ): void {
        const radius = this.canvas.height * 0.9 / 2;
        this.ctx.fillStyle = color;
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        if (color != 'rgba(0, 0, 0, 0.2)') {
            this.ctx.lineWidth = 5;
            this.ctx.strokeStyle = "black"
            this.ctx.stroke();
        }
    }

    private drawServerPositions(entity: Entity): void {
        if (this.localID == entity.id) {
            this.drawCircle('rgba(0, 0, 0, 0.2)', toUnsafePoint2D(entity.serverLocation))
        } else if (entity.loc0 && entity.loc1) {
            this.drawCircle('rgba(0, 0, 0, 0.2)', toUnsafePoint2D(entity.loc0));
            this.drawCircle('rgba(0, 0, 0, 0.2)', toUnsafePoint2D(entity.loc1))
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
