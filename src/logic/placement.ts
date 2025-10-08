import { Ship, ShipType, SHIP_CONFIGS, Position } from './types'
import { getShipPositions } from './shipUtils'

export function createShip(type: ShipType, positions: Position[]): Ship {
  const length = SHIP_CONFIGS[type]
  return {
    type,
    length,
    positions,
    hits: Array(length).fill(false),
  }
}

export function validatePlacement(
  positions: Position[],
  length: number
): boolean {
  if (positions.length !== length) return false
  
  if (positions.length === 0) return false
  
  const isHorizontal = positions.every(p => p.row === positions[0].row)
  const isVertical = positions.every(p => p.col === positions[0].col)
  
  if (!isHorizontal && !isVertical) return false
  
  const sorted = [...positions].sort((a, b) => 
    isHorizontal ? a.col - b.col : a.row - b.row
  )
  
  for (let i = 1; i < sorted.length; i++) {
    const diff = isHorizontal 
      ? sorted[i].col - sorted[i - 1].col
      : sorted[i].row - sorted[i - 1].row
    if (diff !== 1) return false
  }
  
  return true
}

export function generateRandomPlacement(
  type: ShipType,
  existingPositions: Position[]
): { positions: Position[]; isHorizontal: boolean } | null {
  const length = SHIP_CONFIGS[type]
  const maxAttempts = 100
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const isHorizontal = Math.random() < 0.5
    const maxRow = isHorizontal ? 9 : 10 - length
    const maxCol = isHorizontal ? 10 - length : 9
    
    const startPos: Position = {
      row: Math.floor(Math.random() * (maxRow + 1)),
      col: Math.floor(Math.random() * (maxCol + 1)),
    }
    
    const positions = getShipPositions(startPos, length, isHorizontal)
    
    const hasOverlap = positions.some(pos =>
      existingPositions.some(
        existing => existing.row === pos.row && existing.col === pos.col
      )
    )
    
    if (!hasOverlap && validatePlacement(positions, length)) {
      return { positions, isHorizontal }
    }
  }
  
  return null
}
