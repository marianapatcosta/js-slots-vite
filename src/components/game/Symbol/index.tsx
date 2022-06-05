import type { Symbol as SymbolType } from '@/types';
import styles from './styles.module.scss';
import { useSelector } from 'react-redux';
import { State } from '@/store/types';

interface SymbolProps {
  symbol: SymbolType;
}

const Symbol = ({ symbol }: SymbolProps) => {
  const isSpinning = useSelector((state: State) => state.slotMachine.isSpinning);
  const SymbolIcon = symbol.icon;
  return (
    <div className={`${styles.symbol} ${isSpinning ? styles['symbol--spinning'] : ''}`}>
      <SymbolIcon />
    </div>
  );
};

export { Symbol };
