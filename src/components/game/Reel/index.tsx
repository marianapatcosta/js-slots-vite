import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useSelector } from 'react-redux';
import { State } from '@/store/types';
import { Symbol as SymbolComponent } from '@/components';
import { SYMBOL_SIZE } from '@/game-configs';
import type { Symbol } from '@/types';
import { remToPixel } from '@/utils';
import styles from './styles.module.scss';

interface ReelProps {
  reel: Symbol[];
  reelIndex: number;
  onSpinEnd: () => void;
}

const Reel: React.FC<ReelProps> = ({ reel, reelIndex, onSpinEnd }) => {
  const isSpinning = useSelector((state: State) => state.slotMachine.isSpinning);
  const reelRef = useRef<HTMLDivElement>(null);
  const spinAnimationRef = useRef<gsap.core.Tween | null>(null);
  const reelSelector: gsap.utils.SelectorFunc = gsap.utils.selector(reelRef);
  const symbolSize: number = remToPixel(SYMBOL_SIZE);

  useEffect(() => {
    gsap.set(`#symbol-${reelIndex}`, {
      y: (index: number) => index * symbolSize,
    });
    const reelHeight: number = reel.length * symbolSize;
    const wrapOffsetTop = -symbolSize;
    const wrapOffsetBottom = reelHeight + wrapOffsetTop;
    var wrap = gsap.utils.wrap(wrapOffsetTop, wrapOffsetBottom);

    if (!isSpinning) {
      return;
    }

    spinAnimationRef.current = gsap.to(reelSelector(`#symbol-${reelIndex}`), {
      duration: 3,
      y: `+=${reelHeight}`,
      /* paused: true, */
      ease: 'none',
      modifiers: {
        y: gsap.utils.unitize(wrap),
      },
      repeat: -1,
      onComplete: () => console.log(8888),
    });

    // TODO: is there any GSAP util to stop a repeated animation after a time amount?
    setTimeout(() => {
      // call here onSpinEnd method to access the result
      onSpinEnd();
      spinAnimationRef.current?.kill();
    }, 4800);

    return () => {
      spinAnimationRef.current?.kill();
    };
  }, [reelSelector, reelIndex, reel, symbolSize, isSpinning]);

  return (
    <div className={styles.reel} ref={reelRef}>
      {reel.map(symbol => (
        <SymbolComponent symbol={symbol} key={symbol.id} reelIndex={reelIndex} />
      ))}
    </div>
  );
};

export { Reel };
