import { useEffect, useState } from 'react';
import { useGameContext } from '../../hooks/useGameContext';
import { generateBoard } from '../../utils/generateBoard';
import { COUNTDOWN_STEP_MS, GO_DISPLAY_MS } from '../../constants';
import styles from './CountdownOverlay.module.css';

type CountdownStep = 3 | 2 | 1 | 'Go!';
const STEPS: CountdownStep[] = [3, 2, 1, 'Go!'];

export default function CountdownOverlay() {
  const { state, dispatch } = useGameContext();
  const [stepIndex, setStepIndex] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (!state.config) return;

    const isLastStep = stepIndex === STEPS.length - 1;
    const delay = isLastStep ? GO_DISPLAY_MS : COUNTDOWN_STEP_MS;

    const timer = setTimeout(() => {
      if (isLastStep) {
        // Generate board and begin game
        const { leftCards, rightCards } = generateBoard(state.config!);
        dispatch({ type: 'START_PLAYING', payload: { leftCards, rightCards } });
      } else {
        setStepIndex((s) => s + 1);
        setAnimKey((k) => k + 1);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [stepIndex, state.config, dispatch]);

  const current = STEPS[stepIndex];
  const isGo = current === 'Go!';

  return (
    <div className={styles.overlay}>
      <div className={styles.bg} />
      <div
        key={animKey}
        className={`${styles.number} ${isGo ? styles.go : ''}`}
        aria-live="polite"
        aria-label={`Countdown: ${current}`}
      >
        {current}
      </div>
      {!isGo && (
        <div className={styles.dots}>
          {STEPS.slice(0, 3).map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i < stepIndex ? styles.dotPassed : ''} ${i === stepIndex ? styles.dotActive : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
