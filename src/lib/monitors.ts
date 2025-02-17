import { Gdk } from 'astal/gtk3';
import AstalHyprland from 'gi://AstalHyprland?version=0.1';

const hyprlandService = AstalHyprland.get_default();

type HyprMonitor = {
    id: number;
    name: string;
    description: string;
    make: string;
    model: string;
    serial: string;
    width: number;
    height: number;
    refreshRate: number;
    x: number;
    y: number;
    disabled: boolean;
};

type HyprMonitors = {
    [ID: number]: HyprMonitor;
};

type GdkMonitor = {
    model: string;
    used: boolean;
    posX: number;
    posY: number;
    width: number;
    height: number;
};

type GdkMonitors = {
    [ID: number]: GdkMonitor;
};

const monitorEquals = (hypr: HyprMonitor, gdk: GdkMonitor): boolean => {
    return hypr.width === gdk.width && hypr.height === gdk.height && hypr.x === gdk.posX && hypr.y === gdk.posY;
};

type IdToId = {
    [ID: number]: number;
};

let GdkToHyprMap: IdToId = {};
let HyprToGdkMap: IdToId = {};

export const InvalidateIDCache = (): void => {
    GdkToHyprMap = {};
    HyprToGdkMap = {};
};

export const GdkIDToHyprID = (ID: number): number => {
    let res = GdkToHyprMap[ID];
    if (res == null) {
        const gdk = getGdkMonitors()[ID];
        const hyprMonitors = getHyprMonitors();

        for (const hyprID in hyprMonitors) {
            const hypr = hyprMonitors[hyprID];
            if (monitorEquals(hypr, gdk)) {
                res = hypr.id;
                GdkToHyprMap[ID] = res;
                HyprToGdkMap[res] = ID;
                break;
            }
        }
    }
    return res;
};

export const HyprIDtoGdkID = (ID: number): number => {
    let res = HyprToGdkMap[ID];
    if (res === null) {
        const hypr = getHyprMonitors()[ID];
        const gdkMonitors = getGdkMonitors();

        for (const gdkID in gdkMonitors) {
            const gdk = gdkMonitors[gdkID];
            if (monitorEquals(hypr, gdk)) {
                res = parseInt(gdkID);
                HyprToGdkMap[ID] = res;
                GdkToHyprMap[res] = ID;
                break;
            }
        }
    }
    return res;
};

export function getHyprMonitors(): HyprMonitors {
    const monitors = hyprlandService.get_monitors();
    const hyprMonitors: HyprMonitors = {};
    for (const monitor of monitors) {
        const { id, name, description, make, model, serial, width, height, refreshRate, x, y, disabled } = monitor;
        hyprMonitors[id] = { id, name, description, make, model, serial, width, height, refreshRate, x, y, disabled };
    }
    return hyprMonitors;
}

export function getGdkMonitors(): GdkMonitors {
    const display = Gdk.Display.get_default();

    if (display === null) {
        console.error('Failed to get Gdk display.');
        return {};
    }

    const numGdkMonitors = display.get_n_monitors();
    const gdkMonitors: GdkMonitors = {};

    for (let i = 0; i < numGdkMonitors; i++) {
        const curMonitor = display.get_monitor(i);

        if (curMonitor === null) {
            console.warn(`Monitor at index ${i} is null.`);
            continue;
        }

        const model = curMonitor.get_model() || '';
        const workArea = curMonitor.get_workarea();

        // We can only use the scaleFactor for a scale variable in the key
        // GDK3 doesn't support the fractional "scale" attribute (available in GDK4)
        gdkMonitors[i] = {
            model,
            used: false,
            posX: workArea.x,
            posY: workArea.y,
            width: workArea.width,
            height: workArea.height,
        };
    }

    return gdkMonitors;
}
