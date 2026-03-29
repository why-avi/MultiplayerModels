/*
 * User input handler
 * Player 1: Arrow keys (up/down/left/right)
 * Player 2: A / D keys (left/right only)
 */

export class Input {
    constructor() {
        this._held = new Set();
        this._onKeyDown = (e) => this._held.add(e.code);
        this._onKeyUp   = (e) => this._held.delete(e.code);
        document.addEventListener('keydown', this._onKeyDown);
        document.addEventListener('keyup',   this._onKeyUp);
    }

    // Returns inputs for both players each frame.
    getInputs() {
        const h = this._held;
        return [
            {
                up:    h.has('ArrowUp'),
                down:  h.has('ArrowDown'),
                left:  h.has('ArrowLeft'),
                right: h.has('ArrowRight'),
            },
            {
                left:  h.has('KeyA'),
                right: h.has('KeyD'),
            },
        ];
    }

    destroy() {
        document.removeEventListener('keydown', this._onKeyDown);
        document.removeEventListener('keyup',   this._onKeyUp);
    }
}