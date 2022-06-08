import { Symbol as SymbolComponent } from '@/components';
import { Symbol } from '@/types';
import styles from './styles.module.scss';

interface ReelProps {
  reel: Symbol[];
}

const Reel: React.FC<ReelProps> = ({ reel }) => {
  return (
    <div id="reel" className={styles.reel}>
      {reel.map(symbol => (
        <SymbolComponent symbol={symbol} key={symbol.id} />
      ))}
    </div>
  );
};

export { Reel };
