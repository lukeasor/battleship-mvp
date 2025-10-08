import { describe, it, expect } from 'vitest'
import { createAIState, getAIMove, updateAIStateAfterShot } from '../ai'
import { createEmptyBoard } from '../shipUtils'
import { createShip } from '../placement'

describe('ai', () => {
  describe('getAIMove', () => {
    it('should not repeat shots', () => {
      const board = createEmptyBoard()
      const aiState = createAIState()
      const firedPositions = new Set<string>()

      const moves: string[] = []
      for (let i = 0; i < 10; i++) {
        const { position } = getAIMove(board, aiState, firedPositions)
        const key = `${position.row},${position.col}`
        moves.push(key)
        firedPositions.add(key)
      }

      const uniqueMoves = new Set(moves)
      expect(uniqueMoves.size).toBe(10)
    })

    it('should enter target mode after a hit', () => {
      const aiState = createAIState()
      const ship = createShip('Destroyer', [
        { row: 5, col: 5 },
        { row: 5, col: 6 },
      ])

      const updatedState = updateAIStateAfterShot(
        aiState,
        { row: 5, col: 5 },
        true,
        ship
      )

      expect(updatedState.mode).toBe('target')
      expect(updatedState.targetQueue.length).toBeGreaterThan(0)
      expect(updatedState.lastHit).toEqual({ row: 5, col: 5 })
    })

    it('should return to hunt mode after sinking a ship', () => {
      const ship = createShip('Destroyer', [
        { row: 5, col: 5 },
        { row: 5, col: 6 },
      ])
      ship.hits = [true, true]

      const aiState = createAIState()
      const updatedState = updateAIStateAfterShot(
        aiState,
        { row: 5, col: 6 },
        true,
        ship
      )

      expect(updatedState.mode).toBe('hunt')
      expect(updatedState.targetQueue.length).toBe(0)
    })
  })
})
