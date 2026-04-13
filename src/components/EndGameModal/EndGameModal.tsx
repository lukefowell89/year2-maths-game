import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useGameContext } from '../../hooks/useGameContext';
import { formatTime } from '../../utils/formatTime';
import { fireWinConfetti } from '../ConfettiEffect/ConfettiEffect';
import styles from './EndGameModal.module.css';

export default function EndGameModal() {
  const { state, dispatch } = useGameContext();
  const { config, soloStats, twoPlayerStats } = state;

  useEffect(() => {
    fireWinConfetti();
  }, []);

  if (!config) return null;

  const isSolo = config.playerMode === 'solo';
  const accuracy =
    soloStats.guesses > 0
      ? Math.round((soloStats.matches / soloStats.guesses) * 100)
      : 100;

  const winnerA = twoPlayerStats.scoreA > twoPlayerStats.scoreB;
  const winnerB = twoPlayerStats.scoreB > twoPlayerStats.scoreA;
  const isTie = twoPlayerStats.scoreA === twoPlayerStats.scoreB;

  return createPortal(
    <div className={styles.backdrop}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Game complete">
        <div className={styles.crown} aria-hidden="true">🏆</div>

        {isSolo ? (
          <>
            <h2 className={styles.title}>You did it!</h2>
            <p className={styles.subtitle}>Amazing work! Here's how you did:</p>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statEmoji}>⏱</span>
                <span className={styles.statValue}>{formatTime(soloStats.elapsedMs)}</span>
                <span className={styles.statLabel}>Time</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statEmoji}>🎯</span>
                <span className={styles.statValue}>{soloStats.guesses}</span>
                <span className={styles.statLabel}>Guesses</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statEmoji}>✓</span>
                <span className={styles.statValue}>{soloStats.matches}</span>
                <span className={styles.statLabel}>Matches</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statEmoji}>⭐</span>
                <span className={styles.statValue}>{accuracy}%</span>
                <span className={styles.statLabel}>Accuracy</span>
              </div>
            </div>
          </>
        ) : (
          <>
            <h2 className={styles.title}>
              {isTie ? "It's a tie!" : `Player ${winnerA ? 'A' : 'B'} wins!`}
            </h2>
            <p className={styles.subtitle}>
              {isTie ? 'What a close game!' : 'Great game, both of you!'}
            </p>
            <div className={styles.twoPlayerScores}>
              <div className={`${styles.playerCard} ${winnerA ? styles.winner : ''}`}>
                {winnerA && <span className={styles.crownBadge}>👑</span>}
                <span className={styles.playerName}>Player A</span>
                <span className={styles.playerScore}>{twoPlayerStats.scoreA}</span>
                <span className={styles.playerLabel}>matches</span>
              </div>
              <div className={styles.vsText}>vs</div>
              <div className={`${styles.playerCard} ${winnerB ? styles.winner : ''}`}>
                {winnerB && <span className={styles.crownBadge}>👑</span>}
                <span className={styles.playerName}>Player B</span>
                <span className={styles.playerScore}>{twoPlayerStats.scoreB}</span>
                <span className={styles.playerLabel}>matches</span>
              </div>
            </div>
          </>
        )}

        <div className={styles.actions}>
          <button
            className={styles.replayBtn}
            onClick={() => dispatch({ type: 'RESTART_SAME_SETTINGS' })}
          >
            Play Again
          </button>
          <button
            className={styles.menuBtn}
            onClick={() => dispatch({ type: 'GO_TO_SETUP' })}
          >
            New Game
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
