import type { GameState } from '../types/game';
import type { GameAction } from './gameActions';
import { INITIAL_STATE } from './initialState';
import { PAIR_COUNTS } from '../data/config';

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_SETUP': {
      if (state.phase !== 'idle') return state;
      return { ...state, phase: 'setup' };
    }

    case 'CONFIRM_SETUP': {
      if (state.phase !== 'setup') return state;
      const { mode, difficulty, playerMode } = action.payload;
      return {
        ...INITIAL_STATE,
        phase: 'countdown',
        config: {
          mode,
          difficulty,
          playerMode,
          pairCount: PAIR_COUNTS[difficulty],
        },
      };
    }

    case 'START_PLAYING': {
      if (state.phase !== 'countdown') return state;
      return {
        ...state,
        phase: 'playing',
        turnPhase: 'waitingForLeft',
        isLocked: false,
        lastMatchResult: null,
        board: {
          leftCards: action.payload.leftCards,
          rightCards: action.payload.rightCards,
          matchedPairIds: [],
          selectedLeftPairId: null,
          selectedRightPairId: null,
        },
        soloStats: { guesses: 0, matches: 0, elapsedMs: 0 },
        twoPlayerStats: { scoreA: 0, scoreB: 0, activePlayer: 'A' },
      };
    }

    case 'SELECT_LEFT': {
      if (
        state.phase !== 'playing' ||
        state.isLocked ||
        !state.board ||
        state.turnPhase !== 'waitingForLeft'
      ) {
        // Once a left card is selected, no changing until the turn resolves
        return state;
      }

      const { pairId } = action.payload;
      const card = state.board.leftCards.find((c) => c.pairId === pairId);
      if (!card || card.status === 'matched') return state;

      const updatedLeft = state.board.leftCards.map((c) => {
        if (c.pairId === pairId) {
          return { ...c, status: 'faceUp' as const };
        }
        return c;
      });

      return {
        ...state,
        turnPhase: 'leftSelected',
        board: {
          ...state.board,
          leftCards: updatedLeft,
          selectedLeftPairId: pairId,
        },
      };
    }

    case 'SELECT_RIGHT': {
      if (
        state.phase !== 'playing' ||
        state.isLocked ||
        !state.board ||
        state.turnPhase !== 'leftSelected'
      ) {
        return state;
      }

      const { pairId } = action.payload;
      const card = state.board.rightCards.find((c) => c.pairId === pairId);
      if (!card || card.status === 'matched') return state;
      // Don't re-select the same right card
      if (state.board.selectedRightPairId === pairId) return state;

      const isCorrect = state.board.selectedLeftPairId === pairId;

      const updatedRight = state.board.rightCards.map((c) => {
        if (c.pairId === pairId) {
          return { ...c, status: isCorrect ? ('faceUp' as const) : ('incorrect' as const) };
        }
        return c;
      });

      // Also mark left card incorrect for visual feedback
      const updatedLeft = isCorrect
        ? state.board.leftCards
        : state.board.leftCards.map((c) => {
            if (c.pairId === state.board!.selectedLeftPairId) {
              return { ...c, status: 'incorrect' as const };
            }
            return c;
          });

      const newGuesses =
        state.config?.playerMode === 'solo' ? state.soloStats.guesses + 1 : state.soloStats.guesses;

      return {
        ...state,
        turnPhase: isCorrect ? 'resolving_success' : 'resolving_failure',
        isLocked: true,
        lastMatchResult: isCorrect ? 'correct' : 'incorrect',
        board: {
          ...state.board,
          leftCards: updatedLeft,
          rightCards: updatedRight,
          selectedRightPairId: pairId,
        },
        soloStats: { ...state.soloStats, guesses: newGuesses },
      };
    }

    case 'RESOLVE_COMPLETE': {
      if (state.phase !== 'playing' || !state.isLocked || !state.board || !state.config) {
        return state;
      }

      if (state.turnPhase === 'resolving_success') {
        const leftPairId = state.board.selectedLeftPairId!;
        const newMatchedPairIds = [...state.board.matchedPairIds, leftPairId];
        const isGameComplete = newMatchedPairIds.length >= state.config.pairCount;

        const updatedLeft = state.board.leftCards.map((c) =>
          c.pairId === leftPairId ? { ...c, status: 'matched' as const } : c
        );
        const updatedRight = state.board.rightCards.map((c) =>
          c.pairId === state.board!.selectedRightPairId ? { ...c, status: 'matched' as const } : c
        );

        const newTwoPlayer = { ...state.twoPlayerStats };
        if (state.config.playerMode === 'twoPlayer') {
          if (state.twoPlayerStats.activePlayer === 'A') {
            newTwoPlayer.scoreA += 1;
          } else {
            newTwoPlayer.scoreB += 1;
          }
          // Correct: keep same player
        }

        const newSolo = {
          ...state.soloStats,
          matches: state.soloStats.matches + 1,
          elapsedMs: isGameComplete ? (action.payload.elapsedMs ?? 0) : state.soloStats.elapsedMs,
        };

        return {
          ...state,
          phase: isGameComplete ? 'complete' : 'playing',
          turnPhase: 'waitingForLeft',
          isLocked: false,
          lastMatchResult: null,
          board: {
            ...state.board,
            leftCards: updatedLeft,
            rightCards: updatedRight,
            matchedPairIds: newMatchedPairIds,
            selectedLeftPairId: null,
            selectedRightPairId: null,
          },
          soloStats: newSolo,
          twoPlayerStats: newTwoPlayer,
        };
      }

      if (state.turnPhase === 'resolving_failure') {
        const updatedLeft = state.board.leftCards.map((c) =>
          c.pairId === state.board!.selectedLeftPairId ? { ...c, status: 'faceDown' as const } : c
        );
        const updatedRight = state.board.rightCards.map((c) =>
          c.pairId === state.board!.selectedRightPairId ? { ...c, status: 'faceDown' as const } : c
        );

        const newTwoPlayer = { ...state.twoPlayerStats };
        if (state.config.playerMode === 'twoPlayer') {
          // Incorrect: switch player
          newTwoPlayer.activePlayer = state.twoPlayerStats.activePlayer === 'A' ? 'B' : 'A';
        }

        return {
          ...state,
          turnPhase: 'waitingForLeft',
          isLocked: false,
          lastMatchResult: null,
          board: {
            ...state.board,
            leftCards: updatedLeft,
            rightCards: updatedRight,
            selectedLeftPairId: null,
            selectedRightPairId: null,
          },
          twoPlayerStats: newTwoPlayer,
        };
      }

      return state;
    }

    case 'RESTART_SAME_SETTINGS': {
      if (!state.config) return state;
      return {
        ...INITIAL_STATE,
        phase: 'countdown',
        config: state.config,
      };
    }

    case 'GO_TO_SETUP': {
      return { ...INITIAL_STATE, phase: 'setup' };
    }

    case 'GO_TO_IDLE': {
      return { ...INITIAL_STATE, phase: 'idle' };
    }

    default:
      return state;
  }
}
