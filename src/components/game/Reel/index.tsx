import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useSelector } from 'react-redux';
import { nanoid } from 'nanoid';
import { State } from '@/store/types';
import { Symbol as SymbolComponent } from '@/components';
import { REELS_NUMBER, ROW_NUMBER, SYMBOL_SIZE, WILDCARD_METADATA } from '@/game-configs';
import type { Position, Symbol } from '@/types';
import { remToPixel } from '@/utils';
import { ReelsContext, ReelsContextData } from '@/context/ReelsContext';
import styles from './styles.module.scss';

interface ReelProps {
  symbols: Symbol[];
  reelIndex: number;
  animationDuration: number;
}

const Reel: React.FC<ReelProps> = ({ symbols: reel, reelIndex, animationDuration }) => {
  const areSlotsSpinning = useSelector((state: State) => state.slotMachine.isSpinning);
  const [isReelSpinning, setIsReelsSpinning] = useState<boolean>(false);
  const reelRef = useRef<HTMLDivElement>(null);
  const spinAnimationRef = useRef<gsap.core.Tween | null>(null);
  const reelSelector: gsap.utils.SelectorFunc = gsap.utils.selector(reelRef);
  const symbolSize: number = remToPixel(SYMBOL_SIZE);

  const bonusWildCardsPositions: Position[] = useSelector(
    (state: State) => state.slotMachine.bonusWildcardsPositions
  ).filter(({ reel }: Position) => reel === reelIndex);

  const { onSpinningEnd, onReelAnimationEnd } = useContext<ReelsContextData>(ReelsContext);

  const onSpinningAnimationEnd = useCallback(() => {
    setIsReelsSpinning(false);
    onReelAnimationEnd(reelIndex);
    if (reelIndex === REELS_NUMBER - 1) {
      onSpinningEnd();
    }
  }, [reelIndex, onReelAnimationEnd, onSpinningEnd]);

  useEffect(() => {
    if (!areSlotsSpinning) {
      return;
    }
    setIsReelsSpinning(true);
    spinAnimationRef.current?.play();
  }, [areSlotsSpinning]);

  useEffect(() => {
    gsap.set(`#symbol-${reelIndex}`, {
      y: (index: number) => index * symbolSize,
    });
    const reelHeight: number = reel.length * symbolSize;
    const wrapOffsetTop: number = -symbolSize;
    const wrapOffsetBottom: number = reelHeight + wrapOffsetTop;
    const wrap = gsap.utils.wrap(wrapOffsetTop, wrapOffsetBottom);
    spinAnimationRef.current = gsap.to(reelSelector(`#symbol-${reelIndex}`), {
      duration: animationDuration,
      y: `+=${reelHeight}`,
      ease: 'power1.in',
      modifiers: {
        y: gsap.utils.unitize(wrap),
      },
      onComplete: onSpinningAnimationEnd,
    });
    spinAnimationRef.current.pause();
    return () => {
      spinAnimationRef.current?.kill();
    };
  }, [reelSelector, reelIndex, reel, symbolSize, animationDuration, onSpinningAnimationEnd]);

  return (
    <div className={styles.reel} ref={reelRef}>
      {reel.map((symbol, index) => (
        <SymbolComponent
          symbol={symbol}
          isSpinning={isReelSpinning}
          key={symbol.id}
          reelIndex={reelIndex}
          symbolIndex={index < ROW_NUMBER ? index : null}
        />
      ))}
      {!!bonusWildCardsPositions.length &&
        bonusWildCardsPositions.map(({ reel, row }) => (
          <SymbolComponent
            key={`wildcard-${reel}-${row}`}
            symbol={{ ...WILDCARD_METADATA, id: nanoid() }}
            reelIndex={reel}
            symbolIndex={row}
            isBonusWildCard={true}
            style={{ top: `${SYMBOL_SIZE * row}rem` }}
          />
        ))}
    </div>
  );
};

export { Reel };
