
/** 
 * Settings for the network simulation.
 */

import { PLAYERS } from "../game/Constants";

export interface Settings {
    global: {
        tickRate: number;
        commandDelay: number;
    };
    snapshot: {
        prediction: boolean;
        interpolation: boolean;
        reconciliation: boolean;
        serverPositions: boolean;
    }[];
    player: {
        latency: number;
        packetLoss: number;
    }[];
}

export class SettingsManager {
    private readonly settingsKey = 'gameSettings';
    private settings: Settings;
    private uiElements!: {
        applySettings: HTMLButtonElement;
        resetSettings: HTMLButtonElement;
        global: {
            tickRate: HTMLInputElement;
            commandDelay: HTMLInputElement;
        };
        snapshot: {
            prediction: HTMLInputElement;
            interpolation: HTMLInputElement;
            reconciliation: HTMLInputElement;
            serverPositions: HTMLInputElement;
        }[];
        player: {
            latency: HTMLInputElement;
            packetLoss: HTMLInputElement;
        }[];
    }

    constructor() {
        
    }

    private getStoredSetings(): Settings | undefined {
        const stored = localStorage.getItem(this.settingsKey);
        return stored ? JSON.parse(stored) : undefined;
    }

    private saveSettings(): void {
        localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
    }

    private initializeUI(): void {
        this.uiElements = {
            applySettings: document.getElementById('applySettings') as HTMLButtonElement,
            resetSettings: document.getElementById('resetSettings') as HTMLButtonElement,
            global: {
                tickRate: document.getElementById('tickRate') as HTMLInputElement,
                commandDelay: document.getElementById('commandDelay') as HTMLInputElement,
            },
            player: PLAYERS.map((_, i) => {
                latency: document.getElementById(`latency${i}`) as HTMLInputElement,
                
            })
        }
    }

    private resetSettings(): void {

    }

    private fromSettingsToUI(settings: Settings): void {

    }
}