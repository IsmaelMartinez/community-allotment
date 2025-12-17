'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sprout, Users, Recycle, Calendar } from 'lucide-react'
import { GridPlot, PlotCell } from '@/types/garden-planner'
import { createGridPlot } from '@/lib/garden-storage'
import { checkCompanionCompatibility } from '@/lib/companion-validation'
import { getVegetableById } from '@/lib/vegetable-database'
import GardenGrid from '@/components/garden-planner/GardenGrid'

const STORAGE_KEY = 'garden-grid-2025'
const DEFAULT_ROWS = 4
const DEFAULT_COLS = 4

export default function GardenPlannerPage() {
  const [grid, setGrid] = useState<GridPlot | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setGrid(JSON.parse(saved))
      } catch {
        setGrid(createGridPlot('My Garden', DEFAULT_ROWS, DEFAULT_COLS))
      }
    } else {
      setGrid(createGridPlot('My Garden', DEFAULT_ROWS, DEFAULT_COLS))
    }
  }, [])

  // Save to localStorage
  useEffect(() => {
    if (grid) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(grid))
    }
  }, [grid])

  // Assign plant to cell
  function handleAssign(cellId: string, vegetableId: string) {
    if (!grid) return
    setGrid({
      ...grid,
      cells: grid.cells.map(cell =>
        cell.id === cellId
          ? { ...cell, vegetableId, plantedYear: new Date().getFullYear() }
          : cell
      )
    })
  }

  // Clear cell
  function handleClear(cellId: string) {
    if (!grid) return
    setGrid({
      ...grid,
      cells: grid.cells.map(cell =>
        cell.id === cellId
          ? { ...cell, vegetableId: undefined, plantedYear: undefined }
          : cell
      )
    })
  }

  // Add row
  function handleAddRow() {
    if (!grid || grid.gridRows >= 8) return
    const newRow = grid.gridRows
    const newCells: PlotCell[] = []
    for (let col = 0; col < grid.gridCols; col++) {
      newCells.push({
        id: `${grid.id}-${newRow}-${col}`,
        plotId: grid.id,
        row: newRow,
        col
      })
    }
    setGrid({
      ...grid,
      gridRows: grid.gridRows + 1,
      cells: [...grid.cells, ...newCells]
    })
  }

  // Clear all
  function handleClearAll() {
    if (!grid) return
    setGrid({
      ...grid,
      cells: grid.cells.map(cell => ({
        ...cell,
        vegetableId: undefined,
        plantedYear: undefined
      }))
    })
  }

  // Get companion tips based on what's planted
  function getCompanionTips(): string[] {
    if (!grid) return []
    const tips: string[] = []
    const plantedCells = grid.cells.filter(c => c.vegetableId)
    
    // Check pairs
    for (let i = 0; i < plantedCells.length; i++) {
      for (let j = i + 1; j < plantedCells.length; j++) {
        const veg1 = getVegetableById(plantedCells[i].vegetableId!)
        const veg2 = getVegetableById(plantedCells[j].vegetableId!)
        if (!veg1 || !veg2) continue
        
        const compat = checkCompanionCompatibility(veg1.id, veg2.id)
        if (compat === 'good') {
          tips.push(`${veg1.name} + ${veg2.name} = Great companions!`)
        } else if (compat === 'bad') {
          tips.push(`${veg1.name} + ${veg2.name} = Avoid planting together`)
        }
      }
    }
    
    return tips.slice(0, 3) // Max 3 tips
  }

  // Loading
  if (!grid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <Sprout className="w-12 h-12 text-green-600 animate-pulse" />
      </div>
    )
  }

  const tips = getCompanionTips()
  const planted = grid.cells.filter(c => c.vegetableId).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Sprout className="w-10 h-10 text-green-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Edinburgh Garden 2025</h1>
              <p className="text-sm text-gray-500">{planted} plants · Click a cell to add</p>
            </div>
          </div>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
              showCalendar ? 'bg-green-600 text-white' : 'bg-white text-gray-700 shadow hover:shadow-md'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Calendar
          </button>
        </div>

        {/* Quick Links */}
        <div className="flex gap-3 mb-6 text-sm">
          <Link 
            href="/companion-planting"
            className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full shadow-sm hover:shadow text-gray-600 hover:text-green-600"
          >
            <Users className="w-3.5 h-3.5" />
            Companions
          </Link>
          <Link 
            href="/composting"
            className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full shadow-sm hover:shadow text-gray-600 hover:text-green-600"
          >
            <Recycle className="w-3.5 h-3.5" />
            Composting
          </Link>
          <Link 
            href="/ai-advisor"
            className="flex items-center gap-1 px-3 py-1.5 bg-white rounded-full shadow-sm hover:shadow text-gray-600 hover:text-green-600"
          >
            <Sprout className="w-3.5 h-3.5" />
            Ask Aitor
          </Link>
        </div>

        {/* Calendar overlay */}
        {showCalendar && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="font-semibold text-gray-800 mb-4">Planting Calendar</h2>
            <div className="grid grid-cols-12 gap-1 text-xs">
              {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((m, i) => (
                <div key={i} className="text-center text-gray-500 font-medium">{m}</div>
              ))}
                </div>
            {grid.cells.filter(c => c.vegetableId).map(cell => {
              const veg = getVegetableById(cell.vegetableId!)
              if (!veg) return null
              return (
                <div key={cell.id} className="grid grid-cols-12 gap-1 mt-1">
                  {Array.from({ length: 12 }, (_, i) => {
                    const month = i + 1
                    const canSow = veg.planting.sowOutdoorsMonths.includes(month as 1|2|3|4|5|6|7|8|9|10|11|12) || 
                                   veg.planting.sowIndoorsMonths.includes(month as 1|2|3|4|5|6|7|8|9|10|11|12)
                    const canHarvest = veg.planting.harvestMonths.includes(month as 1|2|3|4|5|6|7|8|9|10|11|12)
                    return (
                      <div 
                        key={i} 
                        className={`h-4 rounded-sm ${
                          canHarvest ? 'bg-amber-400' : canSow ? 'bg-green-400' : 'bg-gray-100'
                        }`}
                        title={`${veg.name}: ${canSow ? 'Sow' : ''} ${canHarvest ? 'Harvest' : ''}`}
                      />
                    )
                  })}
                  <span className="col-span-12 text-xs text-gray-600 mt-0.5">{veg.name}</span>
                </div>
              )
            })}
            {planted === 0 && (
              <p className="text-gray-400 text-sm mt-4">Add plants to see their calendar</p>
            )}
            <div className="flex gap-4 mt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 rounded"></span> Sow</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-400 rounded"></span> Harvest</span>
            </div>
              </div>
            )}

        {/* Main Grid */}
        <GardenGrid
          grid={grid}
          onAssign={handleAssign}
          onClear={handleClear}
          onAddRow={handleAddRow}
          onClearAll={handleClearAll}
        />

        {/* Companion Tips */}
        {tips.length > 0 && (
          <div className="mt-4 bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Companion Tips</h3>
            <div className="space-y-1">
              {tips.map((tip, i) => (
                <p key={i} className={`text-sm ${tip.includes('Avoid') ? 'text-red-600' : 'text-green-600'}`}>
                  {tip}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
