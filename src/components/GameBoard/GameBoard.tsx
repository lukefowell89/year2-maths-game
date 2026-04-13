import { useGameContext } from '../../hooks/useGameContext';
import StatusBar from '../StatusBar/StatusBar';
import CardColumn from '../CardColumn/CardColumn';
import PlayerPanel from '../PlayerPanel/PlayerPanel';
import styles from './GameBoard.module.css';

export default function GameBoard() {
  const { state, dispatch } = useGameContext();
  const { board, config, isLocked, turnPhase, twoPlayerStats, lastMatchResult } = state;

  if (!board || !config) return null;

  const isTwoPlayer = config.playerMode === 'twoPlayer';
  const leftSelected =
    turnPhase === 'leftSelected' ||
    turnPhase === 'resolving_success' ||
    turnPhase === 'resolving_failure';

  function handleSelectLeft(pairId: string) {
    dispatch({ type: 'SELECT_LEFT', payload: { pairId } });
  }
  function handleSelectRight(pairId: string) {
    dispatch({ type: 'SELECT_RIGHT', payload: { pairId } });
  }

  return (
    <div
      className={styles.layout}
      data-active-player={isTwoPlayer ? twoPlayerStats.activePlayer : undefined}
    >
      <StatusBar />

      <main className={styles.boardArea}>
        {isTwoPlayer && (
          <PlayerPanel
            player="A"
            score={twoPlayerStats.scoreA}
            isActive={twoPlayerStats.activePlayer === 'A'}
          />
        )}

        <div className={styles.cardsArea}>
          <CardColumn
            side="left"
            cards={board.leftCards}
            selectedPairId={board.selectedLeftPairId}
            isLocked={isLocked}
            lastMatchResult={lastMatchResult}
            onSelect={handleSelectLeft}
          />

          <div className={styles.divider} aria-hidden="true">
            <span className={styles.dividerArrow}>→</span>
          </div>

          <CardColumn
            side="right"
            cards={board.rightCards}
            selectedPairId={board.selectedRightPairId}
            isLocked={isLocked}
            leftSelected={leftSelected}
            lastMatchResult={lastMatchResult}
            onSelect={handleSelectRight}
          />
        </div>

        {isTwoPlayer && (
          <PlayerPanel
            player="B"
            score={twoPlayerStats.scoreB}
            isActive={twoPlayerStats.activePlayer === 'B'}
          />
        )}
      </main>

      {isTwoPlayer && (
        <div
          className={styles.turnBar}
          data-active-player={twoPlayerStats.activePlayer}
          aria-live="polite"
        >
          <span className={styles.turnEmoji}>
            {twoPlayerStats.activePlayer === 'A' ? '🦊' : '🐼'}
          </span>
          <span className={styles.turnText}>
            It's your turn, Player {twoPlayerStats.activePlayer}!
          </span>
        </div>
      )}
    </div>
  );
}
