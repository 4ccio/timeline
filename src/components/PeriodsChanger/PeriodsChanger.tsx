import { memo } from 'react';
import cls from './PeriodsChanger.module.scss';

interface PeriodsChangerProps {
    periodsLength: number;
    currentIndex: number;
    onPeriodChange: (index: number) => void;
}

export const PeriodsChanger = memo((props: PeriodsChangerProps) => {
    const { periodsLength, onPeriodChange, currentIndex = 0 } = props;

    const handlePrev = () => {
        onPeriodChange(Math.max(currentIndex - 1, 0));
    };
    const handleNext = () => {
        onPeriodChange(Math.min(currentIndex + 1, periodsLength - 1));
    };

    return (
        <div>
            <div className={cls.counter}>
                <span>{`0${currentIndex + 1}/0${periodsLength}`}</span>
            </div>
            <div className={cls.controls}>
                <button
                    disabled={currentIndex === 0}
                    className={cls.btn}
                    type="button"
                    onClick={handlePrev}
                >
                    {'<'}
                </button>
                <button
                    disabled={currentIndex + 1 >= periodsLength}
                    className={cls.btn}
                    type="button"
                    onClick={handleNext}
                >
                    {'>'}
                </button>
            </div>
        </div>
    );
});
