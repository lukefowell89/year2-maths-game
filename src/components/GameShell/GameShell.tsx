import { useReducer } from 'react';
import { gameReducer } from '../../state/gameReducer';
import { INITIAL_STATE } from '../../state/initialState';
import { GameContext } from '../../state/GameContext';
import { useTimer } from '../../hooks/useTimer';
import { useMatchResolution } from '../../hooks/useMatchResolution';
import StartScreen from '../StartScreen/StartScreen';
import SetupScreen from '../SetupScreen/SetupScreen';
import CountdownOverlay from '../CountdownOverlay/CountdownOverlay';
import GameBoard from '../GameBoard/GameBoard';
import EndGameModal from '../EndGameModal/EndGameModal';
import styles from './GameShell.module.css';

export default function GameShell() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const elapsedMs = useTimer(state.phase === 'playing');
  useMatchResolution(state, dispatch, elapsedMs);

  return (
    <GameContext.Provider value={{ state, dispatch, elapsedMs }}>
      <div className={styles.shell}>
        {state.phase === 'idle' && <StartScreen />}
        {state.phase === 'setup' && <SetupScreen />}
        {state.phase === 'countdown' && <CountdownOverlay />}
        {state.phase === 'playing' && <GameBoard />}
        {state.phase === 'complete' && (
          <>
            <GameBoard />
            <EndGameModal />
          </>
        )}
      </div>
    </GameContext.Provider>
  );
}
