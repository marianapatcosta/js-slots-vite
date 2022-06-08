import { useSelector } from 'react-redux';
import type { Symbol as SymbolType } from '@/types';
import { State } from '@/store/types';
import styles from './styles.module.scss';

interface SymbolProps {
  symbol: SymbolType;
  reelIndex: number;
}

const Symbol = ({ symbol, reelIndex }: SymbolProps) => {
  const isSpinning = useSelector((state: State) => state.slotMachine.isSpinning);
  const SymbolIcon = symbol.icon;

  return (
    <div
      id={`symbol-${reelIndex}`}
      data-value={symbol.id}
      className={`${styles.symbol} ${isSpinning ? styles['symbol--spinning'] : ''}`}
    >
      <SymbolIcon />
    </div>
  );
};

export { Symbol };
