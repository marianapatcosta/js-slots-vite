import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

const About: React.FC = () => {
  const [t] = useTranslation();

  return (
    <div className={styles.about}>
      <p>{t('about.description')}</p>
    </div>
  );
};

export { About };
