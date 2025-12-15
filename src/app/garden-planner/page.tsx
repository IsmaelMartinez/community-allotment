'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  Sprout, 
  ArrowRight, 
  Info, 
  BarChart3,
  Leaf,
  Grid3X3,
  Calendar,
  Users,
  Recycle
} from 'lucide-react'
import { 
  GardenPlannerData, 
  GardenPlan, 
  PlannedVegetable,
  GardenPlot,
  PlannerViewMode 
} from '@/types/garden-planner'
import { 
  loadGardenData, 
  saveGardenData, 
  addPlan,
  updatePlan,
  deletePlan,
  setCurrentPlan,
  addVegetableToPlan,
  updatePlannedVegetable,
  removeVegetableFromPlan,
  addPlotToPlan,
  updatePlot,
  deletePlot,
  assignVegetableToPlot,
  calculatePlanProgress,
  getCurrentPlan
} from '@/lib/garden-storage'

import PlanManager from '@/components/garden-planner/PlanManager'
import VegetableSelector from '@/components/garden-planner/VegetableSelector'
import PlotManager from '@/components/garden-planner/PlotManager'
import ListView from '@/components/garden-planner/ListView'
import PlotView from '@/components/garden-planner/PlotView'
import CalendarView from '@/components/garden-planner/CalendarView'
import ExportImport from '@/components/garden-planner/ExportImport'
import ViewSwitcher from '@/components/garden-planner/ViewSwitcher'

