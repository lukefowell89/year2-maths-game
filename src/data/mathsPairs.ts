import type { MathsPair } from '../types/game';

// ── Multiplication ──────────────────────────────────────────────────────────

// 2× table: 2×1 to 2×12
const mul2: MathsPair[] = Array.from({ length: 12 }, (_, i) => ({
  id: `mul-2-${i + 1}`,
  mode: 'multiplication',
  prompt: `2 × ${i + 1}`,
  answer: 2 * (i + 1),
}));

// 5× table: 5×1 to 5×12
const mul5: MathsPair[] = Array.from({ length: 12 }, (_, i) => ({
  id: `mul-5-${i + 1}`,
  mode: 'multiplication',
  prompt: `5 × ${i + 1}`,
  answer: 5 * (i + 1),
}));

// 10× table: 10×1 to 10×12
const mul10: MathsPair[] = Array.from({ length: 12 }, (_, i) => ({
  id: `mul-10-${i + 1}`,
  mode: 'multiplication',
  prompt: `10 × ${i + 1}`,
  answer: 10 * (i + 1),
}));

// ── Division ────────────────────────────────────────────────────────────────
// Each pool uses a SINGLE divisor so answers are unique within the pool.
// Pools are sized to 12 (answers 1–12) matching the max difficulty pair count.

// ÷2: 2÷2 up to 24÷2  (answers 1–12)
const div2: MathsPair[] = Array.from({ length: 12 }, (_, i) => ({
  id: `div-2-${(i + 1) * 2}`,
  mode: 'division',
  prompt: `${(i + 1) * 2} ÷ 2`,
  answer: i + 1,
}));

// ÷5: 5÷5 up to 60÷5  (answers 1–12)
const div5: MathsPair[] = Array.from({ length: 12 }, (_, i) => ({
  id: `div-5-${(i + 1) * 5}`,
  mode: 'division',
  prompt: `${(i + 1) * 5} ÷ 5`,
  answer: i + 1,
}));

// ÷10: 10÷10 up to 120÷10  (answers 1–12)
const div10: MathsPair[] = Array.from({ length: 12 }, (_, i) => ({
  id: `div-10-${(i + 1) * 10}`,
  mode: 'division',
  prompt: `${(i + 1) * 10} ÷ 10`,
  answer: i + 1,
}));

export const MULTIPLICATION_POOLS = [mul2, mul5, mul10];
export const ALL_DIVISION_POOLS = { div2, div5, div10 };
