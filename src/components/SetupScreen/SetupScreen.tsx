import { useState } from 'react';
import { useGameContext } from '../../hooks/useGameContext';
import { DIFFICULTIES, DIFFICULTY_LABELS, MODE_LABELS, PLAYER_MODE_LABELS } from '../../data/config';
import type { MathsMode, Difficulty, PlayerMode } from '../../types/game';
import styles from './SetupScreen.module.css';

export default function SetupScreen() {
  const { dispatch } = useGameContext();
  const [mode, setMode] = useState<MathsMode>('multiplication');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [playerMode, setPlayerMode] = useState<PlayerMode>('solo');

  function handleStart() {
    dispatch({ type: 'CONFIRM_SETUP', payload: { mode, difficulty, playerMode } });
  }

  return (
    <div className={styles.screen}>
      <div className={styles.card}>
        <h1 className={styles.title}>Choose your game</h1>

        <section className={styles.section}>
          <h2 className={styles.label}>What maths type?</h2>
          <div className={styles.group}>
            {(['multiplication', 'division'] as MathsMode[]).map((m) => (
              <button
                key={m}
                className={`${styles.option} ${mode === m ? styles.selected : ''}`}
                onClick={() => setMode(m)}
                aria-pressed={mode === m}
              >
                {m === 'multiplication' ? '×' : '÷'} {MODE_LABELS[m]}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.label}>Choose your challenge</h2>
          <div className={styles.group}>
            {DIFFICULTIES.map((d) => (
              <button
                key={d}
                className={`${styles.option} ${styles.diffOption} ${difficulty === d ? styles.selected : ''}`}
                onClick={() => setDifficulty(d)}
                aria-pressed={difficulty === d}
              >
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.label}>Play solo or with a friend?</h2>
          <div className={styles.group}>
            {(['solo', 'twoPlayer'] as PlayerMode[]).map((p) => (
              <button
                key={p}
                className={`${styles.option} ${playerMode === p ? styles.selected : ''}`}
                onClick={() => setPlayerMode(p)}
                aria-pressed={playerMode === p}
              >
                {p === 'solo' ? '🧠' : '👥'} {PLAYER_MODE_LABELS[p]}
              </button>
            ))}
          </div>
        </section>

        <div className={styles.actions}>
          <button
            className={styles.backBtn}
            onClick={() => dispatch({ type: 'GO_TO_IDLE' })}
          >
            ← Back
          </button>
          <button className={styles.startBtn} onClick={handleStart}>
            Start Game!
          </button>
        </div>
      </div>
    </div>
  );
}
