import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { Controllers, Reels, WinsDisplay } from '@/components';
import { ROW_NUMBER, SYMBOLS_METADATA, SYMBOL_SIZE } from '@/game-configs';
import { ModalType, SlotScreenResult, Symbol } from '@/types';
import { SPIN_ENDED, GAME_RESET, GAME_LEFT, NEW_SPIN_PREPARED } from '@/store/action-types';
import {
  getScreenResult,
  getScreenWithBonusWildcards,
  getShuffledReels,
  wonBonusWildCards,
} from '@/game-utils';
import { State } from '@/store/types';
import { ModalContext } from '@/context/ModalContext';
import { LoseSound, SlotWheelSound, ThemeSound, WinSound } from '@/assets/sounds';
import { deepClone, getRandomNumber, remToPixel } from '@/utils';
import styles from './styles.module.scss';
import { nanoid } from 'nanoid';

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

  const spinAnimationRef = useRef<gsap.core.Tween | null>(null);
  const reelsRef = useRef<HTMLDivElement>(null);
  const reelsSelector: gsap.utils.SelectorFunc = gsap.utils.selector(reelsRef);

  const dispatch = useDispatch();
  const { openModal } = useContext(ModalContext);

  const themeMusic: HTMLAudioElement = useMemo(() => new Audio(ThemeSound), []);
  const slotWheelSound: HTMLAudioElement = useMemo(() => new Audio(SlotWheelSound), []);
  const winSound: HTMLAudioElement = useMemo(() => new Audio(WinSound), []);
  const loseSound: HTMLAudioElement = useMemo(() => new Audio(LoseSound), []);

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
  }, [credits, dispatch, openModal, hasOngoingGame, resetGameOnMount]);

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
    if (isSoundOn) {
      slotWheelSound.play();
      slotWheelSound.loop = true;
    }
    const slotScreen: Symbol[][] = reels.map(reel => {
      const randomIndex = getRandomNumber(0, reel.length - 3);
      return reel.slice(randomIndex, randomIndex + 3);
    });

    setReels(prevReels =>
      prevReels.map((reel, index) => [
        ...reel,
        ...slotScreen[index].map(item => ({ ...item, id: nanoid() })),
      ])
    );

    spinAnimationRef.current!.play();
  }, [reels, isSoundOn, slotWheelSound]);

  const onSpinningEnd = useCallback(
    (slotScreen: Symbol[][]) => {
      slotWheelSound.pause();
      let slotResult: SlotScreenResult = getScreenResult(slotScreen);

      // TODO ANIMATE SYMBOLS TO CHANGE TO TS if wonBonus
      if (!slotResult.winAmount && wonBonusWildCards()) {
        const screenWithWildcards = getScreenWithBonusWildcards(slotScreen);
        slotResult = getScreenResult(screenWithWildcards);
      }

      if (!!slotResult.winPayLines.length) {
        isSoundOn && winSound.play();
      }
      if (!!slotResult.losePayLines.length) {
        isSoundOn && loseSound.play();
      }
      const action = { type: SPIN_ENDED, payload: slotResult };
      dispatch(action);
      setIsSpinning(false);

      // TODO CHECK credits balance: if 0
      /*   if (!credits) {
      openModal(ModalType.RESET, {hasNoCredits: true});
      return; 
    }
    */
      setTimeout(() => {
        dispatch({ type: NEW_SPIN_PREPARED });
        // if (isAutoSpinning) spinAgain
      }, 2000);
    },
    [dispatch, isSoundOn, winSound, loseSound, slotWheelSound]
  );

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
  }, []);

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

  useEffect(() => {
    if (!reels.length) {
      return;
    }
    const grid: [number, number] = [ROW_NUMBER, 4];
    const tl = gsap.timeline(/* { repeat: -1, repeatDelay: 0.5 } */);
    spinAnimationRef.current = gsap.to(reelsSelector('#symbol'), {
      duration: 100,
      /*      ease: 'none', */
      y: remToPixel(SYMBOL_SIZE) * reels[0].length - 4,
      paused: true,
      ease: 'power1.inOut',
      /* duration: 0.5, 
       stagger: {
        amount: 1.5,
        grid: grid,
      },*/
      // onRepeat: () => setReels(prevReels => prevReels.map(([firstReel, ...rest]) => [...rest, firstReel])),
      // onComplete: () => onSpinningEnd(slotScreen),
    });

    return () => {
      spinAnimationRef.current?.kill();
    };
  }, [reels, reelsSelector, onSpinningEnd]);

  return (
    <div className={styles['slot-machine']}>
      <WinsDisplay />
      <Reels ref={reelsRef} reels={reels /* .map(reel => reel.slice(0, 4) )*/} />
      <Controllers isSpinning={isSpinning} onSpin={onSpin} />
    </div>
  );
};

export { SlotMachine };
