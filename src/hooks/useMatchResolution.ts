import { useEffect } from 'react';
import type { GameState } from '../types/game';
import type { GameAction } from '../state/gameActions';
import { SUCCESS_ANIMATION_DURATION_MS, FAILURE_ANIMATION_DURATION_MS } from '../constants';

/**
 * Watches for a locked state (animation in progress) and schedules
 * RESOLVE_COMPLETE dispatch after the appropriate animation duration.
 * Lives outside the reducer to keep side effects out of pure state logic.
 */
export function useMatchResolution(
  state: GameState,
  dispatch: React.Dispatch<GameAction>,
  elapsedMs: number
) {
  const { isLocked, lastMatchResult, phase } = state;

  useEffect(() => {
    if (!isLocked || phase !== 'playing') return;

    if (lastMatchResult === 'correct') {
      const timer = setTimeout(() => {
        dispatch({ type: 'RESOLVE_COMPLETE', payload: { elapsedMs } });
      }, SUCCESS_ANIMATION_DURATION_MS);
      return () => clearTimeout(timer);
    }

    if (lastMatchResult === 'incorrect') {
      const timer = setTimeout(() => {
        dispatch({ type: 'RESOLVE_COMPLETE', payload: {} });
      }, FAILURE_ANIMATION_DURATION_MS);
      return () => clearTimeout(timer);
    }
  // elapsedMs is intentionally captured at the moment the effect fires
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocked, lastMatchResult, phase]);
}
