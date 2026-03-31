import Decimal from 'decimal.js';
import { Point2D } from './point';
// Player entity class containing loocation and applies movement.

export type EntityID = number;

export interface EntityConstructor {
    entityID: EntityID;
    ownerID: number;
    owned: boolean;
    location: Point2D;
    color: string;
}

export class Entity {
    public readonly ownerID: number; // ID number of the client that controls this entity
    public readonly owned: boolean;  // Client determination if it controls this entity
    public readonly id: EntityID; // ID Number of this entity
    
    private location: Point2D;
    private serverLocation: Point2D; // For Snapshot Sync 
    private speed: number;
    private color: string;

    // Snapshot Interpolation variables
    private locBuffer = [];
    private loc1: Point2D | undefined;
    private loc2: Point2D | undefined;


    constructor({ownerID, owned, entityID, location, color}: EntityConstructor) {
        this.ownerID = ownerID;
        this.owned = owned;
        this.id = entityID;
        this.location = location;
        this.serverLocation = location;
        this.color = color;
        this.locBuffer = [];
        this.speed = 2;
    }

    // Apply input function
}