import { Board, Ship, Position } from './types'

export function processShot(
  board: Board,
  position: Position,
  ships: Ship[]
): { newBoard: Board; isHit: boolean; hitShip?: Ship; isSunk: boolean } {
  const cell = board[position.row][position.col]
  const newBoard = board.map(row => row.map(c => ({ ...c })))

  if (cell.state === 'ship') {
    newBoard[position.row][position.col].state = 'hit'
    
    const hitShip = ships.find(ship =>
      ship.positions.some(p => p.row === position.row && p.col === position.col)
    )

    if (hitShip) {
      const posIndex = hitShip.positions.findIndex(
        p => p.row === position.row && p.col === position.col
      )
      hitShip.hits[posIndex] = true
      
      const isSunk = hitShip.hits.every(h => h)
      return { newBoard, isHit: true, hitShip, isSunk }
    }
  } else if (cell.state === 'empty') {
    newBoard[position.row][position.col].state = 'miss'
  }

  return { newBoard, isHit: false, isSunk: false }
}

export function checkGameOver(ships: Ship[]): boolean {
  return ships.every(ship => ship.hits.every(hit => hit))
}
