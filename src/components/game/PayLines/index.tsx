import { useCallback, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ROW_NUMBER, SYMBOL_SIZE, PAY_LINES_METADATA, REELS_NUMBER } from '@/game-configs';
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

  const getXCoord = (reel: number): number => {
    const GAP_BETWEEN_REELS = 0.25; // in rem
    return remToPixel((reel + 1) * (SYMBOL_SIZE + GAP_BETWEEN_REELS) - SYMBOL_SIZE / 2);
  };

  const getYCoord = useCallback((row: number, lineIndex: number): number => {
    const offset: number = getYCoordOffset(lineIndex);
    return remToPixel((row + 1) * SYMBOL_SIZE - SYMBOL_SIZE / 2 + offset);
  }, []);

  const getYCoordOffset = (lineIndex: number): number => {
    let offset: number = 0;
    // if row index > last row index (ROW_NUMBER - 1)
    const isLineIndexHigherThanRowsNumber = lineIndex > ROW_NUMBER - 1;
    if (isLineIndexHigherThanRowsNumber && lineIndex % 2 === 0) {
      offset = SYMBOL_SIZE / 3;
    }
    if (isLineIndexHigherThanRowsNumber && lineIndex % 2 !== 0) {
      offset = -SYMBOL_SIZE / 3;
    }
    return offset;
  };

  const getSquaresData = (): { top: number; color: string; lineNumber: number }[] => {
    return Object.values(PAY_LINES_METADATA).map((data, index) => ({
      top: getYCoord(data.positions[0].row, index),
      color: data.color,
      lineNumber: index + 1,
    }));
  };

  const drawPayLine = useCallback(
    (context: CanvasRenderingContext2D, winningLine: PayLine, index: number): void => {
      context.beginPath();
      context.lineWidth = 4;
      context.strokeStyle = winningLine.color;
      context.fillStyle = winningLine.color;
      
      // draw line from the container start border only if first reel is in the positions array
      if (winningLine.positions[0].reel === 0) {
        context.lineTo(0, getYCoord(winningLine.positions[0].row, index));
      }
      winningLine.positions.forEach(({ reel, row }: Position) => {
        context.lineTo(getXCoord(reel), getYCoord(row, index));
      });

      // draw line to the end of container only if last reel is in the positions array
      if (winningLine.positions[winningLine.positions.length - 1].reel === REELS_NUMBER - 1) {
        context.lineTo(
          canvasRef.current?.width!,
          getYCoord(winningLine.positions[winningLine.positions.length - 1].row, index)
        );
      }

      context.stroke();
    },
    [getYCoord]
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
    const winningSequencesMetadata = getPayLinesMetadata();
    winningSequencesMetadata.forEach((sequenceMetadata, index) =>
      drawPayLine(context, sequenceMetadata, index)
    );
  }, [drawPayLine, getPayLinesMetadata]);

  return (
    <CSSTransition
      in={showPayLines}
      timeout={200}
      unmountOnExit
      onEnter={drawCanvas}
      classNames={{
        enterActive: styles['pay-lines-enter-active'],
        enterDone: styles['pay-lines-enter-done'],
        exitActive: styles['pay-lines-exit-active'],
        exitDone: styles['pay-lines-exit-done'],
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
