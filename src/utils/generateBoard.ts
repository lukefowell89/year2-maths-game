import type { GameConfig, LeftCard, RightCard } from '../types/game';
import { MULTIPLICATION_POOLS, ALL_DIVISION_POOLS } from '../data/mathsPairs';
import { shuffle } from './shuffle';

function pickDivisionPool(pairCount: number) {
  // Each division sub-pool has unique answers within it, avoiding cross-pool collisions.
  // div10 has 50 pairs (answers 1-50), so it can always satisfy any pairCount.
  // div2 and div3 both have 10 pairs — enough for max difficulty of 10.
  const eligible = [
    ALL_DIVISION_POOLS.div2,
    ALL_DIVISION_POOLS.div3,
    ALL_DIVISION_POOLS.div10,
  ].filter((pool) => pool.length >= pairCount);

  if (eligible.length === 0) return ALL_DIVISION_POOLS.div10;
  return eligible[Math.floor(Math.random() * eligible.length)];
}

function pickMultiplicationPool(pairCount: number) {
  // For multiplication, try to pick from a single table pool.
  // Each table has 12 items (2x, 3x) or 10 items (10x).
  // For reallyHard (10 pairs) we may need to combine two tables.
  const eligible = MULTIPLICATION_POOLS.filter((p) => p.length >= pairCount);
  if (eligible.length > 0) {
    return eligible[Math.floor(Math.random() * eligible.length)];
  }
  // Fallback: combine all multiplication pairs and de-duplicate answers
  return null;
}

export function generateBoard(config: GameConfig): { leftCards: LeftCard[]; rightCards: RightCard[] } {
  const { mode, pairCount } = config;

  let pool =
    mode === 'division'
      ? pickDivisionPool(pairCount)
      : pickMultiplicationPool(pairCount);

  if (!pool) {
    // Combine all multiplication pools and remove duplicate answers
    const combined = MULTIPLICATION_POOLS.flat();
    const seenAnswers = new Set<number>();
    pool = combined.filter((p) => {
      if (seenAnswers.has(p.answer)) return false;
      seenAnswers.add(p.answer);
      return true;
    });
  }

  // Ensure we have enough unique pairs
  if (pool.length < pairCount) {
    throw new Error(`Not enough unique pairs for difficulty (need ${pairCount}, have ${pool.length})`);
  }

  // Sample pairCount pairs at random
  const sampled = shuffle(pool).slice(0, pairCount);

  // Build left and right cards with independent shuffles
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