export default function GardenPlannerPage() {
  const [data, setData] = useState<GardenPlannerData | null>(null)
  const [currentView, setCurrentView] = useState<PlannerViewMode>('list')
  const [showVegetableSelector, setShowVegetableSelector] = useState(false)
  const [showPlotManager, setShowPlotManager] = useState(false)
  const [showExportImport, setShowExportImport] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const loaded = loadGardenData()
    setData(loaded)
  }, [])

  // Save data whenever it changes
  const saveData = useCallback((newData: GardenPlannerData) => {
    setData(newData)
    saveGardenData(newData)
  }, [])

  // Plan operations
  const handleCreatePlan = (plan: GardenPlan) => {
    if (!data) return
    saveData(addPlan(data, plan))
  }

  const handleSelectPlan = (planId: string) => {
    if (!data) return
    saveData(setCurrentPlan(data, planId))
  }

  const handleDeletePlan = (planId: string) => {
    if (!data) return
    saveData(deletePlan(data, planId))
  }

  const handleUpdatePlan = (planId: string, updates: Partial<GardenPlan>) => {
    if (!data) return
    saveData(updatePlan(data, planId, updates))
  }

  // Vegetable operations
  const handleAddVegetable = (vegetableId: string, quantity: number) => {
    if (!data || !data.currentPlanId) return
    saveData(addVegetableToPlan(data, data.currentPlanId, vegetableId, quantity))
  }

  const handleUpdateVegetable = (vegetableInstanceId: string, updates: Partial<PlannedVegetable>) => {
    if (!data || !data.currentPlanId) return
    saveData(updatePlannedVegetable(data, data.currentPlanId, vegetableInstanceId, updates))
  }

  const handleRemoveVegetable = (vegetableInstanceId: string) => {
    if (!data || !data.currentPlanId) return
    saveData(removeVegetableFromPlan(data, data.currentPlanId, vegetableInstanceId))
  }

  // Plot operations
  const handleAddPlot = (plot: GardenPlot) => {
    if (!data || !data.currentPlanId) return
    saveData(addPlotToPlan(data, data.currentPlanId, plot))
  }

  const handleUpdatePlot = (plotId: string, updates: Partial<GardenPlot>) => {
    if (!data || !data.currentPlanId) return
    saveData(updatePlot(data, data.currentPlanId, plotId, updates))
  }

  const handleDeletePlot = (plotId: string) => {
    if (!data || !data.currentPlanId) return
    saveData(deletePlot(data, data.currentPlanId, plotId))
  }

  const handleAssignVegetable = (vegetableInstanceId: string, plotId: string | undefined) => {
    if (!data || !data.currentPlanId) return
    saveData(assignVegetableToPlot(data, data.currentPlanId, vegetableInstanceId, plotId))
  }

  // Import
  const handleImportPlan = (plan: GardenPlan) => {
    if (!data) return
    saveData(addPlan(data, plan))
  }

  // Loading state
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Sprout className="w-12 h-12 text-green-600 mx-auto animate-pulse" />
          <p className="mt-4 text-gray-600">Loading your garden plans...</p>
        </div>
      </div>
    )
  }

  const currentPlan = getCurrentPlan(data)
  const progress = currentPlan ? calculatePlanProgress(currentPlan) : null
  const existingVegetableIds = currentPlan?.vegetables.map(v => v.vegetableId) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sprout className="w-12 h-12 text-green-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Garden Planner</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Plan your vegetable garden, organize plots, and track planting schedules 
            to maximize your allotment&apos;s potential throughout the year.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link 
            href="/companion-planting"
            className="flex items-center px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition text-gray-700 hover:text-green-700"
          >
            <Users className="w-4 h-4 mr-2" />
            Companion Planting
          </Link>
          <Link 
            href="/composting"
            className="flex items-center px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition text-gray-700 hover:text-green-700"
          >
            <Recycle className="w-4 h-4 mr-2" />
            Composting Guide
          </Link>
          <Link 
            href="/ai-advisor"
            className="flex items-center px-4 py-2 bg-white rounded-lg shadow hover:shadow-md transition text-gray-700 hover:text-green-700"
          >
            <Sprout className="w-4 h-4 mr-2" />
            Ask Aitor
          </Link>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Plan Manager */}
            <PlanManager
              data={data}
              onCreatePlan={handleCreatePlan}
              onSelectPlan={handleSelectPlan}
              onDeletePlan={handleDeletePlan}
              onUpdatePlan={handleUpdatePlan}
            />

            {/* Current Plan Progress */}
            {currentPlan && progress && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center mb-4">
                  <BarChart3 className="w-6 h-6 text-green-600 mr-2" />
                  <h2 className="text-xl font-bold text-gray-800">Plan Progress</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Overall completion</span>
                      <span className="font-medium">{progress.completionPercentage}%</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${progress.completionPercentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <Leaf className="w-5 h-5 text-green-600 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-gray-800">{progress.totalVegetables}</div>
                      <div className="text-xs text-gray-600">Vegetables</div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-gray-800">{progress.withDates}</div>
                      <div className="text-xs text-gray-600">With Dates</div>
                    </div>
                    <div className="p-3 bg-amber-50 rounded-lg">
                      <Grid3X3 className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                      <div className="text-2xl font-bold text-gray-800">{progress.withPlots}</div>
                      <div className="text-xs text-gray-600">Assigned</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Toggle Panels */}
            {currentPlan && (
              <div className="space-y-2">
                <button
                  onClick={() => setShowVegetableSelector(!showVegetableSelector)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                    showVegetableSelector
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 shadow hover:shadow-md'
                  }`}
                >
                  <span className="flex items-center">
                    <Leaf className="w-5 h-5 mr-2" />
                    Add Vegetables
                  </span>
                  <ArrowRight className={`w-5 h-5 transition ${showVegetableSelector ? 'rotate-90' : ''}`} />
                </button>

                <button
                  onClick={() => setShowPlotManager(!showPlotManager)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                    showPlotManager
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 shadow hover:shadow-md'
                  }`}
                >
                  <span className="flex items-center">
                    <Grid3X3 className="w-5 h-5 mr-2" />
                    Manage Plots
                  </span>
                  <ArrowRight className={`w-5 h-5 transition ${showPlotManager ? 'rotate-90' : ''}`} />
                </button>

                <button
                  onClick={() => setShowExportImport(!showExportImport)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                    showExportImport
                      ? 'bg-green-600 text-white'
                      : 'bg-white text-gray-700 shadow hover:shadow-md'
                  }`}
                >
                  <span className="flex items-center">
                    <Info className="w-5 h-5 mr-2" />
                    Export / Import
                  </span>
                  <ArrowRight className={`w-5 h-5 transition ${showExportImport ? 'rotate-90' : ''}`} />
                </button>
              </div>
            )}

            {/* Vegetable Selector */}
            {currentPlan && showVegetableSelector && (
              <VegetableSelector
                onAddVegetable={handleAddVegetable}
                existingVegetableIds={existingVegetableIds}
              />
            )}

            {/* Plot Manager */}
            {currentPlan && showPlotManager && (
              <PlotManager
                plots={currentPlan.plots}
                onAddPlot={handleAddPlot}
                onUpdatePlot={handleUpdatePlot}
                onDeletePlot={handleDeletePlot}
              />
            )}

            {/* Export/Import */}
            {currentPlan && showExportImport && (
              <ExportImport
                currentPlan={currentPlan}
                onImportPlan={handleImportPlan}
              />
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            {!currentPlan ? (
              // No plan selected
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <Sprout className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-600 mb-2">
                  No Garden Plan Selected
                </h2>
                <p className="text-gray-500 mb-6">
                  Create a new garden plan or select an existing one to start planning your vegetables.
                </p>
                <div className="flex flex-col items-center gap-4">
                  <p className="text-sm text-gray-400">
                    👈 Use the Plan Manager on the left to get started
                  </p>
                </div>
              </div>
            ) : (
              // Plan selected - show views
              <div className="space-y-6">
                {/* View Switcher */}
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    {currentPlan.name}
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      {currentPlan.year}
                    </span>
                  </h2>
                  <ViewSwitcher currentView={currentView} onChange={setCurrentView} />
                </div>

                {/* View Content */}
                {currentView === 'list' && (
                  <ListView
                    vegetables={currentPlan.vegetables}
                    plots={currentPlan.plots}
                    onUpdateVegetable={handleUpdateVegetable}
                    onRemoveVegetable={handleRemoveVegetable}
                  />
                )}

                {currentView === 'plot' && (
                  <PlotView
                    vegetables={currentPlan.vegetables}
                    plots={currentPlan.plots}
                    onAssignVegetable={handleAssignVegetable}
                  />
                )}

                {currentView === 'calendar' && (
                  <CalendarView
                    vegetables={currentPlan.vegetables}
                    year={currentPlan.year}
                  />
                )}

                {/* Empty State Hints */}
                {currentPlan.vegetables.length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <Info className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                    <p className="text-yellow-800">
                      Your plan is empty! Click &quot;Add Vegetables&quot; in the sidebar to start adding crops.
                    </p>
                  </div>
                )}

                {currentPlan.vegetables.length > 0 && currentPlan.plots.length === 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <Info className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-blue-800">
                      Tip: Create garden plots using &quot;Manage Plots&quot; to organize your vegetables by location.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* AI Advisor CTA */}
        <section className="mt-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-8 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Sprout className="w-8 h-8 mr-3" />
              <h2 className="text-2xl font-bold">Need Gardening Advice?</h2>
            </div>
            <p className="text-lg mb-6 text-green-100">
              Get personalized guidance on your planned vegetables from Aitor, 
              our AI gardening expert. Ask about planting times, companion planting, 
              pest management, and more!
            </p>
            <div className="bg-white/10 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center mb-2">
                <Info className="w-5 h-5 text-green-200 mr-2" />
                <span className="text-green-200 font-medium">Aitor can help with:</span>
              </div>
              <ul className="text-sm text-green-100 space-y-1">
                <li>• Specific growing advice for your planned vegetables</li>
                <li>• Troubleshooting plant problems and pest identification</li>
                <li>• Optimizing your garden layout and companion planting</li>
                <li>• Seasonal timing and succession planting strategies</li>
              </ul>
            </div>
            <Link 
              href="/ai-advisor" 
              className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Ask Aitor About Your Garden
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

