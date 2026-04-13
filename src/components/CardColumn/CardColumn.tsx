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

export default function CardColumn(props: CardColumnProps) {
  const { side, isLocked, onSelect, lastMatchResult, selectedPairId } = props;
  const isRight = side === 'right';

  return (
    <div className={styles.column}>
      <div className={`${styles.colLabel} ${isRight ? styles.rightLabel : styles.leftLabel}`}>
        {isRight ? 'Find the answer' : 'Pick a maths card'}
      </div>
      <div className={styles.grid}>
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

          // Green highlight on the currently-selected card (both sides)
          // while a correct match is resolving, before it pops to matched.
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
