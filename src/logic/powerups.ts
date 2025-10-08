import { Board, Position } from './types'

export function getSonarScanArea(center: Position): Position[] {
  const positions: Position[] = []
  
  for (let row = center.row - 1; row <= center.row + 1; row++) {
    for (let col = center.col - 1; col <= center.col + 1; col++) {
      if (row >= 0 && row < 10 && col >= 0 && col < 10) {
        positions.push({ row, col })
      }
    }
  }
  
  return positions
}

export function getSonarResults(board: Board, positions: Position[]): Map<string, 'hit' | 'miss'> {
  const results = new Map<string, 'hit' | 'miss'>()
  
  positions.forEach(pos => {
    const cell = board[pos.row][pos.col]
    const key = `${pos.row},${pos.col}`
    
    if (cell.state === 'ship' || cell.state === 'hit') {
      results.set(key, 'hit')
    } else {
      results.set(key, 'miss')
    }
  })
  
  return results
}

export function executeAirstrike(
  direction: 'row' | 'col',
  index: number
): Position[] {
  const positions: Position[] = []
  
  if (direction === 'row') {
    for (let col = 0; col < 10; col++) {
      positions.push({ row: index, col })
    }
  } else {
    for (let row = 0; row < 10; row++) {
      positions.push({ row, col: index })
    }
  }
  
  return positions
}
