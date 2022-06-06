import { getShuffledReels } from '../game-utils';
import { Symbol } from '../types';

export type WorkerPostMessageData = {
  data: Symbol[][];
};


/* eslint-disable-next-line no-restricted-globals */
self.onmessage = (event: MessageEvent) => {
  const reels = getShuffledReels();

  /* eslint-disable-next-line no-restricted-globals */
  self.postMessage({ data: reels });
};

/*   const worker = useMemo(
    () =>
      new Worker(new URL('../../../workers/audio-worker.ts', import.meta.url), {
        type: 'module',
      }),
    []
  );

  const handleOnClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (buttonSound) {
        worker.postMessage(JSON.parse(JSON.stringify(buttonSound)));
        console.log(777);
        // buttonSound.play();
      }
      onClick(event);
    },
    [buttonSound, worker, onClick]
  );
 */
