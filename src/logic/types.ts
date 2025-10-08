export type CellState = 'empty' | 'ship' | 'hit' | 'miss'

export type ShipType = 'Carrier' | 'Battleship' | 'Cruiser' | 'Submarine' | 'Destroyer'

export interface Ship {
  type: ShipType
  length: number
  positions: Position[]
  hits: boolean[]
}

export interface Position {
  row: number
  col: number
}

export interface Cell {
  state: CellState
  shipId?: string
}

export type Board = Cell[][]

export interface GameState {
  playerBoard: Board
  aiBoard: Board
  playerShips: Ship[]
  aiShips: Ship[]
  currentTurn: 'player' | 'ai'
  gameStatus: 'setup' | 'playing' | 'won' | 'lost'
  playerName: string
  sonarAvailable: boolean
  airstrikeAvailable: boolean
  sonarUnlocked: boolean
  airstrikeUnlocked: boolean
}

export interface AIState {
  mode: 'hunt' | 'target'
  targetQueue: Position[]
  lastHit?: Position
  hitCells: Position[]
}

export const SHIP_CONFIGS: Record<ShipType, number> = {
  Carrier: 5,
  Battleship: 4,
  Cruiser: 3,
  Submarine: 3,
  Destroyer: 2,
}

export const BOARD_SIZE = 10
