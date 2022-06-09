import { createContext } from 'react';

export interface ReelsContextData {
  onReelAnimationEnd: (reelIndex: number) => void;
  onSpinningEnd: () => void;
}

export const ReelsContext = createContext({} as ReelsContextData);
