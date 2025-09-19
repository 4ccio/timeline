import { Years } from 'components/Years/Years';
import { PeriodsChanger } from 'components/PeriodsChanger/PeriodsChanger';
import { Slider } from 'components/Slider/Slider';
import 'swiper/css';
import 'swiper/css/bundle';
import React, {
    useCallback, useEffect, useMemo, useState,
} from 'react';
import { Circle } from 'components/Circle/Circle';
import { useMediaQuery } from 'hooks/useMediaQuery';
import cls from './Timeline.module.scss';

export interface TimelineEvent {
    year: number;
    description: string;
}

export interface TimelinePeriod {
    id: number;
    startYear: number;
    endYear: number;
    title: string;
    events: TimelineEvent[];
}

export interface TimelineProps {
    periods?: TimelinePeriod[];
}

function Timeline(props: TimelineProps) {
    const { periods = [] } = props;

    const isMobile = useMediaQuery('sm');

    const [currentPeriod, setCurrentPeriod] = useState<TimelinePeriod | null>(() => (periods.length > 0 ? periods[0] : null));
    const [periodIndex, setPeriodIndex] = useState(0);

    const onPeriodChange = useCallback((newIndex: number) => {
        setPeriodIndex(newIndex);
        setCurrentPeriod(periods[newIndex]);
    }, [periods]);

    const periodsTitles = useMemo(() => periods.map((period) => period.title), [periods]);

    useEffect(() => {
        if (periods.length > 0 && !currentPeriod) {
            setCurrentPeriod(periods[0]);
        }
    }, [currentPeriod, periods]);

    if (!periods.length || !currentPeriod) {
        return <div>Ошибка получения данных</div>;
    }

    return (
        <section className={cls.wrapper}>
            <div className={cls.backlineVertical} />

            {!isMobile
                && (
                    <Circle
                        periodTitles={periodsTitles}
                        activeIndex={periodIndex}
                        onIndexChange={onPeriodChange}
                        points={periods.length}
                    />
                )}

            <Years startYear={currentPeriod.startYear} endYear={currentPeriod.endYear} />

            <div className={cls.content}>
                <h2 className={cls.heading}>
                    Исторические
                    <br />
                    даты
                </h2>
                <div className={cls.timelineData}>
                    <PeriodsChanger
                        currentIndex={periodIndex}
                        periodsLength={periods.length}
                        onPeriodChange={onPeriodChange}
                    />
                    <Slider events={currentPeriod.events} />
                </div>
            </div>
        </section>
    );
}

export default React.memo(Timeline);
