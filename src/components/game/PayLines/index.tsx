import { useCallback, useEffect, useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import {
  ROW_NUMBER,
  SYMBOL_SIZE,
  SYMBOL_SIZE_SMALL,
  PAY_LINES_METADATA,
  REELS_NUMBER,
} from '@/game-configs';
import type { Position, PayLine } from '@/types';
import { remToPixel } from '@/utils';
import { useSelector } from 'react-redux';
import { State } from '@/store/types';
import styles from './styles.module.scss';

const PayLines: React.FC = () => {
  const showPayLines = useSelector((state: State) => state.slotMachine.showPayLines);
  const winPayLines: PayLine[] = useSelector((state: State) => state.slotMachine.winPayLines);
  const losePayLines = useSelector((state: State) => state.slotMachine.losePayLines);
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [symbolSize, setSymbolSize] = useState(SYMBOL_SIZE);

  const getYCoordOffset = useCallback(
    (lineNumber: number): number => {
      let offset: number = 0;
      // if row number > last row  (ROW_NUMBER)
      const isLineNumberHigherThanRowsNumber = lineNumber > ROW_NUMBER;
      if (isLineNumberHigherThanRowsNumber && lineNumber % 2 === 0) {
        offset = -symbolSize / 3;
      }
      if (isLineNumberHigherThanRowsNumber && lineNumber % 2 !== 0) {
        offset = symbolSize / 3;
      }
      return offset;
    },
    [symbolSize]
  );

  const getXCoord = useCallback(
    (reel: number): number => {
      const GAP_BETWEEN_REELS = 0.25; // in rem
      return remToPixel((reel + 1) * (symbolSize + GAP_BETWEEN_REELS) - symbolSize / 2);
    },
    [symbolSize]
  );

  const getYCoord = useCallback(
    (row: number, lineNumber: number): number => {
      const offset: number = getYCoordOffset(lineNumber);
      return remToPixel((row + 1) * symbolSize - symbolSize / 2 + offset);
    },
    [symbolSize, getYCoordOffset]
  );

  const getSquaresData = (): { top: number; color: string; lineNumber: number }[] => {
    return Object.values(PAY_LINES_METADATA).map((data: PayLine, index: number) => {
      const lineNumber: number = parseInt(data.type.split('payLine')[1]);
      return {
        top: getYCoord(data.positions[0].row, lineNumber),
        color: data.color,
        lineNumber: index + 1,
      };
    });
  };

  const drawPayLine = useCallback(
    (context: CanvasRenderingContext2D, winningLine: PayLine, lineNumber: number): void => {
      context.beginPath();
      context.lineWidth = 4;
      context.strokeStyle = winningLine.color;
      context.fillStyle = winningLine.color;

      // draw line from the container start border only if first reel is in the positions array
      if (winningLine.positions[0].reel === 0) {
        context.lineTo(0, getYCoord(winningLine.positions[0].row, lineNumber));
      }
      winningLine.positions.forEach(({ reel, row }: Position) => {
        context.lineTo(getXCoord(reel), getYCoord(row, lineNumber));
      });

      // draw line to the end of container only if last reel is in the positions array
      if (winningLine.positions[winningLine.positions.length - 1].reel === REELS_NUMBER - 1) {
        context.lineTo(
          canvasRef.current?.width!,
          getYCoord(winningLine.positions[winningLine.positions.length - 1].row, lineNumber)
        );
      }

      context.stroke();
    },
    [getYCoord, getXCoord]
  );

  const getPayLinesMetadata = useCallback((): PayLine[] => {
    if (winPayLines?.length && losePayLines?.length) {
      return [...winPayLines, ...losePayLines];
    }

    if (winPayLines?.length) {
      return winPayLines;
    }

    if (losePayLines?.length) {
      return winPayLines;
    }

    return Object.values(PAY_LINES_METADATA);
  }, [winPayLines, losePayLines]);

  const drawCanvas = useCallback((): void => {
    if (!canvasRef.current) {
      return;
    }
    const context = canvasRef.current?.getContext('2d') as CanvasRenderingContext2D;
    // adjust canvas dimension to be accurate with pixel-based calculations
    canvasRef.current.width = canvasRef.current?.offsetWidth;
    canvasRef.current.height = canvasRef.current?.offsetHeight;
    const winningSequencesMetadata: PayLine[] = getPayLinesMetadata();
    winningSequencesMetadata.forEach((sequenceMetadata: PayLine) => {
      const lineNumber: number = parseInt(sequenceMetadata.type.split('payLine')[1]);
      drawPayLine(context, sequenceMetadata, lineNumber);
    });
  }, [drawPayLine, getPayLinesMetadata]);

  const updateSymbolSize = useCallback(() => {
    if (window.matchMedia('(max-width: 480px)').matches && symbolSize !== SYMBOL_SIZE_SMALL) {
      setSymbolSize(SYMBOL_SIZE_SMALL);
    }
    if (window.matchMedia('(min-width: 480px)').matches && symbolSize !== SYMBOL_SIZE) {
      setSymbolSize(SYMBOL_SIZE);
    }
  }, [symbolSize]);

  useEffect(() => {
    updateSymbolSize();
    window.addEventListener('resize', updateSymbolSize);

    return () => window.removeEventListener('resize', updateSymbolSize);
  }, [updateSymbolSize]);

  return (
    <CSSTransition
      in={showPayLines}
      timeout={200}
      unmountOnExit
      onEnter={drawCanvas}
      classNames={{
        enterActive: styles['pay-lines-enter-active'],
        enterDone: styles['pay-lines-enter-done'],
        exit: styles['pay-lines-exit'],
        exitActive: styles['pay-lines-exit-active'],
      }}
      nodeRef={canvasWrapperRef}
    >
      <div className={styles['pay-lines']} ref={canvasWrapperRef}>
        <>
          {getSquaresData().map(data => (
            <div
              style={{ top: `${data.top}px`, backgroundColor: data.color }}
              className={styles['pay-lines__number']}
              key={`line-${data.lineNumber}`}
            >
              {data.lineNumber}
            </div>
          ))}
        </>
        <canvas ref={canvasRef}></canvas>
      </div>
    </CSSTransition>
  );
};

export { PayLines };
