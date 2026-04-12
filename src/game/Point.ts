import Decimal from "decimal.js";
/**
 *  Deterministic Lockstep synchronization requires every client to have the exact same outcomes. 
 *  This is to ensure each client has the same floating point numbers in their game state.
 *  Adapted from https://github.com/pietrobassi/deterministic-lockstep-demo (MIT)
 * */
export interface Point2D {
    x: Decimal;
    y: Decimal;
}

export interface UnsafePoint2D {
    x: number;
    y: number;
}

export function toUnsafePoint2D(point: Point2D): UnsafePoint2D {
    return { x: point.x.toNumber(), y: point.y.toNumber() };
}