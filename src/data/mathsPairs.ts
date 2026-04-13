import type { MathsPair } from '../types/game';

// Multiplication: 2x table up to 2x12
const mul2: MathsPair[] = Array.from({ length: 12 }, (_, i) => ({
  id: `mul-2-${i + 1}`,
  mode: 'multiplication',
  prompt: `2 × ${i + 1}`,
  answer: 2 * (i + 1),
}));

// Multiplication: 3x table up to 3x12
const mul3: MathsPair[] = Array.from({ length: 12 }, (_, i) => ({
  id: `mul-3-${i + 1}`,
  mode: 'multiplication',
  prompt: `3 × ${i + 1}`,
  answer: 3 * (i + 1),
}));

// Multiplication: 10x table up to 10x10
const mul10: MathsPair[] = Array.from({ length: 10 }, (_, i) => ({
  id: `mul-10-${i + 1}`,
  mode: 'multiplication',
  prompt: `10 × ${i + 1}`,
  answer: 10 * (i + 1),
}));

// Division: ÷2 from 2÷2 up to 20÷2
const div2: MathsPair[] = Array.from({ length: 10 }, (_, i) => ({
  id: `div-2-${(i + 1) * 2}`,
  mode: 'division',
  prompt: `${(i + 1) * 2} ÷ 2`,
  answer: i + 1,
}));

// Division: ÷3 from 3÷3 up to 30÷3
const div3: MathsPair[] = Array.from({ length: 10 }, (_, i) => ({
  id: `div-3-${(i + 1) * 3}`,
  mode: 'division',
  prompt: `${(i + 1) * 3} ÷ 3`,
  answer: i + 1,
}));

// Division: ÷10 from 10÷10 up to 500÷10
const div10: MathsPair[] = Array.from({ length: 50 }, (_, i) => ({
  id: `div-10-${(i + 1) * 10}`,
  mode: 'division',
  prompt: `${(i + 1) * 10} ÷ 10`,
  answer: i + 1,
}));

export const MULTIPLICATION_POOLS = [mul2, mul3, mul10];
export const DIVISION_POOLS = [div2, div3, div10];

export const ALL_MULTIPLICATION_PAIRS: MathsPair[] = [...mul2, ...mul3, ...mul10];
export const ALL_DIVISION_POOLS = { div2, div3, div10 };
