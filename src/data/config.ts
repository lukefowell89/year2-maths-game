import type { Difficulty, MathsMode, PlayerMode } from '../types/game';

export const PAIR_COUNTS: Record<Difficulty, number> = {
  easy: 4,          // 2×2 grid
  notSoEasy: 6,     // 3×2 grid
  aLittleTricky: 9, // 3×3 grid
  veryHard: 12,     // max pool size (answers 1–12)
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  notSoEasy: 'Not So Easy',
  aLittleTricky: 'A Little Tricky',
  veryHard: 'Very Hard',
};

export const MODE_LABELS: Record<MathsMode, string> = {
  multiplication: 'Multiplication',
  division: 'Division',
};

export const PLAYER_MODE_LABELS: Record<PlayerMode, string> = {
  solo: 'Solo',
  twoPlayer: '2 Player',
};

export const DIFFICULTIES: Difficulty[] = ['easy', 'notSoEasy', 'aLittleTricky', 'veryHard'];
export const MODES: MathsMode[] = ['multiplication', 'division'];
export const PLAYER_MODES: PlayerMode[] = ['solo', 'twoPlayer'];
