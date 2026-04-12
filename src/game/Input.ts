// Keybind interface.
export interface Keys {
    up: string;
    down: string;
    left: string;
    right: string;
}

// Preassigned keybindings according to player number.
export const PLAYER_KEYS: Record<number, Keys> = {
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
    entityID: number;
    pressTime: number; 
    sequenceNumber: number;
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
}


export class Input {
    public sequenceNumber: number;
    private pressed: Set<string>;
    private onKeyDown: (e: KeyboardEvent) => void;
    private onKeyUp: (e: KeyboardEvent) => void;
    private keys!: Keys;

    constructor(id: number) {
        this.keys = PLAYER_KEYS[id];
        this.sequenceNumber = 0;
        this.pressed = new Set();
        this.onKeyDown = (e) => this.pressed.add(e.code);
        this.onKeyUp = (e) => this.pressed.delete(e.code);
        document.addEventListener('keydown', this.onKeyDown as EventListener);
        document.addEventListener('keyup', this.onKeyUp as EventListener);
    }
    
    destroy() {
        document.removeEventListener('keydown', this.onKeyDown as EventListener);
        document.removeEventListener('keyup',   this.onKeyUp as EventListener);
    }

    // Gives the currently pressed keys, the current time given and the numbered order.
    getTickInput(time: number, entityId: number):InputPacket {
        return {
            up: this.pressed.has(this.keys.up),
            down: this.pressed.has(this.keys.down),
            left: this.pressed.has(this.keys.left),
            right: this.pressed.has(this.keys.right),
            pressTime: time,
            sequenceNumber: this.sequenceNumber++,
            entityID: entityId
        }
    }

    changeKeys(id: number) {
        this.keys = PLAYER_KEYS[id];
    }
}