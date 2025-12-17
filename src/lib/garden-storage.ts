/**
 * Garden Planner localStorage utilities
 * Handles saving, loading, and managing garden plans with auto-save support
 */

import { 
  GardenPlan, 
  GardenPlannerData, 
  PlannedVegetable, 
  GardenPlot,
  GridPlot,
  PlotCell,
  RotationHistory,
  ExportedPlan,
  PLOT_COLORS
} from '@/types/garden-planner'

const STORAGE_KEY = 'garden-planner-data'
const CURRENT_VERSION = 2

// Default empty state
const getDefaultData = (): GardenPlannerData => ({
  version: CURRENT_VERSION,
  currentPlanId: null,
  plans: [],
  rotationHistory: []
})

/**
 * Load all garden planner data from localStorage
 */
export function loadGardenData(): GardenPlannerData {
  if (typeof window === 'undefined') {
    return getDefaultData()
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return getDefaultData()
    }

    const data = JSON.parse(stored) as GardenPlannerData
    
    // Handle version migrations if needed
    if (data.version !== CURRENT_VERSION) {
      return migrateData(data)
    }

    return data
  } catch (error) {
    console.error('Failed to load garden data:', error)
    return getDefaultData()
  }
}

/**
 * Save all garden planner data to localStorage
 */
export function saveGardenData(data: GardenPlannerData): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    return true
  } catch (error) {
    console.error('Failed to save garden data:', error)
    return false
  }
}

/**
 * Migrate data from older versions
 */
