import { Board, Position, AIState, Ship } from './types'
import { getAdjacentCells } from './shipUtils'

export function createAIState(): AIState {
  return {
    mode: 'hunt',
    targetQueue: [],
    hitCells: [],
  }
}

export function getAIMove(
  board: Board,
  aiState: AIState,
  firedPositions: Set<string>
): { position: Position; newAIState: AIState } {
  let position: Position

  if (aiState.mode === 'target' && aiState.targetQueue.length > 0) {
    position = aiState.targetQueue.shift()!
    
    while (firedPositions.has(`${position.row},${position.col}`)) {
      if (aiState.targetQueue.length === 0) {
        aiState.mode = 'hunt'
        return getAIMove(board, aiState, firedPositions)
      }
      position = aiState.targetQueue.shift()!
    }
  } else {
    position = getRandomUnfiredPosition(firedPositions)
  }

  return {
    position,
    newAIState: { ...aiState },
  }
}

export function updateAIStateAfterShot(
  aiState: AIState,
  position: Position,
  isHit: boolean,
  ship?: Ship
): AIState {
  const newState = { ...aiState }

  if (isHit) {
    newState.hitCells = [...newState.hitCells, position]
    
    if (ship && ship.hits.every(h => h)) {
      newState.mode = 'hunt'
      newState.targetQueue = []
      newState.lastHit = undefined
    } else {
      newState.mode = 'target'
      newState.lastHit = position
      
      const adjacentCells = getAdjacentCells(position)
      adjacentCells.forEach(cell => {
        const alreadyQueued = newState.targetQueue.some(
          q => q.row === cell.row && q.col === cell.col
        )
        if (!alreadyQueued) {
          newState.targetQueue.push(cell)
        }
      })
    }
  }

  return newState
}

function getRandomUnfiredPosition(firedPositions: Set<string>): Position {
  let position: Position
  do {
    position = {
      row: Math.floor(Math.random() * 10),
      col: Math.floor(Math.random() * 10),
    }
  } while (firedPositions.has(`${position.row},${position.col}`))
  
  return position
}

export function hasAIFired(firedPositions: Set<string>, pos: Position): boolean {
  return firedPositions.has(`${pos.row},${pos.col}`)
}
