import styles from './CompletedPile.module.css';

interface CompletedPileProps {
  matchCount: number;
  totalPairs: number;
}

export default function CompletedPile({ matchCount, totalPairs }: CompletedPileProps) {
  if (matchCount === 0) return null;

  return (
    <div className={styles.pile} aria-label={`${matchCount} of ${totalPairs} pairs matched`}>
      <div className={styles.label}>Matched</div>
      <div className={styles.count}>
        {Array.from({ length: matchCount }).map((_, i) => (
          <span key={i} className={styles.chip} style={{ animationDelay: `${i * 0.04}s` }}>
            ✓
          </span>
        ))}
      </div>
      <div className={styles.progress}>
        <div
          className={styles.progressFill}
          style={{ width: `${(matchCount / totalPairs) * 100}%` }}
        />
      </div>
    </div>
  );
}
