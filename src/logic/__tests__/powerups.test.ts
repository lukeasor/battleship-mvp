import { describe, it, expect } from 'vitest'
import { getSonarScanArea, getSonarResults, executeAirstrike } from '../powerups'
import { createEmptyBoard, placeShipOnBoard } from '../shipUtils'
import { createShip } from '../placement'

describe('powerups', () => {
  describe('getSonarScanArea', () => {
    it('should return 3x3 area around center', () => {
      const area = getSonarScanArea({ row: 5, col: 5 })
      expect(area.length).toBe(9)
      
      expect(area).toContainEqual({ row: 4, col: 4 })
      expect(area).toContainEqual({ row: 4, col: 5 })
      expect(area).toContainEqual({ row: 4, col: 6 })
      expect(area).toContainEqual({ row: 5, col: 4 })
      expect(area).toContainEqual({ row: 5, col: 5 })
      expect(area).toContainEqual({ row: 5, col: 6 })
      expect(area).toContainEqual({ row: 6, col: 4 })
      expect(area).toContainEqual({ row: 6, col: 5 })
      expect(area).toContainEqual({ row: 6, col: 6 })
    })

    it('should handle edge cases', () => {
      const area = getSonarScanArea({ row: 0, col: 0 })
      expect(area.length).toBe(4)
      expect(area).toContainEqual({ row: 0, col: 0 })
      expect(area).toContainEqual({ row: 0, col: 1 })
      expect(area).toContainEqual({ row: 1, col: 0 })
      expect(area).toContainEqual({ row: 1, col: 1 })
    })
  })

  describe('getSonarResults', () => {
    it('should correctly identify hits and misses', () => {
      const ship = createShip('Destroyer', [
        { row: 5, col: 5 },
        { row: 5, col: 6 },
      ])
      let board = createEmptyBoard()
      board = placeShipOnBoard(board, ship, 'test')

      const positions = [
        { row: 5, col: 5 },
        { row: 5, col: 6 },
        { row: 5, col: 7 },
      ]
      const results = getSonarResults(board, positions)

      expect(results.get('5,5')).toBe('hit')
      expect(results.get('5,6')).toBe('hit')
      expect(results.get('5,7')).toBe('miss')
    })
  })

  describe('executeAirstrike', () => {
    it('should return all cells in a row', () => {
      const positions = executeAirstrike('row', 5)
      expect(positions.length).toBe(10)
      expect(positions.every(p => p.row === 5)).toBe(true)
    })

    it('should return all cells in a column', () => {
      const positions = executeAirstrike('col', 5)
      expect(positions.length).toBe(10)
      expect(positions.every(p => p.col === 5)).toBe(true)
    })
  })
})
