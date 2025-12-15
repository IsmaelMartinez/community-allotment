'use client'

import { useState } from 'react'
import { Grid3X3, MapPin, Leaf, AlertCircle, Plus } from 'lucide-react'
import { PlannedVegetable, GardenPlot, CATEGORY_INFO } from '@/types/garden-planner'
import { getVegetableById } from '@/lib/vegetable-database'

interface PlotViewProps {
  vegetables: PlannedVegetable[]
  plots: GardenPlot[]
  onAssignVegetable: (vegetableInstanceId: string, plotId: string | undefined) => void
}

export default function PlotView({ vegetables, plots, onAssignVegetable }: PlotViewProps) {
  const [draggedVegetable, setDraggedVegetable] = useState<string | null>(null)
  const [dragOverPlot, setDragOverPlot] = useState<string | null>(null)

  const getVegetablesForPlot = (plotId: string) => {
    return vegetables.filter(v => v.plotId === plotId)
  }

  const getUnassignedVegetables = () => {
    return vegetables.filter(v => !v.plotId)
  }

  const getCategoryColor = (category: string) => {
    const info = CATEGORY_INFO.find(c => c.id === category)
    const colors: Record<string, string> = {
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      purple: 'bg-purple-500',
      lime: 'bg-lime-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      amber: 'bg-amber-500',
      emerald: 'bg-emerald-500'
    }
    return colors[info?.color || 'green']
  }

  const handleDragStart = (e: React.DragEvent, vegetableId: string) => {
    setDraggedVegetable(vegetableId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', vegetableId)
  }

  const handleDragEnd = () => {
    setDraggedVegetable(null)
    setDragOverPlot(null)
  }

  const handleDragOver = (e: React.DragEvent, plotId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverPlot(plotId)
  }

  const handleDragLeave = () => {
    setDragOverPlot(null)
  }

  const handleDrop = (e: React.DragEvent, plotId: string | undefined) => {
    e.preventDefault()
    const vegetableId = e.dataTransfer.getData('text/plain')
    if (vegetableId) {
      onAssignVegetable(vegetableId, plotId)
    }
    setDraggedVegetable(null)
    setDragOverPlot(null)
  }

  const unassigned = getUnassignedVegetables()

  if (plots.length === 0 && vegetables.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Grid3X3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No plots or vegetables yet</h3>
        <p className="text-gray-500">Create garden plots and add vegetables to see the visual layout.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Unassigned Vegetables */}
      {unassigned.length > 0 && (
        <div
          className={`bg-white rounded-lg shadow-md p-4 border-2 border-dashed transition ${
            dragOverPlot === 'unassigned' ? 'border-amber-400 bg-amber-50' : 'border-gray-300'
          }`}
          onDragOver={(e) => handleDragOver(e, 'unassigned')}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, undefined)}
        >
          <div className="flex items-center mb-4">
            <AlertCircle className="w-5 h-5 text-amber-500 mr-2" />
            <h3 className="font-semibold text-gray-800">Unassigned Vegetables</h3>
            <span className="ml-2 text-sm text-gray-500">({unassigned.length})</span>
          </div>
          <p className="text-sm text-gray-500 mb-4">Drag these vegetables onto a plot to assign them.</p>
          <div className="flex flex-wrap gap-2">
            {unassigned.map(veg => {
              const vegInfo = getVegetableById(veg.vegetableId)
              if (!vegInfo) return null
              
              return (
                <div
                  key={veg.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, veg.id)}
                  onDragEnd={handleDragEnd}
                  className={`px-3 py-2 rounded-lg border cursor-move transition flex items-center gap-2 ${
                    draggedVegetable === veg.id
                      ? 'border-green-500 bg-green-50 opacity-50'
                      : 'border-gray-200 bg-white hover:border-green-400 hover:shadow-md'
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full ${getCategoryColor(vegInfo.category)}`} />
                  <span className="font-medium text-sm">{vegInfo.name}</span>
                  <span className="text-xs text-gray-500">×{veg.quantity}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Garden Plots Grid */}
      {plots.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Grid3X3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No garden plots created</h3>
          <p className="text-gray-500">Create plots using the Plot Manager to organize your vegetables visually.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plots.map(plot => {
            const plotVegetables = getVegetablesForPlot(plot.id)
            const isDropTarget = dragOverPlot === plot.id

            return (
              <div
                key={plot.id}
                className={`bg-white rounded-lg shadow-md overflow-hidden border-2 transition ${
                  isDropTarget ? 'border-green-500 shadow-lg' : 'border-transparent'
                }`}
                onDragOver={(e) => handleDragOver(e, plot.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, plot.id)}
              >
                {/* Plot Header */}
                <div 
                  className="px-4 py-3 flex items-center justify-between"
                  style={{ backgroundColor: `${plot.color}30` }}
                >
                  <div className="flex items-center">
                    <div
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: plot.color }}
                    />
                    <h3 className="font-semibold text-gray-800">{plot.name}</h3>
                  </div>
                  <span className="text-xs text-gray-500">
                    {plot.width}m × {plot.length}m
                  </span>
                </div>

                {/* Plot Content - Visual Grid */}
                <div 
                  className="p-4 min-h-[200px] relative"
                  style={{
                    background: isDropTarget 
                      ? `repeating-linear-gradient(45deg, ${plot.color}10, ${plot.color}10 10px, ${plot.color}20 10px, ${plot.color}20 20px)`
                      : `repeating-linear-gradient(0deg, ${plot.color}08, ${plot.color}08 20px, transparent 20px, transparent 40px), repeating-linear-gradient(90deg, ${plot.color}08, ${plot.color}08 20px, transparent 20px, transparent 40px)`
                  }}
                >
                  {plotVegetables.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <MapPin className="w-8 h-8 mb-2 opacity-50" />
                      <p className="text-sm">Drop vegetables here</p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {plotVegetables.map(veg => {
                        const vegInfo = getVegetableById(veg.vegetableId)
                        if (!vegInfo) return null

                        return (
                          <div
                            key={veg.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, veg.id)}
                            onDragEnd={handleDragEnd}
                            className={`group relative px-3 py-2 rounded-lg shadow-sm cursor-move transition ${
                              draggedVegetable === veg.id
                                ? 'opacity-50 scale-95'
                                : 'hover:shadow-md'
                            }`}
                            style={{ 
                              backgroundColor: 'white',
                              borderLeft: `4px solid ${plot.color}`
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <Leaf className={`w-4 h-4 ${getCategoryColor(vegInfo.category).replace('bg-', 'text-')}`} />
                              <span className="font-medium text-sm text-gray-800">{vegInfo.name}</span>
                              <span className="text-xs text-gray-500 bg-gray-100 px-1.5 rounded">
                                ×{veg.quantity}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Plot Footer */}
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {plotVegetables.length} {plotVegetables.length === 1 ? 'vegetable' : 'vegetables'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {(plot.width * plot.length).toFixed(1)}m² area
                  </span>
                </div>
              </div>
            )
          })}

          {/* Add Plot Placeholder */}
          <div className="bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 p-8 flex flex-col items-center justify-center text-gray-400 min-h-[200px]">
            <Plus className="w-8 h-8 mb-2" />
            <p className="text-sm text-center">
              Use the Plot Manager<br />to add more plots
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Vegetable Categories</h4>
        <div className="flex flex-wrap gap-3">
          {CATEGORY_INFO.map(cat => (
            <div key={cat.id} className="flex items-center text-sm">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                cat.color === 'green' ? 'bg-green-500' :
                cat.color === 'orange' ? 'bg-orange-500' :
                cat.color === 'purple' ? 'bg-purple-500' :
                cat.color === 'lime' ? 'bg-lime-500' :
                cat.color === 'red' ? 'bg-red-500' :
                cat.color === 'yellow' ? 'bg-yellow-500' :
                cat.color === 'amber' ? 'bg-amber-500' :
                'bg-emerald-500'
              }`} />
              <span className="text-gray-600">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Help Text */}
      <div className="text-center text-sm text-gray-500">
        <p>Drag and drop vegetables between plots to organize your garden layout.</p>
      </div>
    </div>
  )
}

