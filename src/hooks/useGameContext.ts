import { useContext } from 'react';
import { GameContext } from '../state/GameContext';

export function useGameContext() {
  return useContext(GameContext);
}
