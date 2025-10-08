import { CellState } from '../logic/types'

interface CellProps {
  state: CellState
  onClick?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
  isPlayerBoard?: boolean
  row: number
  col: number
  sonarHint?: 'hit' | 'miss'
  disabled?: boolean
  isHoverPreview?: boolean
  isValidPreview?: boolean
}

export function Cell({ 
  state, 
  onClick, 
  onMouseEnter, 
  onMouseLeave, 
  isPlayerBoard, 
  row, 
  col, 
  sonarHint, 
  disabled,
  isHoverPreview,
  isValidPreview
}: CellProps) {
  const getCellColor = () => {
    if (isHoverPreview) {
      return isValidPreview ? 'bg-green-400 opacity-50' : 'bg-red-400 opacity-50'
    }
    
    if (sonarHint) {
      return sonarHint === 'hit' ? 'bg-yellow-400' : 'bg-blue-200'
    }
    
    if (state === 'hit') return 'bg-red-500'
    if (state === 'miss') return 'bg-blue-300'
    if (state === 'ship' && isPlayerBoard) return 'bg-gray-600'
    return 'bg-blue-100'
  }

  const getHoverClasses = () => {
    if (!isPlayerBoard && !disabled && state === 'empty') {
      return 'hover:scale-110 hover:ring-2 hover:ring-yellow-400 hover:shadow-lg'
    }
    return 'hover:opacity-80'
  }

  const cellColor = getCellColor()

  return (
    <button
      className={`cell-button w-8 h-8 border border-gray-400 ${cellColor} ${getHoverClasses()} transition-all duration-200 disabled:cursor-not-allowed`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      disabled={disabled}
      aria-label={`Cell ${String.fromCharCode(65 + row)}${col + 1}, ${state}`}
    >
      {state === 'hit' && <span className="text-white font-bold">X</span>}
      {state === 'miss' && <span className="text-white">•</span>}
    </button>
  )
}
