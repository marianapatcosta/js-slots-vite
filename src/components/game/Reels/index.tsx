import React, { forwardRef, RefAttributes } from 'react';
import { nanoid } from 'nanoid';
import { PayLines, Reel } from '@/components';
import type { Symbol } from '@/types';
import styles from './styles.module.scss';

interface ReelsProps {
  reels: Symbol[][];
  onSpinEnd: () => void;
}

const Reels: React.FunctionComponent<ReelsProps & RefAttributes<HTMLDivElement>> = forwardRef(
  ({ reels, onSpinEnd }, ref) => {
    return (
      <div className={styles.reels} ref={ref}>
        {reels.map((reel, index) => (
          <Reel reel={reel} key={`reel-${nanoid()}`} reelIndex={index} onSpinEnd={onSpinEnd} />
        ))}
        <PayLines />
      </div>
    );
  }
);

export { Reels };
