import Decimal from "decimal.js";
import { Point2D } from "./Point";

export const CANVAS_WIDTH  = 800;
export const CANVAS_HEIGHT = 80;

export const PLAYER_COLORS: Record<number, string> = {
    0: "#F17720",
    1: "#00A7E1",
};

export const PLAYER_SPAWN: Record<number, Point2D> = {
    0: { x: new Decimal(CANVAS_WIDTH * 0.25), y: new Decimal(CANVAS_HEIGHT / 2) },
    1: { x: new Decimal(CANVAS_WIDTH * 0.75), y: new Decimal(CANVAS_HEIGHT / 2) },
};