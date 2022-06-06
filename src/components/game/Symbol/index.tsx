import type { Symbol as SymbolType } from '@/types';
import styles from './styles.module.scss';
import { useSelector } from 'react-redux';
import { State } from '@/store/types';
import { useEffect, useState } from 'react';
import { SYMBOL_SIZE } from '@/game-configs';

interface SymbolProps {
  symbol: SymbolType;
  initialTopPosition: number;
}

const Symbol = ({ symbol, initialTopPosition }: SymbolProps) => {
  const isSpinning = useSelector((state: State) => state.slotMachine.isSpinning);
  const [symbolTop, setSymbolTop] = useState<number>(initialTopPosition);
  const SymbolIcon = symbol.icon;
  /* 
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | null;

    if (isSpinning) {
      console.log(778678);
      timerId = setTimeout(function animateTop() {
        setSymbolTop(prevSymbolTop => prevSymbolTop + SYMBOL_SIZE * 16);
        timerId = setTimeout(animateTop, 1000);
      }, 1000);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [isSpinning]);
 */
  return (
    <div
      className={`${styles.symbol} ${isSpinning ? styles['symbol--spinning'] : ''}`}
      style={{ top: symbolTop }}
    >
      <SymbolIcon />
    </div>
  );
};

export { Symbol };
