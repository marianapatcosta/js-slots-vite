import { useCallback, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { ROW_NUMBER, SYMBOL_SIZE, PAY_LINES_METADATA } from '@/game-configs';
import type { Position, PayLine, PayLineType } from '@/types';
import { remToPixel } from '@/utils';
import styles from './styles.module.scss';
import { useSelector } from 'react-redux';
import { State } from '@/store/types';
import { get } from 'https';

const SQUARE_SIZE = 10; // in px

const PayLines: React.FC = () => {
  const showPayLines = useSelector((state: State) => state.slotMachine.showPayLines);
  const winPayLines = useSelector((state: State) => state.slotMachine.winPayLines);
  // TODO const losePayLines = useSelector((state: State) => state.slotMachine.losePayLines);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getXCoord = (reel: number): number => {
    return remToPixel(reel * SYMBOL_SIZE);
  };

  const getYCoord = (row: number): number => {
    const factor = row === Math.floor(ROW_NUMBER) / 2 ? SYMBOL_SIZE : (SYMBOL_SIZE * 2) / 3;
    return remToPixel(row * factor);
  };

  const drawPayLine = useCallback(
    (context: CanvasRenderingContext2D, winningLine: PayLine, index: number): void => {
      context.beginPath();
      context.lineWidth = 2;
      context.strokeStyle = winningLine.color;
      context.fillStyle = winningLine.color;
      const { reel: initialXCoord, row: initialCoordY } = winningLine.positions[0];
      context.fillRect(
        getXCoord(initialXCoord) - SQUARE_SIZE,
        getYCoord(initialCoordY) - SQUARE_SIZE / 2,
        SQUARE_SIZE,
        SQUARE_SIZE
      );
      context.fillText(String(index), 10, 10);

      winningLine.positions.forEach(({ reel, row }: Position) =>
        context.lineTo(getXCoord(reel), getYCoord(row))
      );
      context.stroke();
    },
    []
  );

  const getPayLinesMetadata = useCallback((): PayLine[] => {
    if (winPayLines?.length) {
      return winPayLines;
    }

    return Object.values(PAY_LINES_METADATA);
  }, [winPayLines]);

  const drawCanvas = useCallback((): void => {
    const context = canvasRef.current?.getContext('2d') as CanvasRenderingContext2D;
    const winningSequencesMetadata = getPayLinesMetadata();
    winningSequencesMetadata.forEach((sequenceMetadata, index) =>
      drawPayLine(context, sequenceMetadata, index)
    );
  }, [drawPayLine, getPayLinesMetadata]);

/*   useEffect(() => {
    drawCanvas();
  }, [drawCanvas]); */

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
      nodeRef={canvasRef}
    >
      <canvas className={styles['pay-lines']} ref={canvasRef}></canvas>
    </CSSTransition>
  );
};

export { PayLines };
