import type { CardStatus } from '../../types/game';
import styles from './Card.module.css';

interface CardProps {
  label: string;
  status: CardStatus;
  isDisabled: boolean;
  onClick: () => void;
  side: 'left' | 'right';
  isCorrectPending?: boolean;
}

export default function Card({ label, status, isDisabled, onClick, side, isCorrectPending }: CardProps) {
  const isFlipped = status === 'faceUp' || status === 'incorrect';
  const isMatched = status === 'matched';
  const isIncorrect = status === 'incorrect';

  return (
    <div
      className={`
        ${styles.cardWrapper}
        ${isFlipped ? styles.flipped : ''}
        ${isMatched ? styles.matched : ''}
        ${isIncorrect ? styles.incorrect : ''}
        ${isCorrectPending ? styles.correctPending : ''}
        ${isDisabled ? styles.disabled : ''}
      `.trim()}
    >
      <button
        className={styles.card}
        onClick={isDisabled || isMatched ? undefined : onClick}
        disabled={isDisabled || isMatched}
        aria-label={isMatched ? `Matched: ${label}` : isFlipped ? label : `${side === 'left' ? 'Maths' : 'Answer'} card, face down`}
      >
        <div className={styles.back} aria-hidden="true">
          <span className={styles.backSymbol}>{isMatched ? '✓' : '?'}</span>
        </div>
        <div className={styles.front} aria-hidden={!isFlipped}>
          <span className={styles.label}>{label}</span>
        </div>
      </button>
    </div>
  );
}
