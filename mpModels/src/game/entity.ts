import Decimal from 'decimal.js';
import { Point2D } from './Point';
import { InputPacket } from './Input';
// Player entity class containing loocation and applies movement.

export interface EntityConstructor {
    entityID: number;
    location: Point2D;
    color: string;
}

export class Entity {
    public readonly id: number; // ID Number of this entity, same as player's id.
    public  location: Point2D;
    
    private serverLocation: Point2D; // For Snapshot Sync 
    private speed: number;
    private color: string;

    // Snapshot Interpolation variables
    private locBuffer = [];
    private loc1: Point2D | undefined;
    private loc2: Point2D | undefined;


    constructor({entityID, color, location}: EntityConstructor) {
        this.id = entityID;
        this.location = location;
        this.serverLocation = location;
        this.color = color;
        this.locBuffer = [];
        this.speed = 2;
    }

    // Move the entity up/down and left/right based on the amount of time a key has been pressed.
    applyInput(input: InputPacket) {
        if (input.up)    this.location.y = this.location.y.add(this.speed * input.pressTime);
        if (input.down)  this.location.y = this.location.y.sub(this.speed * input.pressTime);
        if (input.right) this.location.x = this.location.x.add(this.speed * input.pressTime);
        if (input.left)  this.location.x = this.location.x.sub(this.speed * input.pressTime);
    }
}