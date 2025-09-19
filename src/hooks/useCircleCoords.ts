import { useMemo } from 'react';

export const useCircleCoords = (points: number, radius: number, theta0 = Math.PI / 4) => {
    const delta = (2 * Math.PI) / points;

    return useMemo(() => (
        Array.from({ length: points }, (_, i) => {
            const theta = theta0 + i * delta;
            const x = radius * Math.cos(theta);
            const y = -radius * Math.sin(theta);
            return { x, y, theta };
        })
    ), [points, radius, theta0, delta]);
};
