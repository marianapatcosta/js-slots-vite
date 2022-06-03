import React, { useEffect, useState, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { useTranslation } from 'react-i18next';
import { SlotHeader } from '@/components/ui/SlotHeader';
import styles from './styles.module.scss';

interface LoaderProps {
  loadingTime: number; // in milliseconds
  onLoadEnd: () => void;
}

const Loader: React.FC<LoaderProps> = ({ loadingTime, onLoadEnd }) => {
  const [t] = useTranslation();
  const [progressValue, setProgressValue] = useState<number>(0);
  const step = 100;
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | undefined;
    if (progressValue >= 100) {
      clearTimeout(timerId);
      return onLoadEnd();
    }
    timerId = setTimeout(() => {
      setProgressValue(prevValue => prevValue + Math.random() * 5);
    }, loadingTime / step);

    return () => clearTimeout(timerId);
  }, [progressValue, loadingTime, onLoadEnd]);

  return (
    <CSSTransition
      timeout={200}
      classNames={{
        enter: styles['loader-enter'],
        enterActive: styles['loader-enter-active'],
        exit: styles['loader-exit'],
        exitActive: styles['loader-exit-active'],
      }}
      nodeRef={loaderRef}
    >
      <div className={styles.loader}>
        <SlotHeader title={t('global.loading')} additionalClass={styles['loader__slot']} />
        <div className={styles['loader__progress-wrapper']}>
          <div
            className={styles['loader__progress']}
            role="progressbar"
            style={{ width: `${progressValue}%` }}
            aria-label={t('global.loading')}
            aria-valuemin={0}
            aria-valuenow={progressValue}
            aria-valuemax={100}
          ></div>
        </div>
      </div>
    </CSSTransition>
  );
};

export { Loader };
