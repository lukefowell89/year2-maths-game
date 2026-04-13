import styles from './PlayerPanel.module.css';

interface PlayerPanelProps {
  player: 'A' | 'B';
  score: number;
  isActive: boolean;
}

const PLAYER_CONFIG = {
  A: { emoji: '🦊', name: 'Player A', colorClass: styles.playerA },
  B: { emoji: '🐼', name: 'Player B', colorClass: styles.playerB },
} as const;

export default function PlayerPanel({ player, score, isActive }: PlayerPanelProps) {
  const cfg = PLAYER_CONFIG[player];

  return (
    <div
      className={`${styles.panel} ${cfg.colorClass} ${isActive ? styles.active : styles.inactive}`}
      aria-label={`${cfg.name}, score ${score}${isActive ? ', your turn' : ''}`}
    >
      <div className={`${styles.avatarWrap} ${isActive ? styles.avatarActive : ''}`}>
        <div className={styles.avatar}>{cfg.emoji}</div>
      </div>

      <div className={styles.name}>{cfg.name}</div>

      <div className={styles.scoreWrap}>
        <span className={styles.scoreNumber}>{score}</span>
        <span className={styles.scoreLabel}>pts</span>
      </div>
    </div>
  );
}
