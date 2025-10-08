interface ControlsProps {
  gameStatus: string
  currentTurn: string
  statusMessage: string
  onRestart?: () => void
  sonarAvailable?: boolean
  airstrikeAvailable?: boolean
  onSonar?: () => void
  onAirstrike?: () => void
  debugMode?: boolean
  debugInfo?: {
    aiTargetQueueSize: number
    playerShipsRemaining: number
    aiShipsRemaining: number
  }
}

export function Controls({
  gameStatus,
  currentTurn,
  statusMessage,
  onRestart,
  sonarAvailable,
  airstrikeAvailable,
  onSonar,
  onAirstrike,
  debugMode,
  debugInfo,
}: ControlsProps) {
  return (
    <div className="bg-gray-100 p-4 rounded">
      <div className="mb-4">
        <p className="text-xl font-bold">{statusMessage}</p>
        {gameStatus === 'playing' && (
          <p className="text-gray-600">
            {currentTurn === 'player' ? 'Your turn' : 'AI is thinking...'}
          </p>
        )}
      </div>

      {gameStatus === 'playing' && currentTurn === 'player' && (
        <div className="flex gap-2 mb-4">
          {sonarAvailable && (
            <button
              onClick={onSonar}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              🔍 Sonar Ping
            </button>
          )}
          {airstrikeAvailable && (
            <button
              onClick={onAirstrike}
              className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
            >
              💣 Airstrike
            </button>
          )}
        </div>
      )}

      {(gameStatus === 'won' || gameStatus === 'lost') && (
        <button
          onClick={onRestart}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Play Again
        </button>
      )}

      {debugMode && debugInfo && (
        <div className="mt-4 p-2 bg-yellow-100 text-xs">
          <p>AI Target Queue: {debugInfo.aiTargetQueueSize}</p>
          <p>Player Ships: {debugInfo.playerShipsRemaining}</p>
          <p>AI Ships: {debugInfo.aiShipsRemaining}</p>
        </div>
      )}
    </div>
  )
}
