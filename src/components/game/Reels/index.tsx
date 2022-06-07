import React, { forwardRef, RefAttributes } from 'react';
import { nanoid } from 'nanoid';
import { PayLines, Reel } from '@/components';
import type { Symbol } from '@/types';
import styles from './styles.module.scss';

interface ReelsProps {
  reels: Symbol[][];
}

const Reels: React.FunctionComponent<ReelsProps & RefAttributes<HTMLDivElement>> = forwardRef(
  ({ reels }, ref) => {
    return (
      <div className={styles.reels} ref={ref}>
        {reels.map(reel => (
          <Reel reel={reel} key={`reel-${nanoid()}`} />
        ))}
        <PayLines />
      </div>
    );
  }
);

export { Reels };
