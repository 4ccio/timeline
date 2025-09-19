import { memo, RefObject } from 'react';
import cls from './CircleLabel.module.scss';

interface CircleLabelProps {
    oldRef: RefObject<HTMLDivElement | null>;
    newRef: RefObject<HTMLDivElement | null>;
}

export const CircleLabel = memo(({ oldRef, newRef }: CircleLabelProps) => (
    <div className={cls.labelContainer}>
        <div ref={oldRef} className={cls.label} />
        <div ref={newRef} className={cls.label} />
    </div>
));
