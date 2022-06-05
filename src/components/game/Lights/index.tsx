import styles from './styles.module.scss';

interface LightsProps {
  blink: boolean;
}

const Lights: React.FC<LightsProps> = ({ blink }) => {
  return (
    <div className={styles['lights']}>
      {[...Array(5)].map((_, index) => (
        <div
          key={`light-${index}`}
          className={`${styles['lights__light']} ${blink ? styles['lights__light--blink'] : ''}`}
        ></div>
      ))}
    </div>
  );
};

export { Lights };
