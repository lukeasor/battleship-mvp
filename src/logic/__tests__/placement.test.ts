import { describe, it, expect } from 'vitest'
import { validatePlacement, generateRandomPlacement } from '../placement'
import { Position } from '../types'

describe('placement', () => {
  describe('validatePlacement', () => {
    it('should validate horizontal ship placement', () => {
      const positions: Position[] = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ]
      expect(validatePlacement(positions, 3)).toBe(true)
    })

    it('should validate vertical ship placement', () => {
      const positions: Position[] = [
        { row: 0, col: 0 },
        { row: 1, col: 0 },
        { row: 2, col: 0 },
      ]
      expect(validatePlacement(positions, 3)).toBe(true)
    })

    it('should reject diagonal placement', () => {
      const positions: Position[] = [
        { row: 0, col: 0 },
        { row: 1, col: 1 },
        { row: 2, col: 2 },
      ]
      expect(validatePlacement(positions, 3)).toBe(false)
    })

    it('should reject non-contiguous placement', () => {
      const positions: Position[] = [
        { row: 0, col: 0 },
        { row: 0, col: 2 },
        { row: 0, col: 4 },
      ]
      expect(validatePlacement(positions, 3)).toBe(false)
    })

    it('should reject wrong length', () => {
      const positions: Position[] = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ]
      expect(validatePlacement(positions, 3)).toBe(false)
    })
  })

  describe('generateRandomPlacement', () => {
    it('should generate valid placement without overlaps', () => {
      const result = generateRandomPlacement('Destroyer', [])
      expect(result).not.toBeNull()
      expect(result?.positions.length).toBe(2)
      expect(validatePlacement(result!.positions, 2)).toBe(true)
    })

    it('should avoid existing positions', () => {
      const existing: Position[] = [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 0, col: 2 },
      ]
      const result = generateRandomPlacement('Destroyer', existing)
      
      if (result) {
        const hasOverlap = result.positions.some(pos =>
          existing.some(e => e.row === pos.row && e.col === pos.col)
        )
        expect(hasOverlap).toBe(false)
      }
    })
  })
})
