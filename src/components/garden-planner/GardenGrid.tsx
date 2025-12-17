'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, X, Trash2, Search } from 'lucide-react'
import { GridPlot, PlotCell, CATEGORY_INFO } from '@/types/garden-planner'
import { vegetables, getVegetableById } from '@/lib/vegetable-database'
import { checkCompanionCompatibility } from '@/lib/companion-validation'

interface GardenGridProps {
  grid: GridPlot
  onAssign: (cellId: string, vegetableId: string) => void
  onClear: (cellId: string) => void
  onAddRow: () => void
  onClearAll: () => void
}

export default function GardenGrid({ grid, onAssign, onClear, onAddRow, onClearAll }: GardenGridProps) {
  const [activeCell, setActiveCell] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveCell(null)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Focus search when dropdown opens
  useEffect(() => {
    if (activeCell && searchRef.current) {
      searchRef.current.focus()
    }
  }, [activeCell])

  // Get compatibility color for a plant based on what's already planted
  function getCompatibility(vegetableId: string): 'good' | 'neutral' | 'bad' {
    const plantedVegIds = grid.cells
      .filter(c => c.vegetableId && c.id !== activeCell)
      .map(c => c.vegetableId!)

    if (plantedVegIds.length === 0) return 'neutral'

    let hasGood = false
    let hasBad = false

    for (const plantedId of plantedVegIds) {
      const compat = checkCompanionCompatibility(vegetableId, plantedId)
      if (compat === 'good') hasGood = true
      if (compat === 'bad') hasBad = true
    }

    if (hasBad) return 'bad'
    if (hasGood) return 'good'
    return 'neutral'
  }

  // Build cells into rows
  const rows: PlotCell[][] = []
  for (let r = 0; r < grid.gridRows; r++) {
    const row: PlotCell[] = []
    for (let c = 0; c < grid.gridCols; c++) {
      const cell = grid.cells.find(cell => cell.row === r && cell.col === c)
      if (cell) row.push(cell)
    }
    rows.push(row)
  }

  // Filter plants
  const filteredPlants = vegetables.filter(v =>
    !search || v.name.toLowerCase().includes(search.toLowerCase())
  )

  const planted = grid.cells.filter(c => c.vegetableId).length

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Grid */}
      <div className="p-4">
        <div className="space-y-2">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-2">
              {row.map(cell => {
                const veg = cell.vegetableId ? getVegetableById(cell.vegetableId) : null
                const isActive = activeCell === cell.id

                return (
                  <div key={cell.id} className="relative flex-1">
                    <button
                      onClick={() => {
                        setActiveCell(isActive ? null : cell.id)
                        setSearch('')
                      }}
                      className={`
                        w-full aspect-square rounded-lg border-2 transition-all
                        flex flex-col items-center justify-center p-2
                        ${isActive
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                          : veg
                            ? 'border-green-200 bg-green-50 hover:border-green-300'
                            : 'border-dashed border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }
                      `}
                    >
                      {veg ? (
                        <>
                          <span 
                            className="text-2xl mb-1"
                            style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))' }}
                          >
                            {getPlantEmoji(veg.category)}
                          </span>
                          <span className="text-xs font-medium text-gray-700 text-center leading-tight line-clamp-1">
                            {veg.name}
                          </span>
                        </>
                      ) : (
                        <Plus className="w-5 h-5 text-gray-300" />
                      )}
                    </button>

                    {/* Inline dropdown */}
                    {isActive && (
                      <div
                        ref={dropdownRef}
                        className="absolute z-50 top-full left-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden"
                        style={{ minWidth: '16rem' }}
                      >
                        {/* Search */}
                        <div className="p-2 border-b">
                          <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              ref={searchRef}
                              type="text"
                              placeholder="Search plants..."
                              value={search}
                              onChange={(e) => setSearch(e.target.value)}
                              className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                        </div>

                        {/* Legend */}
                        <div className="px-2 py-1.5 bg-gray-50 border-b flex gap-3 text-[10px] text-gray-500">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span> Good
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-blue-400"></span> Neutral
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span> Avoid
                          </span>
                        </div>

                        {/* Plant list */}
                        <div className="max-h-48 overflow-y-auto">
                          {filteredPlants.map(plant => {
                            const compat = getCompatibility(plant.id)
                            const bgColor = compat === 'good' 
                              ? 'bg-green-50 hover:bg-green-100' 
                              : compat === 'bad'
                              ? 'bg-red-50 hover:bg-red-100'
                              : 'bg-white hover:bg-gray-50'
                            const borderColor = compat === 'good'
                              ? 'border-l-green-500'
                              : compat === 'bad'
                              ? 'border-l-red-500'
                              : 'border-l-blue-300'

                            return (
                              <button
                                key={plant.id}
                                onClick={() => {
                                  onAssign(cell.id, plant.id)
                                  setActiveCell(null)
                                  setSearch('')
                                }}
                                className={`w-full px-3 py-2 text-left flex items-center gap-2 border-l-4 ${bgColor} ${borderColor}`}
                              >
                                <span className="text-lg">{getPlantEmoji(plant.category)}</span>
                                <div className="min-w-0 flex-1">
                                  <div className="text-sm font-medium text-gray-800 truncate">{plant.name}</div>
                                  <div className="text-[10px] text-gray-500 truncate">
                                    {CATEGORY_INFO.find(c => c.id === plant.category)?.name}
                                  </div>
                                </div>
                              </button>
                            )
                          })}
                        </div>

                        {/* Remove option if cell has plant */}
                        {veg && (
                          <div className="p-2 border-t">
                            <button
                              onClick={() => {
                                onClear(cell.id)
                                setActiveCell(null)
                              }}
                              className="w-full py-1.5 text-sm text-red-600 hover:bg-red-50 rounded flex items-center justify-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" />
                              Remove {veg.name}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Add Row button */}
        {grid.gridRows < 8 && (
          <button
            onClick={onAddRow}
            className="w-full mt-3 py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 hover:border-gray-300 hover:text-gray-500 transition flex items-center justify-center gap-1 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Row
          </button>
        )}
      </div>

      {/* Footer */}
      {planted > 0 && (
        <div className="px-4 py-3 bg-gray-50 border-t flex items-center justify-between">
          <span className="text-sm text-gray-500">{planted} plants in your garden</span>
          <button
            onClick={onClearAll}
            className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        </div>
      )}
    </div>
  )
}

// Simple emoji mapping for categories
function getPlantEmoji(category: string): string {
  const emojis: Record<string, string> = {
    'leafy-greens': '🥬',
    'root-vegetables': '🥕',
    'brassicas': '🥦',
    'legumes': '🫛',
    'solanaceae': '🍅',
    'cucurbits': '🥒',
    'alliums': '🧅',
    'herbs': '🌿'
  }
  return emojis[category] || '🌱'
}

