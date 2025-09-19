import {
 memo, useRef, useEffect, useCallback,
} from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useCircleCoords } from 'hooks/useCircleCoords';
import cls from './Circle.module.scss';
import { CirclePoint } from './CirclePoint/CirclePoint';
import { CircleLabel } from './CircleLabel/CircleLabel';

gsap.registerPlugin(useGSAP);

interface CircleProps {
    points: number;
    // duration?: number;
    activeIndex: number;
    onIndexChange: (index: number) => void;
    periodTitles: string[];
}

const ANIMATION_CONFIG = {
    point: {
        active: { width: 56, height: 56, background: 'transparent' },
        inactive: { width: 6, height: 6, background: '#42567A' },
    },
    durations: {
        main: 1.5,
        label: 0.5,
        hover: 0.5,
        labelDelay: 1,
    },
    ease: 'power2.inOut',
} as const;

const radius = 265;
const theta0 = Math.PI / 4;

export const Circle = memo((props: CircleProps) => {
    const {
        points,
        // duration = 2,
        activeIndex,
        onIndexChange,
        periodTitles,
    } = props;

    const delta = (2 * Math.PI) / points;
    const coords = useCircleCoords(points, radius);

    const container = useRef<HTMLDivElement>(null);
    const prevIndex = useRef(activeIndex);
    const pointRefs = useRef<(HTMLDivElement | null)[]>([]);
    const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const oldLabelRef = useRef<HTMLDivElement>(null);
    const newLabelRef = useRef<HTMLDivElement>(null);

    const setPointState = useCallback((index: number, state: 'active' | 'inactive', duration = 0) => {
        const point = pointRefs.current[index];
        const number = numberRefs.current[index];

        if (!point || !number) return;

        const config = ANIMATION_CONFIG.point[state];
        const opacity = state === 'active' ? 1 : 0;

        gsap.to(point, { ...config, duration, overwrite: 'auto' });
        gsap.to(number, { opacity, duration, overwrite: 'auto' });
    }, []);

    const animateRotation = useCallback((newIndex: number, timeline: gsap.core.Timeline) => {
        const toTheta = theta0 + newIndex * delta;
        const absoluteAngle = ((toTheta - theta0) * 180) / Math.PI;

        timeline.to(container.current, {
            rotation: `${absoluteAngle}_short`,
            transformOrigin: 'center center',
            duration: ANIMATION_CONFIG.durations.main,
            ease: ANIMATION_CONFIG.ease,
            overwrite: 'auto',
        }, 0);

        numberRefs.current.forEach((num) => {
            if (num) {
                timeline.to(num, {
                    rotation: `-${absoluteAngle}_short`,
                    transformOrigin: 'center center',
                    duration: ANIMATION_CONFIG.durations.main,
                    ease: ANIMATION_CONFIG.ease,
                    overwrite: 'auto',
                }, 0);
            }
        });
    }, [delta]);

    const animateLabels = useCallback((newIndex: number, timeline: gsap.core.Timeline) => {
        if (!oldLabelRef.current || !newLabelRef.current) return;

        const { label: labelDuration, labelDelay } = ANIMATION_CONFIG.durations;

        gsap.killTweensOf([oldLabelRef.current, newLabelRef.current]);

        timeline.to(oldLabelRef.current, {
            opacity: 0,
            duration: labelDuration,
        }, 0);

        newLabelRef.current.textContent = periodTitles[newIndex];
        gsap.set(newLabelRef.current, { opacity: 0 });
        timeline.to(newLabelRef.current, {
            opacity: 1,
            duration: labelDuration,
            overwrite: 'auto',
        }, `>${labelDelay}`);

        timeline.call(() => {
            const temp = oldLabelRef.current;
            oldLabelRef.current = newLabelRef.current;
            newLabelRef.current = temp;
        });
    }, [periodTitles]);

    const { contextSafe } = useGSAP(() => {
        if (oldLabelRef.current) {
            gsap.set(oldLabelRef.current, {
                opacity: 1,
                textContent: periodTitles[activeIndex],
            });
        }
        if (newLabelRef.current) {
            gsap.set(newLabelRef.current, { opacity: 0, textContent: '' });
        }

        pointRefs.current.forEach((_, i) => {
            setPointState(i, i === activeIndex ? 'active' : 'inactive');
        });
    }, { scope: container });

    const animate = useCallback((newIndex: number) => {
        contextSafe(() => {
            if (newIndex === prevIndex.current) return;

            const fromIndex = prevIndex.current;
            prevIndex.current = newIndex;

            const timeline = gsap.timeline({
                defaults: { ease: ANIMATION_CONFIG.ease },
                onStart: () => onIndexChange(newIndex),
            });

            animateRotation(newIndex, timeline);
            setPointState(fromIndex, 'inactive', ANIMATION_CONFIG.durations.main);
            setPointState(newIndex, 'active', ANIMATION_CONFIG.durations.main);
            animateLabels(newIndex, timeline);
        })();
    }, [
        contextSafe,
        animateRotation,
        animateLabels,
        setPointState,
        onIndexChange,
    ]);

    useEffect(() => {
        if (activeIndex !== prevIndex.current) {
            animate(activeIndex);
        }
    }, [activeIndex, animate]);

    const handleClick = useCallback((i: number) => {
        animate(i);
    }, [animate]);

    const handleMouseEnter = useCallback((i: number) => {
        setPointState(i, 'active', ANIMATION_CONFIG.durations.hover);
    }, [setPointState]);

    const handleMouseLeave = useCallback((i: number) => {
        if (i !== activeIndex) {
            setPointState(i, 'inactive', ANIMATION_CONFIG.durations.hover);
        }
    }, [activeIndex, setPointState]);

    return (
        <>
            <div ref={container} className={cls.backlineCircle}>
                {coords.map((p, i) => (
                    <CirclePoint
                        key={i}
                        index={i}
                        activeIndex={activeIndex}
                        coords={p}
                        onClick={handleClick}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        pointRef={(el) => { pointRefs.current[i] = el; }}
                        numberRef={(el) => { numberRefs.current[i] = el; }}
                    />
                ))}
            </div>

            <CircleLabel oldRef={oldLabelRef} newRef={newLabelRef} />
        </>
    );
});
