import { ShipType, SHIP_CONFIGS } from '../logic/types'

interface ShipTrayProps {
  availableShips: ShipType[]
  selectedShip: ShipType | null
  onSelectShip: (ship: ShipType) => void
}

export function ShipTray({ availableShips, selectedShip, onSelectShip }: ShipTrayProps) {
  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">Select Ship to Place:</h3>
      <div className="flex flex-wrap gap-2">
        {availableShips.map(ship => (
          <button
            key={ship}
            onClick={() => onSelectShip(ship)}
            className={`px-4 py-2 rounded ${
              selectedShip === ship
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {ship} ({SHIP_CONFIGS[ship]})
          </button>
        ))}
      </div>
    </div>
  )
}
