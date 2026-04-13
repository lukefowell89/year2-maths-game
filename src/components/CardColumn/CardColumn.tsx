import type { LeftCard, RightCard } from '../../types/game';
import Card from '../Card/Card';
import styles from './CardColumn.module.css';

interface LeftColumnProps {
  side: 'left';
  cards: LeftCard[];
  selectedPairId: string | null;
  isLocked: boolean;
  lastMatchResult: 'correct' | 'incorrect' | null;
  onSelect: (pairId: string) => void;
}

interface RightColumnProps {
  side: 'right';
  cards: RightCard[];
  selectedPairId: string | null;
  isLocked: boolean;
  leftSelected: boolean;
  lastMatchResult: 'correct' | 'incorrect' | null;
  onSelect: (pairId: string) => void;
}

type CardColumnProps = LeftColumnProps | RightColumnProps;

/** Derives grid columns from the number of cards:
 *  4  → 2 cols (2×2)
 *  6  → 3 cols (3×2)
 *  9  → 3 cols (3×3)
 *  16 → 4 cols (4×4)
 */
function gridColumns(count: number): number {
  if (count <= 4) return 2;
  if (count <= 9) return 3;
  return 4;
}

export default function CardColumn(props: CardColumnProps) {
  const { side, isLocked, onSelect, lastMatchResult, selectedPairId } = props;
  const isRight = side === 'right';
  const cols = gridColumns(props.cards.length);

  return (
    <div className={styles.column}>
      <div className={`${styles.colLabel} ${isRight ? styles.rightLabel : styles.leftLabel}`}>
        {isRight ? 'Find the answer' : 'Pick a maths card'}
      </div>
      <div
        className={styles.grid}
        style={{ '--cols': cols } as React.CSSProperties}
      >
        {props.cards.map((card) => {
          const isMatched = card.status === 'matched';
          let isDisabled = isLocked || isMatched;

          if (isRight && 'leftSelected' in props) {
            isDisabled = isDisabled || !props.leftSelected;
          }

          const label =
            side === 'left'
              ? (card as LeftCard).prompt
              : String((card as RightCard).answer);

          const isCorrectPending =
            lastMatchResult === 'correct' && card.pairId === selectedPairId;

          return (
            <Card
              key={card.pairId}
              label={label}
              status={card.status}
              isDisabled={isDisabled}
              side={side}
              isCorrectPending={isCorrectPending}
              onClick={() => onSelect(card.pairId)}
            />
          );
        })}
      </div>
    </div>
  );
}
