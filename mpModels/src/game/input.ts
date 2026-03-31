import { EntityID } from "./entity";
import Decimal from "decimal.js";


// Keybind interface.
export interface Keys {
    up: string;
    down: string;
    left: string;
    right: string;
}

// Preassigned keybindings according to player number.
export const PLAYER_KEYS: Record<EntityID, Keys> = {
    0: {
        up: 'KeyW',
        down: 'KeyS',
        left: 'KeyA',
        right: 'KeyD' 
    },
    1: {
        up: 'ArrowUp',
        down: 'ArrowDown',
        left: 'ArrowLeft',
        right: 'ArrowRight'      
    }
}

export interface InputPacket {
    pressTime
}

export interface InputConstructor {
    playerID: number;
    keys: Keys;

}

export class Input {

    constructor({PlayerID}:InputConstructor) {

    }
    

    destroy() {
        document.removeEventListener('keydown', this._onKeyDown);
        document.removeEventListener('keyup',   this._onKeyUp);
    }
}