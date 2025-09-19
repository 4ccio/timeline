import { TimelineEvent } from 'components/Timeline';
import { Navigation, FreeMode } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SwiperOptions } from 'swiper/types';
import { useMediaQuery } from 'hooks/useMediaQuery';
import {
 memo, useRef, useEffect, useState, useCallback, useMemo,
} from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { breakpoints } from 'app/types/breakpoints';
import cls from './Slider.module.scss';

import 'swiper/css';
import 'swiper/css/navigation';

interface SliderProps {
    events?: TimelineEvent[];
}

const SWIPER_BREAKPOINTS: SwiperOptions['breakpoints'] = {
    [breakpoints.sm]: {
        slidesPerView: 2.5,
        spaceBetween: 50,
    },
    [breakpoints.md]: {
        slidesPerView: 3.5,
        spaceBetween: 80,
    },
};

const ANIMATION_CONFIG = {
    DURATION: {
        FADE_OUT: 1,
        FADE_IN: 2,
    },
    EASE: {
        IN_OUT: 'power2.inOut',
        OUT: 'power2.out',
    },
} as const;

gsap.registerPlugin(useGSAP);

export const Slider = memo((props: SliderProps) => {
    const { events } = props;
    const isMobile = useMediaQuery('sm');

    const containerRef = useRef<HTMLDivElement>(null);
    const swiperRef = useRef<HTMLDivElement>(null);
    const prevBtnRef = useRef<HTMLButtonElement>(null);
    const nextBtnRef = useRef<HTMLButtonElement>(null);
    const dividerRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<gsap.core.Timeline>(null);
    const prevEventsRef = useRef<TimelineEvent[]>(null);

    const [displayEvents, setDisplayEvents] = useState<TimelineEvent[] | undefined>(events);

    const navigationConfig = useMemo(() => ({
        nextEl: `.${cls.nextBtn}`,
        prevEl: `.${cls.prevBtn}`,
        disabledClass: cls.navBtnDisabled,
    }), []);

    const getAnimationElements = useCallback(() => {
        const elementsToAnimate: (HTMLDivElement | HTMLButtonElement)[] = [];

        if (swiperRef.current) {
            elementsToAnimate.push(swiperRef.current);
        }

        if (!isMobile && prevBtnRef.current && nextBtnRef.current) {
            elementsToAnimate.push(prevBtnRef.current, nextBtnRef.current);
        }

        if (isMobile && dividerRef.current) {
            elementsToAnimate.push(dividerRef.current);
        }

        return elementsToAnimate;
    }, [isMobile]);

    const animateTransition = useCallback((timeline: gsap.core.Timeline, elements: (HTMLDivElement | HTMLButtonElement)[]) => {
        timeline
            .to(elements, {
                opacity: 0,
                duration: ANIMATION_CONFIG.DURATION.FADE_OUT,
                ease: ANIMATION_CONFIG.EASE.IN_OUT,
                overwrite: 'auto',
            })
            .call(() => setDisplayEvents(events))
            .to(elements, {
                opacity: 1,
                duration: ANIMATION_CONFIG.DURATION.FADE_IN,
                ease: ANIMATION_CONFIG.EASE.OUT,
            });
    }, [events]);

    useGSAP(() => {
        timelineRef.current = gsap.timeline();

        if (swiperRef.current) {
            gsap.set(swiperRef.current, { opacity: 1, y: 0 });
        }
        if (!isMobile && prevBtnRef.current && nextBtnRef.current) {
            gsap.set([prevBtnRef.current, nextBtnRef.current], { opacity: 1, y: 0 });
        }
        if (isMobile && dividerRef.current) {
            gsap.set(dividerRef.current, { opacity: 1, y: 0 });
        }
    }, { scope: containerRef });

    useEffect(() => {
        if (!events || !swiperRef.current || !timelineRef.current) return;

        const eventsChanged = JSON.stringify(prevEventsRef.current) !== JSON.stringify(events);
        if (!eventsChanged && prevEventsRef.current) return;

        const tl = timelineRef.current;
        tl.clear();

        if (prevEventsRef.current) {
            const elementsToAnimate = getAnimationElements();
            animateTransition(tl, elementsToAnimate);
        } else {
            setDisplayEvents(events);
        }

        prevEventsRef.current = events;
    }, [events, isMobile, getAnimationElements, animateTransition]);

    return (
        <div className={cls.slider} ref={containerRef}>
            {!isMobile && (
                <>
                    <button ref={prevBtnRef} type="button" className={cls.prevBtn}>{'<'}</button>
                    <button ref={nextBtnRef} type="button" className={cls.nextBtn}>{'>'}</button>
                </>
            )}
            {isMobile && <div ref={dividerRef} className={cls.divider} />}
            <div ref={swiperRef}>
                <Swiper
                    modules={[Navigation, FreeMode]}
                    spaceBetween={25}
                    slidesPerView={1.5}
                    navigation={navigationConfig}
                    breakpoints={SWIPER_BREAKPOINTS}
                    grabCursor
                    key={displayEvents?.length}
                >
                    {displayEvents?.map((event, index) => (
                        <SwiperSlide key={`${event.year}-${index}`}>
                            <div className={cls.event}>
                                <span className={cls.eventYear}>{event.year}</span>
                                <p className={cls.eventDescription}>
                                    {event.description}
                                </p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
});
