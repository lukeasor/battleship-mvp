import { Board, Position, Ship, BOARD_SIZE } from './types'

export function createEmptyBoard(): Board {
  return Array(BOARD_SIZE)
    .fill(null)
    .map(() =>
      Array(BOARD_SIZE)
        .fill(null)
        .map(() => ({ state: 'empty' as const }))
    )
}

export function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row < BOARD_SIZE && pos.col >= 0 && pos.col < BOARD_SIZE
}

export function getShipPositions(
  startPos: Position,
  length: number,
  isHorizontal: boolean
): Position[] {
  const positions: Position[] = []
  for (let i = 0; i < length; i++) {
    positions.push({
      row: isHorizontal ? startPos.row : startPos.row + i,
      col: isHorizontal ? startPos.col + i : startPos.col,
    })
  }
  return positions
}

export function canPlaceShip(
  board: Board,
  positions: Position[]
): boolean {
  return positions.every(pos => {
    if (!isValidPosition(pos)) return false
    return board[pos.row][pos.col].state === 'empty'
  })
}

export function placeShipOnBoard(
  board: Board,
  ship: Ship,
  shipId: string
): Board {
  const newBoard = board.map(row => row.map(cell => ({ ...cell })))
  ship.positions.forEach(pos => {
    newBoard[pos.row][pos.col] = {
      state: 'ship',
      shipId,
    }
  })
  return newBoard
}

export function areAllShipsSunk(ships: Ship[]): boolean {
  return ships.every(ship => 
    ship.hits.every(hit => hit)
  )
}

export function getAdjacentCells(pos: Position): Position[] {
  return [
    { row: pos.row - 1, col: pos.col },
    { row: pos.row + 1, col: pos.col },
    { row: pos.row, col: pos.col - 1 },
    { row: pos.row, col: pos.col + 1 },
  ].filter(isValidPosition)
}
