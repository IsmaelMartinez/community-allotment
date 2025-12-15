'use client'

import { useState } from 'react'
import { Plus, FolderOpen, Trash2, Edit3, Check, X, Calendar } from 'lucide-react'
import { GardenPlan, GardenPlannerData } from '@/types/garden-planner'
import { createPlan, calculatePlanProgress } from '@/lib/garden-storage'

interface PlanManagerProps {
  data: GardenPlannerData
  onCreatePlan: (plan: GardenPlan) => void
  onSelectPlan: (planId: string) => void
  onDeletePlan: (planId: string) => void
  onUpdatePlan: (planId: string, updates: Partial<GardenPlan>) => void
}

export default function PlanManager({
  data,
  onCreatePlan,
  onSelectPlan,
  onDeletePlan,
  onUpdatePlan
}: PlanManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPlanName, setNewPlanName] = useState('')
  const [newPlanDescription, setNewPlanDescription] = useState('')
  const [newPlanYear, setNewPlanYear] = useState(new Date().getFullYear())
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPlanName.trim()) return

    const plan = createPlan(newPlanName.trim(), newPlanDescription.trim() || undefined, newPlanYear)
    onCreatePlan(plan)
    setNewPlanName('')
    setNewPlanDescription('')
    setNewPlanYear(new Date().getFullYear())
    setShowCreateForm(false)
  }

  const handleStartEdit = (plan: GardenPlan) => {
    setEditingPlanId(plan.id)
    setEditName(plan.name)
  }

  const handleSaveEdit = (planId: string) => {
    if (editName.trim()) {
      onUpdatePlan(planId, { name: editName.trim() })
    }
    setEditingPlanId(null)
  }

  const handleCancelEdit = () => {
    setEditingPlanId(null)
    setEditName('')
  }

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear + i)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FolderOpen className="w-6 h-6 text-green-600 mr-2" />
          <h2 className="text-xl font-bold text-gray-800">Your Garden Plans</h2>
        </div>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Plan
          </button>
        )}
      </div>

      {/* Create Plan Form */}
      {showCreateForm && (
        <form onSubmit={handleCreatePlan} className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-gray-800 mb-4">Create New Plan</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="planName" className="block text-sm font-medium text-gray-700 mb-1">
                Plan Name *
              </label>
              <input
                type="text"
                id="planName"
                value={newPlanName}
                onChange={(e) => setNewPlanName(e.target.value)}
                placeholder="e.g., My 2025 Garden"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="planDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                id="planDescription"
                value={newPlanDescription}
                onChange={(e) => setNewPlanDescription(e.target.value)}
                placeholder="Notes about your garden plan..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div>
              <label htmlFor="planYear" className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                id="planYear"
                value={newPlanYear}
                onChange={(e) => setNewPlanYear(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {yearOptions.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={!newPlanName.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Plan
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Plans List */}
      {data.plans.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No garden plans yet.</p>
          <p className="text-sm">Create your first plan to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.plans.map((plan) => {
            const progress = calculatePlanProgress(plan)
            const isSelected = data.currentPlanId === plan.id
            const isEditing = editingPlanId === plan.id

            return (
              <div
                key={plan.id}
                className={`p-4 rounded-lg border-2 transition cursor-pointer ${
                  isSelected 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-green-300 hover:bg-gray-50'
                }`}
                onClick={() => !isEditing && onSelectPlan(plan.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(plan.id)
                            if (e.key === 'Escape') handleCancelEdit()
                          }}
                        />
                        <button
                          onClick={() => handleSaveEdit(plan.id)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <h3 className="font-semibold text-gray-800">{plan.name}</h3>
                        {isSelected && (
                          <span className="ml-2 px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
                            Active
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{plan.year}</span>
                      <span className="mx-2">•</span>
                      <span>{plan.vegetables.length} vegetables</span>
                      <span className="mx-2">•</span>
                      <span>{plan.plots.length} plots</span>
                    </div>
                    {plan.description && (
                      <p className="text-sm text-gray-600 mt-2">{plan.description}</p>
                    )}
                    
                    {/* Progress bar */}
                    {plan.vegetables.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Planning progress</span>
                          <span>{progress.completionPercentage}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-500 transition-all duration-300"
                            style={{ width: `${progress.completionPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 ml-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleStartEdit(plan)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                      title="Rename plan"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${plan.name}"? This cannot be undone.`)) {
                          onDeletePlan(plan.id)
                        }
                      }}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition"
                      title="Delete plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

