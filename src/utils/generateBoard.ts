import type { GameConfig, LeftCard, RightCard } from '../types/game';
import { MULTIPLICATION_POOLS, ALL_DIVISION_POOLS } from '../data/mathsPairs';
import { shuffle } from './shuffle';

function pickDivisionPool(pairCount: number) {
  const eligible = [
    ALL_DIVISION_POOLS.div2,
    ALL_DIVISION_POOLS.div5,
    ALL_DIVISION_POOLS.div10,
  ].filter((pool) => pool.length >= pairCount);

  if (eligible.length === 0) return ALL_DIVISION_POOLS.div10;
  return eligible[Math.floor(Math.random() * eligible.length)];
}

function pickMultiplicationPool(pairCount: number) {
  const eligible = MULTIPLICATION_POOLS.filter((p) => p.length >= pairCount);
  if (eligible.length > 0) {
    return eligible[Math.floor(Math.random() * eligible.length)];
  }
  // No single table has enough — combine all and remove duplicate answers
  return null;
}

export function generateBoard(config: GameConfig): { leftCards: LeftCard[]; rightCards: RightCard[] } {
  const { mode, pairCount } = config;

  let pool =
    mode === 'division'
      ? pickDivisionPool(pairCount)
      : pickMultiplicationPool(pairCount);

  if (!pool) {
    // Combine 2×, 5×, 10× tables and deduplicate by answer
    const combined = shuffle(MULTIPLICATION_POOLS.flat());
    const seenAnswers = new Set<number>();
    pool = combined.filter((p) => {
      if (seenAnswers.has(p.answer)) return false;
      seenAnswers.add(p.answer);
      return true;
    });
  }

  if (pool.length < pairCount) {
    throw new Error(`Not enough unique pairs for difficulty (need ${pairCount}, have ${pool.length})`);
  }

  const sampled = shuffle(pool).slice(0, pairCount);

  const leftCards: LeftCard[] = shuffle(sampled).map((pair) => ({
    pairId: pair.id,
    prompt: pair.prompt,
    status: 'faceDown',
  }));

  const rightCards: RightCard[] = shuffle(sampled).map((pair) => ({
    pairId: pair.id,
    answer: pair.answer,
    status: 'faceDown',
  }));

  return { leftCards, rightCards };
}
