import { useEffect, useState } from 'react';
import type { Color, PayLine, Position, Symbol as SymbolType } from '@/types';
import { useSelector } from 'react-redux';
import { State } from '@/store/types';
import styles from './styles.module.scss';

interface SymbolProps {
  symbol: SymbolType;
  isSpinning: boolean;
  reelIndex: number;
  symbolIndex: number | null;
}

const Symbol = ({ symbol, reelIndex, symbolIndex, isSpinning }: SymbolProps) => {
  const SymbolIcon = symbol.icon;
  const winPayLines: PayLine[] = useSelector((state: State) => state.slotMachine.winPayLines);
  const losePayLines: PayLine[] = useSelector((state: State) => state.slotMachine.losePayLines);
  const [animatedColor, setAnimatedColor] = useState<Color | undefined>(undefined);

  useEffect(() => {
    if (symbolIndex === null) {
      return;
    }
    const lines: PayLine[] = [...winPayLines, ...losePayLines];
    // TODO change find to filter and animate between color if more than one
    const symbolPositions = lines.find(({ positions }: PayLine) =>
      positions.some(({ reel, row }: Position) => reel === reelIndex && row === symbolIndex)
    );
    setAnimatedColor(symbolPositions?.color);
  }, [winPayLines, losePayLines, reelIndex, symbolIndex]);

  return (
    <div
      id={`symbol-${reelIndex}`}
      data-value={symbol.id}
      className={`${styles.symbol} ${isSpinning ? styles['symbol--spinning'] : ''}`}
      style={{ backgroundColor: animatedColor }}
    >
      <SymbolIcon animate={!!animatedColor} />
    </div>
  );
};

export { Symbol };
