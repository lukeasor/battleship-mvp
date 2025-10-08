import { describe, it, expect } from 'vitest'
import { processShot, checkGameOver } from '../rules'
import { createEmptyBoard, placeShipOnBoard } from '../shipUtils'
import { createShip } from '../placement'

describe('rules', () => {
  describe('processShot', () => {
    it('should register a hit on a ship', () => {
      const ship = createShip('Destroyer', [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ])
      let board = createEmptyBoard()
      board = placeShipOnBoard(board, ship, 'test')

      const { newBoard, isHit } = processShot(board, { row: 0, col: 0 }, [ship])

      expect(isHit).toBe(true)
      expect(newBoard[0][0].state).toBe('hit')
      expect(ship.hits[0]).toBe(true)
    })

    it('should register a miss on empty cell', () => {
      const board = createEmptyBoard()
      const { newBoard, isHit } = processShot(board, { row: 0, col: 0 }, [])

      expect(isHit).toBe(false)
      expect(newBoard[0][0].state).toBe('miss')
    })
  })

  describe('checkGameOver', () => {
    it('should return true when all ships are sunk', () => {
      const ship1 = createShip('Destroyer', [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ])
      ship1.hits = [true, true]

      const ship2 = createShip('Submarine', [
        { row: 2, col: 2 },
        { row: 3, col: 2 },
        { row: 4, col: 2 },
      ])
      ship2.hits = [true, true, true]

      expect(checkGameOver([ship1, ship2])).toBe(true)
    })

    it('should return false when some ships are still afloat', () => {
      const ship1 = createShip('Destroyer', [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
      ])
      ship1.hits = [true, true]

      const ship2 = createShip('Submarine', [
        { row: 2, col: 2 },
        { row: 3, col: 2 },
        { row: 4, col: 2 },
      ])
      ship2.hits = [true, false, true]

      expect(checkGameOver([ship1, ship2])).toBe(false)
    })
  })
})
