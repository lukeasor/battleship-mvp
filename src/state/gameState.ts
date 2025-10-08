import { GameState, ShipType, SHIP_CONFIGS } from '../logic/types'
import { createEmptyBoard } from '../logic/shipUtils'

export function createInitialGameState(): GameState {
  return {
    playerBoard: createEmptyBoard(),
    aiBoard: createEmptyBoard(),
    playerShips: [],
    aiShips: [],
    currentTurn: 'player',
    gameStatus: 'setup',
    playerName: '',
    sonarAvailable: false,
    airstrikeAvailable: false,
    sonarUnlocked: false,
    airstrikeUnlocked: false,
  }
}

export function getShipsToPlace(): ShipType[] {
  return Object.keys(SHIP_CONFIGS) as ShipType[]
}