function migrateData(data: GardenPlannerData): GardenPlannerData {
  let migratedData = { ...data }
  
  // Migrate v1 to v2: add rotationHistory
  if (migratedData.version < 2) {
    migratedData = {
      ...migratedData,
      version: 2,
      rotationHistory: []
    }
  }
  
  return migratedData
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get the current timestamp as ISO string
 */
function getTimestamp(): string {
  return new Date().toISOString()
}

// ==================== PLAN OPERATIONS ====================

/**
 * Create a new garden plan
 */
export function createPlan(name: string, description?: string, year?: number): GardenPlan {
  const now = getTimestamp()
  return {
    id: generateId(),
    name,
    description,
    year: year || new Date().getFullYear(),
    createdAt: now,
    updatedAt: now,
    vegetables: [],
    plots: [],
    customVegetables: []
  }
}

/**
 * Get a plan by ID
 */
export function getPlanById(data: GardenPlannerData, planId: string): GardenPlan | undefined {
  return data.plans.find(p => p.id === planId)
}

/**
 * Get the current plan
 */
export function getCurrentPlan(data: GardenPlannerData): GardenPlan | undefined {
  if (!data.currentPlanId) return undefined
  return getPlanById(data, data.currentPlanId)
}

/**
 * Add a new plan
 */
export function addPlan(data: GardenPlannerData, plan: GardenPlan): GardenPlannerData {
  return {
    ...data,
    plans: [...data.plans, plan],
    currentPlanId: plan.id // Auto-select new plan
  }
}

/**
 * Update an existing plan
 */
export function updatePlan(data: GardenPlannerData, planId: string, updates: Partial<GardenPlan>): GardenPlannerData {
  return {
    ...data,
    plans: data.plans.map(p => 
      p.id === planId 
        ? { ...p, ...updates, updatedAt: getTimestamp() }
        : p
    )
  }
}

/**
 * Delete a plan
 */
export function deletePlan(data: GardenPlannerData, planId: string): GardenPlannerData {
  const newPlans = data.plans.filter(p => p.id !== planId)
  return {
    ...data,
    plans: newPlans,
    currentPlanId: data.currentPlanId === planId 
      ? (newPlans[0]?.id || null)
      : data.currentPlanId
  }
}

/**
 * Set the current plan
 */
export function setCurrentPlan(data: GardenPlannerData, planId: string | null): GardenPlannerData {
  return {
    ...data,
    currentPlanId: planId
  }
}

// ==================== VEGETABLE OPERATIONS ====================

/**
 * Add a vegetable to a plan
 */
export function addVegetableToPlan(
  data: GardenPlannerData, 
  planId: string, 
  vegetableId: string,
  quantity: number = 1,
  plotId?: string
): GardenPlannerData {
  const plannedVeg: PlannedVegetable = {
    id: generateId(),
    vegetableId,
    quantity,
    plotId,
    status: 'planned'
  }

  return updatePlan(data, planId, {
    vegetables: [...(getPlanById(data, planId)?.vegetables || []), plannedVeg]
  })
}

/**
 * Update a planned vegetable
 */
export function updatePlannedVegetable(
  data: GardenPlannerData,
  planId: string,
  vegetableInstanceId: string,
  updates: Partial<PlannedVegetable>
): GardenPlannerData {
  const plan = getPlanById(data, planId)
  if (!plan) return data

  const updatedVegetables = plan.vegetables.map(v =>
    v.id === vegetableInstanceId ? { ...v, ...updates } : v
  )

  return updatePlan(data, planId, { vegetables: updatedVegetables })
}

/**
 * Remove a vegetable from a plan
 */
export function removeVegetableFromPlan(
  data: GardenPlannerData,
  planId: string,
  vegetableInstanceId: string
): GardenPlannerData {
  const plan = getPlanById(data, planId)
  if (!plan) return data

  return updatePlan(data, planId, {
    vegetables: plan.vegetables.filter(v => v.id !== vegetableInstanceId)
  })
}

// ==================== PLOT OPERATIONS ====================

/**
 * Create a new plot
 */
export function createPlot(name: string, width: number = 2, length: number = 4): GardenPlot {
  return {
    id: generateId(),
    name,
    width,
    length,
    color: PLOT_COLORS[Math.floor(Math.random() * PLOT_COLORS.length)],
    sortOrder: 0
  }
}

/**
 * Add a plot to a plan
 */
export function addPlotToPlan(
  data: GardenPlannerData,
  planId: string,
  plot: GardenPlot
): GardenPlannerData {
  const plan = getPlanById(data, planId)
  if (!plan) return data

  const plotWithOrder = {
    ...plot,
    sortOrder: plan.plots.length
  }

  return updatePlan(data, planId, {
    plots: [...plan.plots, plotWithOrder]
  })
}

/**
 * Update a plot
 */
export function updatePlot(
  data: GardenPlannerData,
  planId: string,
  plotId: string,
  updates: Partial<GardenPlot>
): GardenPlannerData {
  const plan = getPlanById(data, planId)
  if (!plan) return data

  const updatedPlots = plan.plots.map(p =>
    p.id === plotId ? { ...p, ...updates } : p
  )

  return updatePlan(data, planId, { plots: updatedPlots })
}

/**
 * Delete a plot (and unassign vegetables)
 */
export function deletePlot(
  data: GardenPlannerData,
  planId: string,
  plotId: string
): GardenPlannerData {
  const plan = getPlanById(data, planId)
  if (!plan) return data

  // Remove plot and unassign vegetables from it
  const updatedVegetables = plan.vegetables.map(v =>
    v.plotId === plotId ? { ...v, plotId: undefined } : v
  )

  return updatePlan(data, planId, {
    plots: plan.plots.filter(p => p.id !== plotId),
    vegetables: updatedVegetables
  })
}

/**
 * Assign a vegetable to a plot
 */
export function assignVegetableToPlot(
  data: GardenPlannerData,
  planId: string,
  vegetableInstanceId: string,
  plotId: string | undefined
): GardenPlannerData {
  return updatePlannedVegetable(data, planId, vegetableInstanceId, { plotId })
}

// ==================== EXPORT/IMPORT ====================

/**
 * Export a plan to JSON
 */
export function exportPlan(plan: GardenPlan): ExportedPlan {
  return {
    version: CURRENT_VERSION,
    exportedAt: getTimestamp(),
    plan
  }
}

/**
 * Export plan as downloadable file
 */
export function downloadPlanAsJson(plan: GardenPlan): void {
  const exported = exportPlan(plan)
  const json = JSON.stringify(exported, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `garden-plan-${plan.name.toLowerCase().replace(/\s+/g, '-')}-${plan.year}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Import a plan from JSON file
 */
export function importPlan(jsonString: string): { plan: GardenPlan; error?: string } | { plan?: never; error: string } {
  try {
    const data = JSON.parse(jsonString)
    
    // Validate basic structure
    if (!data.plan || !data.plan.id || !data.plan.name) {
      return { error: 'Invalid plan format: missing required fields' }
    }

    // Generate new IDs to avoid conflicts
    const importedPlan: GardenPlan = {
      ...data.plan,
      id: generateId(),
      createdAt: getTimestamp(),
      updatedAt: getTimestamp(),
      vegetables: data.plan.vegetables?.map((v: PlannedVegetable) => ({
        ...v,
        id: generateId()
      })) || [],
      plots: data.plan.plots?.map((p: GardenPlot) => ({
        ...p,
        id: generateId()
      })) || [],
      customVegetables: data.plan.customVegetables || []
    }

    return { plan: importedPlan }
  } catch {
    return { error: 'Failed to parse JSON file' }
  }
}

/**
 * Read file as text (for import)
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

// ==================== STATISTICS ====================

/**
 * Calculate plan progress statistics
 */
export function calculatePlanProgress(plan: GardenPlan): {
  totalVegetables: number
  withDates: number
  withPlots: number
  completionPercentage: number
} {
  const total = plan.vegetables.length
  if (total === 0) {
    return {
      totalVegetables: 0,
      withDates: 0,
      withPlots: 0,
      completionPercentage: 0
    }
  }

  const withDates = plan.vegetables.filter(v => v.plannedSowDate).length
  const withPlots = plan.vegetables.filter(v => v.plotId).length
  
  // Consider a vegetable "complete" if it has both date and plot
  const complete = plan.vegetables.filter(v => v.plannedSowDate && v.plotId).length
  const percentage = Math.round((complete / total) * 100)

  return {
    totalVegetables: total,
    withDates,
    withPlots,
    completionPercentage: percentage
  }
}

// ==================== GRID PLOT OPERATIONS ====================

/**
 * Create a new grid plot with initialized cells
 */
export function createGridPlot(
  name: string, 
  gridRows: number = 3, 
  gridCols: number = 4,
  width: number = 2, 
  length: number = 4
): GridPlot {
  const plotId = generateId()
  const cells: PlotCell[] = []
  
  // Initialize empty cells
  for (let row = 0; row < gridRows; row++) {
    for (let col = 0; col < gridCols; col++) {
      cells.push({
        id: `${plotId}-${row}-${col}`,
        plotId,
        row,
        col,
        vegetableId: undefined,
        plantedYear: undefined
      })
    }
  }
  
  return {
    id: plotId,
    name,
    width,
    length,
    color: PLOT_COLORS[Math.floor(Math.random() * PLOT_COLORS.length)],
    sortOrder: 0,
    gridRows,
    gridCols,
    cells
  }
}

/**
 * Check if a plot is a grid plot
 */
export function isGridPlot(plot: GardenPlot): plot is GridPlot {
  return 'cells' in plot && 'gridRows' in plot && 'gridCols' in plot
}

/**
 * Assign a vegetable to a cell in a grid plot
 */
export function assignVegetableToCell(
  data: GardenPlannerData,
  planId: string,
  plotId: string,
  cellId: string,
  vegetableId: string | undefined,
  year?: number
): GardenPlannerData {
  const plan = getPlanById(data, planId)
  if (!plan) return data

  const updatedPlots = plan.plots.map(plot => {
    if (plot.id !== plotId || !isGridPlot(plot)) return plot
    
    return {
      ...plot,
      cells: plot.cells.map(cell => 
        cell.id === cellId 
          ? { ...cell, vegetableId, plantedYear: year || new Date().getFullYear() }
          : cell
      )
    }
  })

  return updatePlan(data, planId, { plots: updatedPlots })
}

/**
 * Clear a cell in a grid plot
 */
export function clearCell(
  data: GardenPlannerData,
  planId: string,
  plotId: string,
  cellId: string
): GardenPlannerData {
  return assignVegetableToCell(data, planId, plotId, cellId, undefined)
}

/**
 * Get all cells for a plot
 */
export function getCellsForPlot(plan: GardenPlan, plotId: string): PlotCell[] {
  const plot = plan.plots.find(p => p.id === plotId)
  if (!plot || !isGridPlot(plot)) return []
  return plot.cells
}

// ==================== ROTATION HISTORY OPERATIONS ====================

/**
 * Add or update rotation history for a plot/year
 */
export function updateRotationHistory(
  data: GardenPlannerData,
  history: RotationHistory
): GardenPlannerData {
  // Remove existing entry for same plot/year if exists
  const filtered = data.rotationHistory.filter(
    h => !(h.plotId === history.plotId && h.year === history.year)
  )
  
  return {
    ...data,
    rotationHistory: [...filtered, history]
  }
}

/**
 * Get rotation history for a specific plot
 */
export function getRotationHistoryForPlot(
  data: GardenPlannerData,
  plotId: string
): RotationHistory[] {
  return data.rotationHistory
    .filter(h => h.plotId === plotId)
    .sort((a, b) => b.year - a.year)
}

/**
 * Get the most recent rotation group for a plot
 */
export function getLastRotationGroup(
  data: GardenPlannerData,
  plotId: string
): RotationHistory | undefined {
  const history = getRotationHistoryForPlot(data, plotId)
  return history[0]
}

