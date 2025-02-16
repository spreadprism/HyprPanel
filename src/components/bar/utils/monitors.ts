import { BarLayout, BarLayouts } from 'src/lib/types/options';
export const getLayoutForMonitor = (monitor: number, layouts: BarLayouts): BarLayout => {
    const matchingKey = Object.keys(layouts).find((key) => key === monitor.toString());
    const wildcard = Object.keys(layouts).find((key) => key === '*');

    if (matchingKey) {
        return layouts[matchingKey];
    }

    if (wildcard) {
        return layouts[wildcard];
    }

    return {
        left: ['dashboard', 'workspaces', 'windowtitle'],
        middle: ['media'],
        right: ['volume', 'network', 'bluetooth', 'battery', 'systray', 'clock', 'notifications'],
    };
};

export const isLayoutEmpty = (layout: BarLayout): boolean => {
    const isLeftSectionEmpty = !Array.isArray(layout.left) || layout.left.length === 0;
    const isRightSectionEmpty = !Array.isArray(layout.right) || layout.right.length === 0;
    const isMiddleSectionEmpty = !Array.isArray(layout.middle) || layout.middle.length === 0;

    return isLeftSectionEmpty && isRightSectionEmpty && isMiddleSectionEmpty;
};
