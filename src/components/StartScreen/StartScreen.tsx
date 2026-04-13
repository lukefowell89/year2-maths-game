import { useGameContext } from '../../hooks/useGameContext';
import styles from './StartScreen.module.css';

export default function StartScreen() {
  const { dispatch } = useGameContext();

  return (
    <div className={styles.screen}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <span className={styles.logoMaths}>Maths</span>
          <span className={styles.logoMatch}>Match</span>
        </div>
        <p className={styles.subtitle}>Match the cards and test your maths skills!</p>
        <div className={styles.cards}>
          <div className={styles.demoCard}>2 × 7</div>
          <div className={styles.arrow}>→</div>
          <div className={styles.demoCardAnswer}>14</div>
        </div>
        <button
          className={styles.startButton}
          onClick={() => dispatch({ type: 'START_SETUP' })}
        >
          Start New Game
        </button>
      </div>
      <div className={styles.decorations} aria-hidden="true">
        <span className={styles.dec1}>✕</span>
        <span className={styles.dec2}>÷</span>
        <span className={styles.dec3}>+</span>
        <span className={styles.dec4}>3</span>
        <span className={styles.dec5}>7</span>
        <span className={styles.dec6}>×</span>
      </div>
    </div>
  );
}
