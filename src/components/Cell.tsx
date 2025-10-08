import { CellState } from '../logic/types'

interface CellProps {
  state: CellState
  onClick?: () => void
  isPlayerBoard?: boolean
  row: number
  col: number
  sonarHint?: 'hit' | 'miss'
  disabled?: boolean
}

export function Cell({ state, onClick, isPlayerBoard, row, col, sonarHint, disabled }: CellProps) {
  const getCellColor = () => {
    if (sonarHint) {
      return sonarHint === 'hit' ? 'bg-yellow-400' : 'bg-blue-200'
    }
    
    if (state === 'hit') return 'bg-red-500'
    if (state === 'miss') return 'bg-blue-300'
    if (state === 'ship' && isPlayerBoard) return 'bg-gray-600'
    return 'bg-blue-100'
  }

  const cellColor = getCellColor()

  return (
    <button
      className={`cell-button w-8 h-8 border border-gray-400 ${cellColor} hover:opacity-80 transition-opacity disabled:cursor-not-allowed`}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Cell ${String.fromCharCode(65 + row)}${col + 1}, ${state}`}
    >
      {state === 'hit' && <span className="text-white font-bold">X</span>}
      {state === 'miss' && <span className="text-white">•</span>}
    </button>
  )
}
