import { useEffect, useState, HTMLAttributes, CSSProperties } from 'react';
import type { Color, PayLine, Position, Symbol as SymbolType } from '@/types';
import { useSelector } from 'react-redux';
import { State } from '@/store/types';
import styles from './styles.module.scss';

interface SymbolProps extends HTMLAttributes<HTMLDivElement> {
  symbol: SymbolType;
  reelIndex: number;
  symbolIndex: number | null;
  isSpinning?: boolean;
  isBonusWildCard?: boolean;
}

const Symbol: React.FC<SymbolProps> = ({
  symbol,
  reelIndex,
  symbolIndex,
  isSpinning = false,
  isBonusWildCard = false,
}) => {
  const SymbolIcon = symbol.icon;
  const winPayLines: PayLine[] = useSelector((state: State) => state.slotMachine.winPayLines);
  const losePayLines: PayLine[] = useSelector((state: State) => state.slotMachine.losePayLines);
  const bonusWildcardsPositions: Position[] = useSelector(
    (state: State) => state.slotMachine.bonusWildcardsPositions
  );

  const [animatedColor, setAnimatedColor] = useState<Color | undefined>(undefined);
  const [willBeReplacedByBonusWildCardSymbol, setWillBeReplacedByBonusWildCardSymbol] =
    useState<boolean>(false);

  const cssVars = { '--symbolIndex': symbolIndex || 0 } as CSSProperties;

  useEffect(() => {
    if (symbolIndex === null) {
      return;
    }
    const lines: PayLine[] = [...winPayLines, ...losePayLines];
    const payLinesContainingTheSymbol: PayLine[] = lines.filter(({ positions }: PayLine) =>
      positions.some(({ reel, row }: Position) => reel === reelIndex && row === symbolIndex)
    );
    // TODO change animate between colors if more than one
    setAnimatedColor(payLinesContainingTheSymbol[0]?.color);
  }, [winPayLines, losePayLines, reelIndex, symbolIndex]);

  useEffect(() => {
    if (symbolIndex === null) {
      return;
    }
    const willBeReplaced: boolean = isBonusWildCard
      ? false
      : bonusWildcardsPositions.some(
          ({ reel, row }: Position) => reel === reelIndex && row === symbolIndex
        );

    setWillBeReplacedByBonusWildCardSymbol(willBeReplaced);
  }, [bonusWildcardsPositions, reelIndex, symbolIndex, isBonusWildCard]);

  return (
    <div
      id={isBonusWildCard ? undefined : `symbol-${reelIndex}`}
      data-value={isBonusWildCard ? undefined : symbol.id}
      className={`${styles.symbol} ${isSpinning ? styles['symbol--spinning'] : ''} ${
        willBeReplacedByBonusWildCardSymbol ? styles['symbol--hidden'] : ''
      } ${isBonusWildCard ? styles['symbol--showing'] : ''}`}
      style={{ ...cssVars, backgroundColor: animatedColor || 'inherit' }}
    >
      <SymbolIcon animate={!!animatedColor} />
    </div>
  );
};

export { Symbol };
