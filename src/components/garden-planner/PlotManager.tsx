'use client'

import { useState } from 'react'
import { Grid3X3, Plus, Edit3, Trash2, Check, X, Palette } from 'lucide-react'
import { GardenPlot, PLOT_COLORS } from '@/types/garden-planner'
import { createPlot } from '@/lib/garden-storage'

interface PlotManagerProps {
  plots: GardenPlot[]
  onAddPlot: (plot: GardenPlot) => void
  onUpdatePlot: (plotId: string, updates: Partial<GardenPlot>) => void
  onDeletePlot: (plotId: string) => void
}

export default function PlotManager({ plots, onAddPlot, onUpdatePlot, onDeletePlot }: PlotManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPlotName, setNewPlotName] = useState('')
  const [newPlotWidth, setNewPlotWidth] = useState(2)
  const [newPlotLength, setNewPlotLength] = useState(4)
  const [newPlotDescription, setNewPlotDescription] = useState('')
  const [newPlotColor, setNewPlotColor] = useState(PLOT_COLORS[0])
  
  const [editingPlotId, setEditingPlotId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editWidth, setEditWidth] = useState(2)
  const [editLength, setEditLength] = useState(4)
  const [editColor, setEditColor] = useState('')

  const handleCreatePlot = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPlotName.trim()) return

    const plot: GardenPlot = {
      ...createPlot(newPlotName.trim(), newPlotWidth, newPlotLength),
      description: newPlotDescription.trim() || undefined,
      color: newPlotColor
    }
    
    onAddPlot(plot)
    resetCreateForm()
  }

  const resetCreateForm = () => {
    setNewPlotName('')
    setNewPlotWidth(2)
    setNewPlotLength(4)
    setNewPlotDescription('')
    setNewPlotColor(PLOT_COLORS[Math.floor(Math.random() * PLOT_COLORS.length)])
    setShowCreateForm(false)
  }

  const handleStartEdit = (plot: GardenPlot) => {
    setEditingPlotId(plot.id)
    setEditName(plot.name)
    setEditWidth(plot.width)
    setEditLength(plot.length)
    setEditColor(plot.color)
  }

  const handleSaveEdit = () => {
    if (editingPlotId && editName.trim()) {
      onUpdatePlot(editingPlotId, {
        name: editName.trim(),
        width: editWidth,
        length: editLength,
        color: editColor
      })
    }
    setEditingPlotId(null)
  }

  const handleCancelEdit = () => {
    setEditingPlotId(null)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Grid3X3 className="w-6 h-6 text-green-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Garden Plots</h2>
        </div>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Plot
          </button>
        )}
      </div>

      {/* Create Plot Form */}
      {showCreateForm && (
        <form onSubmit={handleCreatePlot} className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-gray-800 mb-4">Create New Plot</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="plotName" className="block text-sm font-medium text-gray-700 mb-1">
                Plot Name *
              </label>
              <input
                type="text"
                id="plotName"
                value={newPlotName}
                onChange={(e) => setNewPlotName(e.target.value)}
                placeholder="e.g., North Bed, Greenhouse, Container Garden"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="plotDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <input
                type="text"
                id="plotDescription"
                value={newPlotDescription}
                onChange={(e) => setNewPlotDescription(e.target.value)}
                placeholder="e.g., Sunny corner, raised bed..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="plotWidth" className="block text-sm font-medium text-gray-700 mb-1">
                  Width (meters)
                </label>
                <input
                  type="number"
                  id="plotWidth"
                  min="0.5"
                  max="50"
                  step="0.5"
                  value={newPlotWidth}
                  onChange={(e) => setNewPlotWidth(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label htmlFor="plotLength" className="block text-sm font-medium text-gray-700 mb-1">
                  Length (meters)
                </label>
                <input
                  type="number"
                  id="plotLength"
                  min="0.5"
                  max="50"
                  step="0.5"
                  value={newPlotLength}
                  onChange={(e) => setNewPlotLength(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Palette className="w-4 h-4 inline mr-1" />
                Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {PLOT_COLORS.map(color => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setNewPlotColor(color)}
                    className={`w-8 h-8 rounded-full border-2 transition ${
                      newPlotColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!newPlotName.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Plot
              </button>
              <button
                type="button"
                onClick={resetCreateForm}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Plots List */}
      {plots.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <Grid3X3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No garden plots yet.</p>
          <p className="text-sm">Create plots to organize your vegetables!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {plots.map(plot => {
            const isEditing = editingPlotId === plot.id
            const area = plot.width * plot.length

            return (
              <div
                key={plot.id}
                className="p-4 rounded-lg border border-gray-200 hover:border-green-300 transition"
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                      autoFocus
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500">Width (m)</label>
                        <input
                          type="number"
                          min="0.5"
                          max="50"
                          step="0.5"
                          value={editWidth}
                          onChange={(e) => setEditWidth(parseFloat(e.target.value) || 1)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Length (m)</label>
                        <input
                          type="number"
                          min="0.5"
                          max="50"
                          step="0.5"
                          value={editLength}
                          onChange={(e) => setEditLength(parseFloat(e.target.value) || 1)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {PLOT_COLORS.map(color => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setEditColor(color)}
                          className={`w-6 h-6 rounded-full border-2 transition ${
                            editColor === color ? 'border-gray-800' : 'border-gray-300'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEdit}
                        className="flex items-center px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="flex items-center px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded mr-3 flex-shrink-0"
                          style={{ backgroundColor: plot.color }}
                        />
                        <div>
                          <h3 className="font-semibold text-gray-800">{plot.name}</h3>
                          {plot.description && (
                            <p className="text-sm text-gray-500">{plot.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStartEdit(plot)}
                          className="p-1 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                          title="Edit plot"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${plot.name}"? Vegetables assigned to this plot will be unassigned.`)) {
                              onDeletePlot(plot.id)
                            }
                          }}
                          className="p-1 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete plot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-500">
                      <span>{plot.width}m × {plot.length}m</span>
                      <span className="mx-2">•</span>
                      <span>{area}m² area</span>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Help Text */}
      {plots.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Assign vegetables to plots in the List View or drag them onto plots in the Plot View.
          </p>
        </div>
      )}
    </div>
  )
}

