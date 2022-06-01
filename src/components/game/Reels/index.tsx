import React from 'react';
import { nanoid } from 'nanoid';
import { PayLines, Reel } from '@/components';
import type { Symbol } from '@/types';
import styles from './styles.module.scss';

interface ReelsProps {
  reels: Symbol[][];
}

const Reels: React.FC<ReelsProps> = ({ reels }) => {
  return (
    <div className={styles.reels}>
      {reels.map(reel => (
        <Reel reel={reel} key={`reel-${nanoid()}`} />
      ))}
      <PayLines />
    </div>
  );
};

export { Reels };
