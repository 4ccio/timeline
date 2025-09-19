import {
    memo, useCallback, useRef,
} from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import cls from './Years.module.scss';

interface YearsProps {
    startYear?: number;
    endYear?: number;
}

export const Years = memo(({ startYear = 0, endYear = 0 }: YearsProps) => {
    const container = useRef<HTMLDivElement>(null);
    const startYearRef = useRef<HTMLSpanElement>(null);
    const endYearRef = useRef<HTMLSpanElement>(null);
    const prevValues = useRef({ startYear, endYear });

    const animateNumber = useCallback((from: number, to: number, element: HTMLSpanElement | null) => {
        if (!element || from === to) return;
        const obj = { value: from };
        gsap.to(obj, {
            value: to,
            duration: 2,
            ease: 'power2.out',
            overwrite: 'auto',
            onUpdate: () => {
                element.textContent = Math.round(obj.value).toString();
            },
        });
    }, []);

    useGSAP(() => {
        const startElement = startYearRef.current;
        const endElement = endYearRef.current;

        if (!startElement || !endElement) return;

        const { startYear: prevStart, endYear: prevEnd } = prevValues.current;

        animateNumber(prevStart, startYear, startElement);
        animateNumber(prevEnd, endYear, endElement);

        prevValues.current = { startYear, endYear };
    }, { scope: container, dependencies: [startYear, endYear] });

    return (
        <div ref={container} className={cls.years}>
            <div className={cls.lineHorizontal} />
            <div className={cls.numbers}>
                <span ref={startYearRef} className={cls.yearStart}>{startYear}</span>
                <span ref={endYearRef} className={cls.yearEnd}>{endYear}</span>
            </div>
        </div>
    );
});
