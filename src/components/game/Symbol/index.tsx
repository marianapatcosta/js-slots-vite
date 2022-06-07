import { useSelector } from 'react-redux';
import type { Symbol as SymbolType } from '@/types';
import { State } from '@/store/types';
import styles from './styles.module.scss';

interface SymbolProps {
  symbol: SymbolType;
  initialTopPosition: number;
}

const Symbol = ({ symbol, initialTopPosition }: SymbolProps) => {
  const isSpinning = useSelector((state: State) => state.slotMachine.isSpinning);
  const SymbolIcon = symbol.icon;

  return (
    <div
      id="symbol"
      className={`${styles.symbol} ${isSpinning ? styles['symbol--spinning'] : ''}`}
      style={{ top: initialTopPosition }}
    >
      <SymbolIcon />
    </div>
  );
};

export { Symbol };
