import Decimal from "decimal.js";
import { Point2D } from "./Point";
import { Options } from "../network/Settings";

export const CANVAS_WIDTH  = 300;
export const CANVAS_HEIGHT = 70;

export const PLAYERS: Array<string> = ["#F17720", "#00A7E1"];

export const PLAYER_SPAWN: Record<number, Point2D> = {
    0: { x: new Decimal(CANVAS_WIDTH * 0.25), y: new Decimal(CANVAS_HEIGHT / 2) },
    1: { x: new Decimal(CANVAS_WIDTH * 0.75), y: new Decimal(CANVAS_HEIGHT / 2) },
};

export const DEFAULT_SETTINGS: Options = {
    global: { 
        tickRate: 15,
        lossRate: 0.0
     },
    snapshot: PLAYERS.map(() => ({
        latency: 30,
        lossRate: 0,
        options: {
            prediction: false,
            reconciliation: false,
            interpolation: false,
            serverPositions: false
        }    
    })),
    lockstep: PLAYERS.map(() => ({
        latency: 30,
        lossRate: 0.0
    })),
}