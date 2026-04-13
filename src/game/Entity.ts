import { Point2D } from './Point';
import { InputPacket } from './Input';
import { PLAYERS, PLAYER_SPAWN, CANVAS_WIDTH, CANVAS_HEIGHT } from './Constants';
import { cloneDeep } from 'lodash';
// Player entity class containing loocation and applies movement.

export class Entity {
    public readonly id: number; // ID Number of this entity, same as player's id.
    public location: Point2D;
    public color: string;
    public serverLocation: Point2D; // For Snapshot Sync 
    
    private speed: number;
    

    // Snapshot Interpolation variables
    private locBuffer: Array<[number, Point2D]> = [];
    public loc0: Point2D | null;
    public loc1: Point2D | null;


    constructor(entityID: number) {
        this.id = entityID;
        this.location = cloneDeep(PLAYER_SPAWN[entityID]);
        this.serverLocation = cloneDeep(PLAYER_SPAWN[entityID]);
        this.color = PLAYERS[entityID];
        this.speed = 3;
        this.loc0 = null;
        this.loc1 = null;
    }

    // Move the entity up/down and left/right based on the amount of time a key has been pressed.
    public applyInput(input: InputPacket): void {
        if (input.up)    this.location.y = this.location.y.sub(this.speed * input.pressTime).clampedTo(0, CANVAS_HEIGHT);
        if (input.down)  this.location.y = this.location.y.add(this.speed * input.pressTime).clampedTo(0, CANVAS_HEIGHT);
        if (input.right) this.location.x = this.location.x.add(this.speed * input.pressTime).clampedTo(0, CANVAS_WIDTH);
        if (input.left)  this.location.x = this.location.x.sub(this.speed * input.pressTime).clampedTo(0, CANVAS_WIDTH);
    }

    public setServerLocation(loc: Point2D): void {
        this.serverLocation = loc;
    }

    public setLocation(loc: Point2D): void {
        this.location = loc;
    }

    public addToLocationBuffer(loc: [number, Point2D]): void {
        this.locBuffer.push(loc);
    }

    public getBuffer(): Array<[number, Point2D]> {
        const buffer = this.locBuffer;
        return buffer;
    }

    public saveInterpLocation(l1: Point2D | null, l2: Point2D | null) {
        this.loc0 = l1;
        this.loc1 = l2;
    }
}