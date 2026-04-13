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
          🏠
        </button>
      </div>
    </header>
  );
}
