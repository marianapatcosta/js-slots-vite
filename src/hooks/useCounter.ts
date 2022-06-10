import { useEffect, useState } from 'react';

export const useCounter = (initialValue: number): number => {
  const [currentValue, setCurrentValue] = useState<number>(initialValue);

  useEffect(() => {
    if (initialValue === currentValue) {
      return;
    }
    let timerId: ReturnType<typeof setTimeout> | undefined = setTimeout(() => {
      if (initialValue === currentValue) {
        return clearTimeout(timerId);
      }
      const valueToUpdate: number = initialValue < currentValue ? -1 : 1;
      setCurrentValue(prevValue => prevValue + valueToUpdate);
    }, 10);

    return () => clearTimeout(timerId);
  }, [currentValue, initialValue]);

  return currentValue;
};
