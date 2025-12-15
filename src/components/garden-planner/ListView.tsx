'use client'

import { useState } from 'react'
import { List, Trash2, Edit3, Check, X, MapPin, Calendar, AlertCircle, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { PlannedVegetable, GardenPlot, PlannedVegetableStatus, CATEGORY_INFO } from '@/types/garden-planner'
import { Vegetable } from '@/types/garden-planner'
import { getVegetableById } from '@/lib/vegetable-database'

interface ListViewProps {
  vegetables: PlannedVegetable[]
  plots: GardenPlot[]
  onUpdateVegetable: (vegetableInstanceId: string, updates: Partial<PlannedVegetable>) => void
  onRemoveVegetable: (vegetableInstanceId: string) => void
}

const statusColors: Record<PlannedVegetableStatus, string> = {
  planned: 'bg-gray-100 text-gray-800',
  sown: 'bg-blue-100 text-blue-800',
  transplanted: 'bg-cyan-100 text-cyan-800',
  growing: 'bg-green-100 text-green-800',
  harvesting: 'bg-amber-100 text-amber-800',
  complete: 'bg-purple-100 text-purple-800'
}

const statusLabels: Record<PlannedVegetableStatus, string> = {
  planned: 'Planned',
  sown: 'Sown',
  transplanted: 'Transplanted',
  growing: 'Growing',
  harvesting: 'Harvesting',
  complete: 'Complete'
}

export default function ListView({ vegetables, plots, onUpdateVegetable, onRemoveVegetable }: ListViewProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editQuantity, setEditQuantity] = useState(1)
  const [editPlotId, setEditPlotId] = useState<string | undefined>(undefined)
  const [editSowDate, setEditSowDate] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const handleStartEdit = (veg: PlannedVegetable) => {
    setEditingId(veg.id)
    setEditQuantity(veg.quantity)
    setEditPlotId(veg.plotId)
    setEditSowDate(veg.plannedSowDate || '')
    setEditNotes(veg.notes || '')
  }

  const handleSaveEdit = (id: string) => {
    onUpdateVegetable(id, {
      quantity: editQuantity,
      plotId: editPlotId,
      plannedSowDate: editSowDate || undefined,
      notes: editNotes || undefined
    })
    setEditingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  const getPlotName = (plotId?: string) => {
    if (!plotId) return null
    const plot = plots.find(p => p.id === plotId)
    return plot ? plot.name : null
  }

  const getPlotColor = (plotId?: string) => {
    if (!plotId) return null
    const plot = plots.find(p => p.id === plotId)
    return plot?.color
  }

  const getCategoryName = (category: string) => {
    return CATEGORY_INFO.find(c => c.id === category)?.name || category
  }

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return null
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  // Group vegetables by plot for organized display
  const groupedByPlot = vegetables.reduce((acc, veg) => {
    const key = veg.plotId || 'unassigned'
    if (!acc[key]) acc[key] = []
    acc[key].push(veg)
    return acc
  }, {} as Record<string, PlannedVegetable[]>)

  // Sort plots - unassigned at the end
  const sortedGroups = Object.entries(groupedByPlot).sort(([a], [b]) => {
    if (a === 'unassigned') return 1
    if (b === 'unassigned') return -1
    const plotA = plots.find(p => p.id === a)
    const plotB = plots.find(p => p.id === b)
    return (plotA?.sortOrder || 0) - (plotB?.sortOrder || 0)
  })

  if (vegetables.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <List className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No vegetables added yet</h3>
        <p className="text-gray-500">Use the vegetable selector to add plants to your garden plan.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sortedGroups.map(([groupKey, groupVegetables]) => {
        const plot = plots.find(p => p.id === groupKey)
        const isUnassigned = groupKey === 'unassigned'

        return (
          <div key={groupKey} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Group Header */}
            <div 
              className={`px-4 py-3 flex items-center ${isUnassigned ? 'bg-gray-100' : ''}`}
              style={!isUnassigned && plot ? { backgroundColor: `${plot.color}20` } : undefined}
            >
              {!isUnassigned && plot && (
                <div
                  className="w-4 h-4 rounded mr-3"
                  style={{ backgroundColor: plot.color }}
                />
              )}
              {isUnassigned && <AlertCircle className="w-4 h-4 mr-3 text-gray-400" />}
              <h3 className="font-semibold text-gray-800">
                {isUnassigned ? 'Unassigned' : plot?.name}
              </h3>
              <span className="ml-2 text-sm text-gray-500">
                ({groupVegetables.length} {groupVegetables.length === 1 ? 'vegetable' : 'vegetables'})
              </span>
            </div>

            {/* Vegetables List */}
            <div className="divide-y divide-gray-100">
              {groupVegetables.map(veg => {
                const vegInfo = getVegetableById(veg.vegetableId) as Vegetable | undefined
                const isEditing = editingId === veg.id
                const isExpanded = expandedId === veg.id

                if (!vegInfo) return null

                return (
                  <div key={veg.id} className="p-4 hover:bg-gray-50">
                    {isEditing ? (
                      // Edit Mode
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-800">{vegInfo.name}</h4>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSaveEdit(veg.id)}
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

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                            <input
                              type="number"
                              min="1"
                              value={editQuantity}
                              onChange={(e) => setEditQuantity(parseInt(e.target.value) || 1)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Plot</label>
                            <select
                              value={editPlotId || ''}
                              onChange={(e) => setEditPlotId(e.target.value || undefined)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                            >
                              <option value="">Unassigned</option>
                              {plots.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Planned Sow Date</label>
                            <input
                              type="date"
                              value={editSowDate}
                              onChange={(e) => setEditSowDate(e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Status</label>
                            <select
                              value={veg.status}
                              onChange={(e) => onUpdateVegetable(veg.id, { status: e.target.value as PlannedVegetableStatus })}
                              className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                            >
                              {Object.entries(statusLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Notes</label>
                          <textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            placeholder="Add notes about this vegetable..."
                            rows={2}
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                      </div>
                    ) : (
                      // Display Mode
                      <>
                        <div className="flex items-start justify-between">
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => setExpandedId(isExpanded ? null : veg.id)}
                          >
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-gray-800">{vegInfo.name}</h4>
                              <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                                ×{veg.quantity}
                              </span>
                              <span className={`px-2 py-0.5 text-xs rounded-full ${statusColors[veg.status]}`}>
                                {statusLabels[veg.status]}
                              </span>
                              {veg.notes && (
                                <span title="Has notes">
                                  <MessageSquare className="w-3 h-3 text-blue-500" />
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                              <span className="text-xs text-gray-400">{getCategoryName(vegInfo.category)}</span>
                              
                              {veg.plotId && (
                                <span className="flex items-center">
                                  <span 
                                    className="w-2 h-2 rounded-full mr-1"
                                    style={{ backgroundColor: getPlotColor(veg.plotId) || undefined }}
                                  />
                                  {getPlotName(veg.plotId)}
                                </span>
                              )}
                              
                              {veg.plannedSowDate && (
                                <span className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Sow: {formatDate(veg.plannedSowDate)}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 ml-4">
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : veg.id)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleStartEdit(veg)}
                              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Remove ${vegInfo.name} from your plan?`)) {
                                  onRemoveVegetable(veg.id)
                                }
                              }}
                              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-sm text-gray-600 mb-3">{vegInfo.description}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500 block">Days to harvest</span>
                                <span className="font-medium">{vegInfo.planting.daysToHarvest.min}-{vegInfo.planting.daysToHarvest.max} days</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Spacing</span>
                                <span className="font-medium">{vegInfo.care.spacing.between}cm apart</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Sun</span>
                                <span className="font-medium">{vegInfo.care.sun.replace('-', ' ')}</span>
                              </div>
                              <div>
                                <span className="text-gray-500 block">Water</span>
                                <span className="font-medium">{vegInfo.care.water}</span>
                              </div>
                            </div>

                            {veg.notes && (
                              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center text-blue-800 text-sm font-medium mb-1">
                                  <MessageSquare className="w-4 h-4 mr-1" />
                                  Notes
                                </div>
                                <p className="text-sm text-blue-700">{veg.notes}</p>
                              </div>
                            )}

                            {!veg.plotId && (
                              <div className="mt-3 flex items-center">
                                <MapPin className="w-4 h-4 text-amber-500 mr-2" />
                                <span className="text-sm text-amber-600">Not assigned to a plot</span>
                                {plots.length > 0 && (
                                  <button
                                    onClick={() => handleStartEdit(veg)}
                                    className="ml-2 text-sm text-green-600 hover:text-green-800 underline"
                                  >
                                    Assign now
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

