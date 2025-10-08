import { Board as BoardType, Position } from '../logic/types'
import { Cell } from './Cell'

interface BoardProps {
  board: BoardType
  onCellClick?: (row: number, col: number) => void
  onCellHover?: (row: number, col: number) => void
  onCellLeave?: () => void
  hoverPreview?: { positions: Position[]; isValid: boolean } | null
  isPlayerBoard?: boolean
  sonarHints?: Map<string, 'hit' | 'miss'>
  disabled?: boolean
}

export function Board({ board, onCellClick, onCellHover, onCellLeave, hoverPreview, isPlayerBoard, sonarHints, disabled }: BoardProps) {
  return (
    <div className="inline-block">
      <div className="flex mb-1">
        <div className="w-8" />
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="w-8 text-center text-sm font-semibold">
            {i + 1}
          </div>
        ))}
      </div>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          <div className="w-8 flex items-center justify-center text-sm font-semibold">
            {String.fromCharCode(65 + rowIndex)}
          </div>
          {row.map((cell, colIndex) => {
            const isInHoverPreview = hoverPreview?.positions.some(
              p => p.row === rowIndex && p.col === colIndex
            )
            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                state={cell.state}
                onClick={() => onCellClick?.(rowIndex, colIndex)}
                onMouseEnter={() => onCellHover?.(rowIndex, colIndex)}
                onMouseLeave={onCellLeave}
                isPlayerBoard={isPlayerBoard}
                row={rowIndex}
                col={colIndex}
                sonarHint={sonarHints?.get(`${rowIndex},${colIndex}`)}
                disabled={disabled}
                isHoverPreview={isInHoverPreview}
                isValidPreview={hoverPreview?.isValid}
              />
            )
          })}
        </div>
      ))}
    </div>
  )
}
