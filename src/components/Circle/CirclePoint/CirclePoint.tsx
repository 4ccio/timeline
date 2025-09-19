import { memo } from 'react';
import cls from './CirclePoint.module.scss';

interface CirclePointProps {
    index: number;
    activeIndex: number;
    coords: { x: number; y: number };
    onClick: (i: number) => void;
    onMouseEnter: (i: number) => void;
    onMouseLeave: (i: number) => void;
    pointRef: (el: HTMLDivElement | null) => void;
    numberRef: (el: HTMLSpanElement | null) => void;
}

export const CirclePoint = memo(({
    index, activeIndex, coords, onClick, onMouseEnter, onMouseLeave, pointRef, numberRef,
}: CirclePointProps) => (
    <div
        ref={pointRef}
        className={`${cls.point} ${index === activeIndex ? cls.active : ''}`}
        style={{ transform: `translate(${coords.x}px, ${coords.y}px)` }}
        onClick={() => onClick(index)}
        onMouseEnter={() => onMouseEnter(index)}
        onMouseLeave={() => onMouseLeave(index)}
    >
        <span ref={numberRef} className={cls.pointNumber}>
            {index + 1}
        </span>
    </div>
));
