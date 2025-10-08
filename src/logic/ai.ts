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

export function shouldAIUseSonar(
  aiState: AIState,
  firedPositions: Set<string>,
  sonarAvailable: boolean
): boolean {
  if (!sonarAvailable) return false
  
  if (aiState.mode === 'hunt' && firedPositions.size < 15) {
    return Math.random() < 0.2
  }
  
  return false
}

export function shouldAIUseAirstrike(
  aiState: AIState,
  airstrikeAvailable: boolean
): boolean {
  if (!airstrikeAvailable) return false
  
  if (aiState.mode === 'target' && aiState.hitCells.length >= 2) {
    const firstHit = aiState.hitCells[0]
    const hasHorizontalPattern = aiState.hitCells.some(
      hit => hit.row === firstHit.row && hit.col !== firstHit.col
    )
    const hasVerticalPattern = aiState.hitCells.some(
      hit => hit.col === firstHit.col && hit.row !== firstHit.row
    )
    
    return hasHorizontalPattern || hasVerticalPattern
  }
  
  return false
}

export function getAIAirstrikeTarget(aiState: AIState): { direction: 'row' | 'col'; index: number } | null {
  if (aiState.hitCells.length < 2) return null
  
  const firstHit = aiState.hitCells[0]
  const hasHorizontalPattern = aiState.hitCells.some(
    hit => hit.row === firstHit.row && hit.col !== firstHit.col
  )
  
  if (hasHorizontalPattern) {
    return { direction: 'row', index: firstHit.row }
  } else {
    return { direction: 'col', index: firstHit.col }
  }
}

export function getAISonarTarget(): Position {
  return {
    row: Math.floor(Math.random() * 10),
    col: Math.floor(Math.random() * 10),
  }
}
