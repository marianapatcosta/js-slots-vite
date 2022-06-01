import { useSelector } from 'react-redux';
import { State } from '@/store/types';
import styles from './styles.module.scss';
import { useTranslation } from 'react-i18next';

const WinsDisplay: React.FC = () => {
  const credits = useSelector((state: State) => state.slotMachine.credits);
  const freeSpins = useSelector((state: State) => state.slotMachine.freeSpins);
  const [t] = useTranslation();

  return (
    <header className={styles['wins-display']}>
      <div
        title={t('slot.creditsDescription', { credits })}
        aria-label={t('slot.creditsDescription', { credits })}
      >
        <p className={styles['wins-display__tag']}>{t('slot.credits')}</p>
        <div className={styles['wins-display__display-wrapper']}>
          <span className={styles['wins-display__coin']}></span>
          <p className={styles['wins-display__display']}>{credits}</p>
        </div>
      </div>
      <h1>JS SLOTS</h1>
      <div
        title={t('slot.freeSpinsDescription', { freeSpins })}
        aria-label={t('slot.freeSpinsDescription', { freeSpins })}
      >
        <p className={styles['wins-display__tag']}>{t('slot.freeSpins')}</p>
        <div className={styles['wins-display__display-wrapper']}>
          <span className={styles['wins-display__spins']}></span>
          <p
            className={`${styles['wins-display__display']} ${styles['wins-display__display--green']}`}
          >
            {freeSpins}
          </p>
        </div>
      </div>
    </header>
  );
};

export { WinsDisplay };
