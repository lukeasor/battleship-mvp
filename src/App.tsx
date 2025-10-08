import { useState, useEffect } from 'react'
import { Board } from './components/Board'
import { ShipTray } from './components/ShipTray'
import { Controls } from './components/Controls'
import { Modal } from './components/Modal'
import {
  GameState,
  ShipType,
  Position,
  Ship,
  AIState,
  SHIP_CONFIGS,
} from './logic/types'
import { createInitialGameState, getShipsToPlace } from './state/gameState'
import {
  createEmptyBoard,
  placeShipOnBoard,
  getShipPositions,
  canPlaceShip,
} from './logic/shipUtils'
import { createShip, generateRandomPlacement } from './logic/placement'
import { processShot, checkGameOver } from './logic/rules'
import {
  createAIState,
  getAIMove,
  updateAIStateAfterShot,
  shouldAIUseSonar,
  shouldAIUseAirstrike,
  getAIAirstrikeTarget,
  getAISonarTarget,
} from './logic/ai'
import {
  getSonarScanArea,
  getSonarResults,
  executeAirstrike,
} from './logic/powerups'

function App() {
  const [gameState, setGameState] = useState<GameState>(createInitialGameState())
  const [selectedShip, setSelectedShip] = useState<ShipType | null>(null)
  const [isHorizontal, setIsHorizontal] = useState(true)
  const [availableShips, setAvailableShips] = useState<ShipType[]>(getShipsToPlace())
  const [aiState, setAIState] = useState<AIState>(createAIState())
  const [aiFiredPositions, setAiFiredPositions] = useState<Set<string>>(new Set())
  const [playerFiredPositions, setPlayerFiredPositions] = useState<Set<string>>(new Set())
  const [sonarHints, setSonarHints] = useState<Map<string, 'hit' | 'miss'> | undefined>()
  const [showAirstrikeModal, setShowAirstrikeModal] = useState(false)
  const [konamiProgress, setKonamiProgress] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', message: '' })
  const [playerNameInput, setPlayerNameInput] = useState('')
  const [showNamePrompt, setShowNamePrompt] = useState(true)
  const [hoverPreview, setHoverPreview] = useState<{ positions: Position[]; isValid: boolean } | null>(null)
  const [currentHoverPos, setCurrentHoverPos] = useState<Position | null>(null)

  const debugMode = new URLSearchParams(window.location.search).get('debug') === '1'

  useEffect(() => {
    if (currentHoverPos && gameState.gameStatus === 'setup' && selectedShip) {
      const length = SHIP_CONFIGS[selectedShip]
      const positions = getShipPositions(currentHoverPos, length, isHorizontal)
      const isValid = canPlaceShip(gameState.playerBoard, positions)
      setHoverPreview({ positions, isValid })
    }
  }, [isHorizontal, currentHoverPos, gameState.gameStatus, selectedShip, gameState.playerBoard])

  useEffect(() => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ]
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.gameStatus === 'setup' && selectedShip && e.key === 'r') {
        setIsHorizontal(!isHorizontal)
      }

      if (konamiCode[konamiProgress] === e.code) {
        const newProgress = konamiProgress + 1
        setKonamiProgress(newProgress)
        
        if (newProgress === konamiCode.length && !gameState.airstrikeUnlocked) {
          setGameState(prev => ({
            ...prev,
            airstrikeUnlocked: true,
            airstrikeAvailable: true,
            aiAirstrikeAvailable: true,
          }))
          setModalContent({
            title: 'Airstrike Unlocked!',
            message: '💣 You can now use the Airstrike power-up once per game!',
          })
          setShowModal(true)
          setKonamiProgress(0)
        }
      } else {
        setKonamiProgress(0)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [gameState.gameStatus, selectedShip, isHorizontal, konamiProgress, gameState.airstrikeUnlocked])

  const handleStartGame = () => {
    const name = playerNameInput.trim() || 'Player'
    
    const unlockSonar = name.toUpperCase() === 'SEAWOLF'
    
    setGameState(prev => ({
      ...prev,
      playerName: name,
      sonarUnlocked: unlockSonar,
      sonarAvailable: unlockSonar,
      aiSonarAvailable: unlockSonar,
    }))
    
    setShowNamePrompt(false)
    
    if (unlockSonar) {
      setModalContent({
        title: 'Sonar Unlocked!',
        message: '🔍 You can now use the Sonar Ping power-up once per game!',
      })
      setShowModal(true)
    }
  }

  const placeAIShips = () => {
    let aiBoard = createEmptyBoard()
    const aiShips: Ship[] = []
    const allPositions: Position[] = []

    getShipsToPlace().forEach(shipType => {
      const placement = generateRandomPlacement(shipType, allPositions)
      if (placement) {
        const ship = createShip(shipType, placement.positions)
        aiShips.push(ship)
        aiBoard = placeShipOnBoard(aiBoard, ship, shipType)
        allPositions.push(...placement.positions)
      }
    })

    setGameState(prev => ({
      ...prev,
      aiBoard,
      aiShips,
    }))
  }

  const handleCellClick = (row: number, col: number) => {
    if (gameState.gameStatus === 'setup' && selectedShip) {
      const length = SHIP_CONFIGS[selectedShip]

      const positions = getShipPositions({ row, col }, length, isHorizontal)
      
      if (canPlaceShip(gameState.playerBoard, positions)) {
        const ship = createShip(selectedShip, positions)
        const newBoard = placeShipOnBoard(gameState.playerBoard, ship, selectedShip)
        
        setGameState(prev => ({
          ...prev,
          playerBoard: newBoard,
          playerShips: [...prev.playerShips, ship],
        }))
        
        const newAvailable = availableShips.filter(s => s !== selectedShip)
        setAvailableShips(newAvailable)
        setSelectedShip(null)
        setHoverPreview(null)
        setCurrentHoverPos(null)
        
        if (newAvailable.length === 0) {
          placeAIShips()
          setGameState(prev => ({
            ...prev,
            gameStatus: 'playing',
          }))
        }
      }
    } else if (
      gameState.gameStatus === 'playing' &&
      gameState.currentTurn === 'player' &&
      !playerFiredPositions.has(`${row},${col}`)
    ) {
      handlePlayerShot({ row, col })
    }
  }

  const handleCellHover = (row: number, col: number) => {
    setCurrentHoverPos({ row, col })
    if (gameState.gameStatus === 'setup' && selectedShip) {
      const length = SHIP_CONFIGS[selectedShip]
      const positions = getShipPositions({ row, col }, length, isHorizontal)
      const isValid = canPlaceShip(gameState.playerBoard, positions)
      setHoverPreview({ positions, isValid })
    }
  }

  const handleCellLeave = () => {
    setHoverPreview(null)
    setCurrentHoverPos(null)
  }

  const handlePlayerShot = (position: Position) => {
    setSonarHints(undefined)
    
    const { newBoard } = processShot(
      gameState.aiBoard,
      position,
      gameState.aiShips
    )

    setPlayerFiredPositions(prev => new Set(prev).add(`${position.row},${position.col}`))

    setGameState(prev => ({
      ...prev,
      aiBoard: newBoard,
    }))

    if (checkGameOver(gameState.aiShips)) {
      setGameState(prev => ({ ...prev, gameStatus: 'won' }))
      setModalContent({
        title: 'Victory!',
        message: 'Congratulations! You sank all enemy ships!',
      })
      setShowModal(true)
      return
    }

    setTimeout(() => {
      handleAITurn()
    }, 800)
  }

  const handleAITurn = () => {
    if (shouldAIUseAirstrike(aiState, gameState.aiAirstrikeAvailable)) {
      const target = getAIAirstrikeTarget(aiState)
      if (target) {
        const positions = executeAirstrike(target.direction, target.index)
        
        let newBoard = gameState.playerBoard
        positions.forEach(pos => {
          if (!aiFiredPositions.has(`${pos.row},${pos.col}`)) {
            const result = processShot(newBoard, pos, gameState.playerShips)
            newBoard = result.newBoard
            setAiFiredPositions(prev => new Set(prev).add(`${pos.row},${pos.col}`))
          }
        })

        setGameState(prev => ({
          ...prev,
          playerBoard: newBoard,
          aiAirstrikeAvailable: false,
        }))

        setModalContent({
          title: 'AI Used Airstrike!',
          message: `The AI launched an airstrike on ${target.direction === 'row' ? 'row ' + String.fromCharCode(65 + target.index) : 'column ' + (target.index + 1)}!`,
        })
        setShowModal(true)

        if (checkGameOver(gameState.playerShips)) {
          setGameState(prev => ({ ...prev, gameStatus: 'lost' }))
          setModalContent({
            title: 'Defeat',
            message: 'The AI has sunk all your ships. Better luck next time!',
          })
          setShowModal(true)
        }
        return
      }
    }

    if (shouldAIUseSonar(aiState, aiFiredPositions, gameState.aiSonarAvailable)) {
      const center = getAISonarTarget()
      const area = getSonarScanArea(center)
      const results = getSonarResults(gameState.playerBoard, area)
      
      const newTargets: Position[] = []
      results.forEach((result, key) => {
        if (result === 'hit') {
          const [row, col] = key.split(',').map(Number)
          newTargets.push({ row, col })
        }
      })

      setGameState(prev => ({ ...prev, aiSonarAvailable: false }))
      setAIState(prev => ({
        ...prev,
        targetQueue: [...prev.targetQueue, ...newTargets],
      }))

      setModalContent({
        title: 'AI Used Sonar!',
        message: 'The AI scanned a 3x3 area of your board!',
      })
      setShowModal(true)
      
      setTimeout(() => handleAITurn(), 1500)
      return
    }

    const { position, newAIState } = getAIMove(
      gameState.playerBoard,
      aiState,
      aiFiredPositions
    )

    const { newBoard, isHit, hitShip } = processShot(
      gameState.playerBoard,
      position,
      gameState.playerShips
    )

    const updatedAIState = updateAIStateAfterShot(
      newAIState,
      position,
      isHit,
      hitShip
    )

    setAIState(updatedAIState)
    setAiFiredPositions(prev => new Set(prev).add(`${position.row},${position.col}`))

    setGameState(prev => ({
      ...prev,
      playerBoard: newBoard,
    }))

    if (checkGameOver(gameState.playerShips)) {
      setGameState(prev => ({ ...prev, gameStatus: 'lost' }))
      setModalContent({
        title: 'Defeat',
        message: 'The AI has sunk all your ships. Better luck next time!',
      })
      setShowModal(true)
    }
  }

  const handleSonar = () => {
    const row = Math.floor(Math.random() * 10)
    const col = Math.floor(Math.random() * 10)
    const center = { row, col }
    
    const area = getSonarScanArea(center)
    const results = getSonarResults(gameState.aiBoard, area)
    
    setSonarHints(results)
    setGameState(prev => ({ ...prev, sonarAvailable: false }))
    
    setTimeout(() => {
      setSonarHints(undefined)
    }, 3000)
  }

  const handleAirstrikeInitiate = () => {
    setShowAirstrikeModal(true)
  }

  const handleAirstrikeExecute = (direction: 'row' | 'col', index: number) => {
    const positions = executeAirstrike(direction, index)
    
    let newBoard = gameState.aiBoard
    positions.forEach(pos => {
      if (!playerFiredPositions.has(`${pos.row},${pos.col}`)) {
        const result = processShot(newBoard, pos, gameState.aiShips)
        newBoard = result.newBoard
        setPlayerFiredPositions(prev => new Set(prev).add(`${pos.row},${pos.col}`))
      }
    })

    setGameState(prev => ({
      ...prev,
      aiBoard: newBoard,
      airstrikeAvailable: false,
    }))
    
    setShowAirstrikeModal(false)

    if (checkGameOver(gameState.aiShips)) {
      setGameState(prev => ({ ...prev, gameStatus: 'won' }))
      setModalContent({
        title: 'Victory!',
        message: 'Congratulations! You sank all enemy ships!',
      })
      setShowModal(true)
      return
    }

    setTimeout(() => {
      handleAITurn()
    }, 800)
  }

  const handleRestart = () => {
    setGameState(createInitialGameState())
    setSelectedShip(null)
    setAvailableShips(getShipsToPlace())
    setAIState(createAIState())
    setAiFiredPositions(new Set())
    setPlayerFiredPositions(new Set())
    setSonarHints(undefined)
    setShowModal(false)
    setShowNamePrompt(true)
    setPlayerNameInput('')
    setKonamiProgress(0)
    setHoverPreview(null)
    setCurrentHoverPos(null)
  }

  const getStatusMessage = () => {
    if (gameState.gameStatus === 'setup') return 'Place your ships'
    if (gameState.gameStatus === 'won') return 'You won!'
    if (gameState.gameStatus === 'lost') return 'You lost!'
    return 'Battle in progress'
  }

  if (showNamePrompt) {
    return (
      <div className="min-h-screen ocean-background flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <h1 className="text-3xl font-bold mb-4">Battleship</h1>
          <p className="mb-4">Enter your name to begin:</p>
          <input
            type="text"
            value={playerNameInput}
            onChange={e => setPlayerNameInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStartGame()}
            className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
            placeholder="Player name"
            autoFocus
          />
          <button
            onClick={handleStartGame}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Start Game
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ocean-background p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Battleship
        </h1>

        <div className="mb-6">
          <Controls
            gameStatus={gameState.gameStatus}
            currentTurn={gameState.currentTurn}
            statusMessage={getStatusMessage()}
            onRestart={handleRestart}
            sonarAvailable={gameState.sonarAvailable}
            airstrikeAvailable={gameState.airstrikeAvailable}
            onSonar={handleSonar}
            onAirstrike={handleAirstrikeInitiate}
            debugMode={debugMode}
            debugInfo={
              debugMode
                ? {
                    aiTargetQueueSize: aiState.targetQueue.length,
                    playerShipsRemaining: gameState.playerShips.filter(
                      s => !s.hits.every(h => h)
                    ).length,
                    aiShipsRemaining: gameState.aiShips.filter(
                      s => !s.hits.every(h => h)
                    ).length,
                  }
                : undefined
            }
          />
        </div>

        {gameState.gameStatus === 'setup' && (
          <ShipTray
            availableShips={availableShips}
            selectedShip={selectedShip}
            onSelectShip={setSelectedShip}
          />
        )}

        {gameState.gameStatus === 'setup' && selectedShip && (
          <p className="text-white mb-4">
            Press 'R' to rotate. Click on the grid to place your ship.
          </p>
        )}

        <div className="flex flex-wrap gap-8 justify-center">
          <div className="bg-white rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">Your Fleet</h2>
            <Board
              board={gameState.playerBoard}
              onCellClick={
                gameState.gameStatus === 'setup' ? handleCellClick : undefined
              }
              onCellHover={gameState.gameStatus === 'setup' ? handleCellHover : undefined}
              onCellLeave={gameState.gameStatus === 'setup' ? handleCellLeave : undefined}
              hoverPreview={hoverPreview}
              isPlayerBoard={true}
              disabled={gameState.gameStatus !== 'setup'}
            />
            <div className="mt-2 text-sm">
              Ships remaining:{' '}
              {gameState.playerShips.filter(s => !s.hits.every(h => h)).length}
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">Enemy Waters</h2>
            <Board
              board={gameState.aiBoard}
              onCellClick={
                gameState.gameStatus === 'playing' &&
                gameState.currentTurn === 'player'
                  ? handleCellClick
                  : undefined
              }
              isPlayerBoard={false}
              sonarHints={sonarHints}
              disabled={
                gameState.gameStatus !== 'playing' ||
                gameState.currentTurn !== 'player'
              }
            />
            <div className="mt-2 text-sm">
              Ships remaining:{' '}
              {gameState.aiShips.filter(s => !s.hits.every(h => h)).length}
            </div>
          </div>
        </div>

        <Modal
          isOpen={showModal}
          title={modalContent.title}
          message={modalContent.message}
          onClose={() => setShowModal(false)}
          buttonText={
            gameState.gameStatus === 'won' || gameState.gameStatus === 'lost'
              ? 'Play Again'
              : 'OK'
          }
        />

        {showAirstrikeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Choose Airstrike Target</h2>
              <p className="mb-4">Select a row or column to attack:</p>
              
              <div className="mb-4">
                <h3 className="font-bold mb-2">Rows:</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 10 }, (_, i) => (
                    <button
                      key={`row-${i}`}
                      onClick={() => handleAirstrikeExecute('row', i)}
                      className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
                    >
                      {String.fromCharCode(65 + i)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-bold mb-2">Columns:</h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 10 }, (_, i) => (
                    <button
                      key={`col-${i}`}
                      onClick={() => handleAirstrikeExecute('col', i)}
                      className="px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700"
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowAirstrikeModal(false)}
                className="w-full px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
