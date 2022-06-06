import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Controllers, PayLines, Reels, WinsDisplay } from '@/components';
import { SYMBOLS_METADATA } from '@/game-configs';
import { ModalType, SlotScreenResult, Symbol } from '@/types';
import { SPIN_ENDED, GAME_RESET, GAME_LEFT } from '@/store/action-types';
import {
  getScreenResult,
  getScreenWithBonusWildcards,
  getShuffledReels,
  wonBonusWildCards,
} from '@/game-utils';
import { State } from '@/store/types';
import {
  SCREEN_1,
  SCREEN_2,
  SCREEN_3,
  SCREEN_4,
  SCREEN_5,
  SCREEN_6,
  SCREEN_7,
} from '@/slot-screens-mock';
import { ModalContext } from '@/context/ModalContext';
import { SlotWheelSound, ThemeSound, WinSound } from '@/assets/sounds';
import styles from './styles.module.scss';
import { deepClone, getRandomNumber } from '@/utils';

const SlotMachine = () => {
  const [t] = useTranslation();
  const [reels, setReels] = useState<Symbol[][]>([]);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const isMusicOn = useSelector((state: State) => state.settings.isMusicOn);
  const isSoundOn = useSelector((state: State) => state.settings.isSoundOn);
  const credits = useSelector((state: State) => state.slotMachine.credits);
  const freeSpins = useSelector((state: State) => state.slotMachine.freeSpins);
  const isAutoSpinOn = useSelector((state: State) => state.slotMachine.isAutoSpinOn);
  const hasOngoingGame = useSelector((state: State) => state.slotMachine.hasOngoingGame);
  const resetGameOnMount = useSelector((state: State) => state.slotMachine.resetGameOnMount);
  const [displayedReels, setDisplayedReels] = useState<Symbol[][]>([]);

  const dispatch = useDispatch();
  const { openModal } = useContext(ModalContext);

  const themeMusic: HTMLAudioElement = useMemo(() => new Audio(ThemeSound), []);
  const slotWheelSound: HTMLAudioElement = new Audio(SlotWheelSound);
  const winSound: HTMLAudioElement = new Audio(WinSound);

  /*   const shuffleWorker: Worker = useMemo(
    () =>
      new Worker(new URL('../../../workers/shuffle-worker.ts', import.meta.url), {
        type: 'module',
      }),
    []
  ); */

  const setGameConfigs = useCallback(() => {
    if ((hasOngoingGame && resetGameOnMount === null) || !credits) {
      const modalProps = !credits ? { hasNoCredits: true } : undefined;
      openModal(ModalType.RESET, modalProps);
    }

    if (resetGameOnMount) {
      dispatch({ type: GAME_RESET });
    }
  }, []);

  const playThemeMusic = useCallback((): void => {
    if (!isMusicOn) {
      return;
    }
    themeMusic.play();
    themeMusic.loop = true;
    themeMusic.volume = 0.75;
  }, [isMusicOn, themeMusic]);

  const onSpin = useCallback(() => {
    setIsSpinning(true);
    console.log(4235423);
    /* if (isSoundOn) {
      slotWheelSound.play();
      slotWheelSound.loop = true;
    } */
    const slotScreen: Symbol[][] = reels.map(reel => {
      const randomIndex = getRandomNumber(0, reel.length - 3);
      return reel.slice(randomIndex, randomIndex + 3);
    });
    setReels(prevReels => prevReels.map((reel, index) => [...reel, ...slotScreen[index]]));

    // TODO START ANIMATE // setTimer to animate check, when stop, ASSET WIN}, []);
    let timerId: ReturnType<typeof setTimeout> | undefined;

    const start = Date.now();
    timerId = setTimeout(function animate() {
      if (Date.now() - start > 5000) {
        clearTimeout(timerId);
        return;
      }

      setReels(prevReels => prevReels.map(([firstReel, ...rest]) => [...rest, firstReel]));
      timerId = setTimeout(animate, 100);
    }, 100);

    let result: SlotScreenResult = getScreenResult(slotScreen);

    // TODO ANIMATE SYMBOLS TO CHANGE TO TS if wonBonus
    /*    if (!result.winAmount && wonBonusWildCards()) {
      const screenWithWildcards = getScreenWithBonusWildcards(SCREEN_6 as Symbol[][]);
      result = getScreenResult(screenWithWildcards);
    } */

    // TODO On SPIn end dispatch()
    /* 
      slotWheelSound.pause();

    const action = { type: SPIN_ENDED, payload: result };
    dispatch(action);
    setIsSpinning(false);

    if (win) {
      isSoundOn && winSound.play()
    }

    // if (isAutoSpinning) spinAgain

    // TODO CHECK credits balance: if 0
    openModal(ModalType.RESET, {hasNoCredits: true});
    */
  }, [reels, dispatch, displayedReels]);

  useEffect(() => {
    const shuffledReels = getShuffledReels();
    setReels(shuffledReels);
    setGameConfigs();
    /* shuffleWorker.onmessage = event => {
      const shuffledReels = event.data.data;
      shuffleWorker.terminate();
    }; */

    return () => {
      dispatch({ type: GAME_LEFT });
    };
  }, [setGameConfigs, dispatch]);

  useEffect(() => {
    if (isMusicOn) {
      return playThemeMusic();
    }

    themeMusic.pause();
  }, [isMusicOn, themeMusic, playThemeMusic]);

  useEffect(() => {
    document.addEventListener('mousedown', playThemeMusic);
    return () => document.removeEventListener('mousedown', playThemeMusic);
  }, [playThemeMusic]);

  return (
    <div className={styles['slot-machine']}>
      <WinsDisplay />
      <Reels reels={reels.map(reel => reel.slice(0, 4))} />
      <Controllers isSpinning={isSpinning} onSpin={onSpin} />
    </div>
  );
};

export { SlotMachine };
