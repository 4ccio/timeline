export const breakpoints = {
    sm: 768,
    md: 1024,
} as const;

export type BreakpointKey = keyof typeof breakpoints;
