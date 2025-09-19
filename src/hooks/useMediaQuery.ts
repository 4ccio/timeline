import { useState, useEffect } from 'react';
import { breakpoints, BreakpointKey } from 'app/types/breakpoints';

export function useMediaQuery(breakpoint: BreakpointKey): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const query = `(max-width: ${breakpoints[breakpoint]}px)`;
        const media = window.matchMedia(query);

        setMatches(media.matches);

        const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
        media.addEventListener('change', listener);

        // eslint-disable-next-line consistent-return
        return () => media.removeEventListener('change', listener);
    }, [breakpoint]);

    return matches;
}
