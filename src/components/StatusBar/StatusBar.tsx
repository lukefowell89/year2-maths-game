import { useGameContext } from '../../hooks/useGameContext';
import { formatTime } from '../../utils/formatTime';
import styles from './StatusBar.module.css';

export default function StatusBar() {
  const { state, dispatch, elapsedMs } = useGameContext();
  const { config, soloStats, board } = state;
  if (!config) return null;

  const matchCount = board?.matchedPairIds.length ?? 0;
  const isTwoPlayer = config.playerMode === 'twoPlayer';

  return (
    <header className={styles.bar}>
      <div className={styles.center}>
        {isTwoPlayer ? (
          <span className={styles.stat}>
            <span className={styles.statIcon}>⭐</span>
            {matchCount} / {config.pairCount} matched
          </span>
        ) : (
          <div className={styles.soloStats}>
            <span className={styles.stat}>
              <span className={styles.statIcon}>⏱️</span>
              {formatTime(elapsedMs)}
            </span>
            <span className={styles.stat}>
              <span className={styles.statIcon}>🎯</span>
              {soloStats.guesses} guesses
            </span>
            <span className={styles.stat}>
              <span className={styles.statIcon}>⭐</span>
              {matchCount} / {config.pairCount}
            </span>
          </div>
        )}
      </div>

      <div className={styles.right}>
        <button
          className={styles.menuBtn}
          onClick={() => dispatch({ type: 'GO_TO_SETUP' })}
          aria-label="Return to menu"
          title="Return to menu"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
