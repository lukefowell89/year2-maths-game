import { useState, useEffect } from 'react';
import { useGameContext } from '../../hooks/useGameContext';
import { formatTime } from '../../utils/formatTime';
import styles from './StatusBar.module.css';

function useFullscreen() {
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const toggle = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return { isFullscreen, toggle };
}

export default function StatusBar() {
  const { state, dispatch, elapsedMs } = useGameContext();
  const { isFullscreen, toggle } = useFullscreen();
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
          onClick={toggle}
          aria-label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
          title={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
        >
          {isFullscreen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
          )}
        </button>

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
