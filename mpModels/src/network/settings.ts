import { LockStep } from "../game/Lockstep";
import { SnapshotClient } from "../game/Snapshot/SnapshotClient";
import { DEFAULT_SETTINGS, PLAYERS } from "../game/Constants";
/** 
 * Settings for the network simulation.
 */

export interface Options {
    global: { 
        tickRate: number;
        lossRate: number;
     }
    snapshot: { 
        latency: number;
        lossRate: number;
        options: {
            prediction?: boolean;
            reconciliation?: boolean;
            interpolation?: boolean;
            serverPositions?: boolean; 
        };
    }[];
    lockstep: {
        latency: number;
        lossRate: number;
    }[];
}

export interface SnapshotOptions {
    prediction?: boolean;
    reconciliation?: boolean;
    interpolation?: boolean;
    serverPositions?: boolean; 
}

export class SettingsManager {
    private readonly optionsKey = 'modelOptions'
    private lockstepClients: Array<LockStep> = [];
    private snapshotClients: Array<SnapshotClient> = [];
    private uiElements!: {
        snapshot: {
            prediction: HTMLInputElement;
            reconciliation: HTMLInputElement;
            interpolation: HTMLInputElement;
            serverPositions: HTMLInputElement;
            latency: HTMLInputElement;
            lossRate: HTMLInputElement;
        }[];
        lockstep: {
            latency: HTMLInputElement;
            lossRate: HTMLInputElement;
        }[];
    }

    public options: Options;

    constructor(ss: SnapshotClient[], ls: LockStep[]) {
        this.snapshotClients = ss;
        this.lockstepClients = ls;
        this.options = this.loadFromStorage() || DEFAULT_SETTINGS;
        this.save()
        this.initUI();
        this.toUI();
        this.applyToGames();
    }

    private initUI(): void { 
        this.uiElements = {
            snapshot: PLAYERS.map((_, i) => ({
                prediction: document.getElementById(`ss${i}prediction`) as HTMLInputElement,
                reconciliation: document.getElementById(`ss${i}reconciliation`) as HTMLInputElement,
                interpolation: document.getElementById(`ss${i}interpolation`) as HTMLInputElement,
                serverPositions: document.getElementById(`ss${i}serverPositions`) as HTMLInputElement,
                latency: document.getElementById(`ss${i}latency`) as HTMLInputElement,
                lossRate: document.getElementById(`ss${i}lossRate`) as HTMLInputElement
            })),
            lockstep: PLAYERS.map((_, i) => ({
                latency: document.getElementById(`ls${i}latency`) as HTMLInputElement,
                lossRate: document.getElementById(`ls${i}lossRate`) as HTMLInputElement
            }))
        }
        
        for (let i = 0; i < PLAYERS.length; i++) {
            this.onNumber(`ls${i}latency`, (value: number) =>{
                this.lockstepClients[i].latency = value;
                this.options.lockstep[i].latency = value;
            });
            this.onNumber(`ss${i}latency`, (value: number) => {
                this.snapshotClients[i].latency = value;
                this.options.snapshot[i].latency = value;
            });    
            
            Object.keys(this.options.snapshot[i].options).forEach(option => {
                this.onCheck(`ss${i}${option}`, (value) => {
                    this.snapshotClients[i].options[option as keyof SnapshotOptions] = value;
                    this.options.snapshot[i].options[option as keyof SnapshotOptions] = value;
                });
            })
        }
    }

    private toUI(): void {
        this.options.lockstep.forEach((saved, i) => {
            this.uiElements.lockstep[i].latency.value = saved.latency.toString();
        });
        this.options.snapshot.forEach((saved, i) => {
            this.uiElements.snapshot[i].latency.value = saved.latency.toString();
            (Object.keys(saved.options) as (keyof SnapshotOptions)[]).forEach(option => {
                this.uiElements.snapshot[i][option].checked = saved.options[option] ?? false;
            });
        });
    }

    private applyToGames(): void {
        this.options.lockstep.forEach((saved, i) => {
            this.lockstepClients[i].latency = saved.latency;
            this.lockstepClients[i].network.setLossRate(saved.lossRate);
        });
        this.options.snapshot.forEach((saved, i) => {
            this.snapshotClients[i].latency = saved.latency;
            this.snapshotClients[i].network.setLossRate(saved.lossRate);
            this.snapshotClients[i].options = {...saved.options};
            this.snapshotClients[i].setRenderOptions(saved.options);
        });
    }

    private onNumber(name: string, apply: (value: number) => void): void {
        const element = document.getElementById(name) as HTMLInputElement;
        element.addEventListener('input', () => { apply(parseInt(element.value)); this.save();})
    }

    private onCheck(name: string, apply: (value: boolean) => void): void {
        const element = document.getElementById(name) as HTMLInputElement;
        element.addEventListener('change', () => { apply(element.checked); this.save(); })
    }

    private loadFromStorage(): Options | undefined {
        const storedSettings = localStorage.getItem(this.optionsKey);
        return storedSettings ? JSON.parse(storedSettings) : undefined;
    }

    private save(): void {
        localStorage.setItem(this.optionsKey, JSON.stringify(this.options));
    }
}
