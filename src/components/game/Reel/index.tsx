import { Symbol as SymbolComponent } from '@/components';
import { SYMBOL_SIZE } from '@/game-configs';
import type { Symbol } from '@/types';
import styles from './styles.module.scss';

interface ReelProps {
  reel: Symbol[];
}

const Reel: React.FC<ReelProps> = ({ reel }) => {
  const reelHeight = 240; // 15.6rem
  return (
    <div className={styles.reel}>
      {reel.map((symbol, index) => (
        <SymbolComponent
          initialTopPosition={reelHeight - index * SYMBOL_SIZE * 16 - SYMBOL_SIZE * 16}
          symbol={symbol}
          key={symbol.id}
        />
      ))}
    </div>
  );
};

export { Reel };
