import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  loadGardenData,
  saveGardenData,
  generateId,
  createPlan,
  getPlanById,
  getCurrentPlan,
  addPlan,
  updatePlan,
  deletePlan,
  setCurrentPlan,
  addVegetableToPlan,
  removeVegetableFromPlan,
  createPlot,
  createGridPlot,
  isGridPlot,
  calculatePlanProgress,
  exportPlan,
  importPlan
} from '@/lib/garden-storage'
import { GardenPlannerData, GardenPlan } from '@/types/garden-planner'

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId()
    const id2 = generateId()
    
    expect(id1).not.toBe(id2)
  })

  it('should generate non-empty string IDs', () => {
    const id = generateId()
    
    expect(typeof id).toBe('string')
    expect(id.length).toBeGreaterThan(0)
  })
})

describe('createPlan', () => {
  it('should create a new plan with required fields', () => {
    const plan = createPlan('My Garden 2025', 'A test garden')
    
    expect(plan.name).toBe('My Garden 2025')
    expect(plan.description).toBe('A test garden')
    expect(plan.id).toBeDefined()
    expect(plan.vegetables).toEqual([])
    expect(plan.plots).toEqual([])
    expect(plan.customVegetables).toEqual([])
  })

  it('should default year to current year', () => {
    const plan = createPlan('Test')
    
    expect(plan.year).toBe(new Date().getFullYear())
  })

  it('should accept custom year', () => {
    const plan = createPlan('Test', undefined, 2026)
    
    expect(plan.year).toBe(2026)
  })
})

describe('Plan CRUD operations', () => {
  let testData: GardenPlannerData
  let testPlan: GardenPlan

  beforeEach(() => {
    testPlan = createPlan('Test Plan')
    testData = {
      version: 2,
      currentPlanId: null,
      plans: [],
      rotationHistory: []
    }
  })

  describe('addPlan', () => {
    it('should add a plan and set it as current', () => {
      const result = addPlan(testData, testPlan)
      
      expect(result.plans).toHaveLength(1)
      expect(result.currentPlanId).toBe(testPlan.id)
    })
  })

  describe('getPlanById', () => {
    it('should find plan by ID', () => {
      const data = addPlan(testData, testPlan)
      
      const found = getPlanById(data, testPlan.id)
      
      expect(found).toBeDefined()
      expect(found?.name).toBe('Test Plan')
    })

    it('should return undefined for non-existent ID', () => {
      const found = getPlanById(testData, 'non-existent')
      
      expect(found).toBeUndefined()
    })
  })

  describe('getCurrentPlan', () => {
    it('should return current plan', () => {
      const data = addPlan(testData, testPlan)
      
      const current = getCurrentPlan(data)
      
      expect(current).toBeDefined()
      expect(current?.id).toBe(testPlan.id)
    })

    it('should return undefined when no current plan', () => {
      const current = getCurrentPlan(testData)
      
      expect(current).toBeUndefined()
    })
  })

  describe('updatePlan', () => {
    it('should update plan properties', () => {
      const data = addPlan(testData, testPlan)
      
      const result = updatePlan(data, testPlan.id, { name: 'Updated Name' })
      
      expect(result.plans[0].name).toBe('Updated Name')
    })

    it('should set updatedAt timestamp on update', () => {
      const data = addPlan(testData, testPlan)
      
      const result = updatePlan(data, testPlan.id, { name: 'Updated' })
      
      // Should have a valid ISO timestamp
      expect(result.plans[0].updatedAt).toBeDefined()
      expect(new Date(result.plans[0].updatedAt).toISOString()).toBe(result.plans[0].updatedAt)
    })
  })

  describe('deletePlan', () => {
    it('should delete plan', () => {
      const data = addPlan(testData, testPlan)
      
      const result = deletePlan(data, testPlan.id)
      
      expect(result.plans).toHaveLength(0)
    })

    it('should update currentPlanId when deleting current plan', () => {
      const plan2 = createPlan('Plan 2')
      let data = addPlan(testData, testPlan)
      data = addPlan(data, plan2)
      data = setCurrentPlan(data, testPlan.id)
      
      const result = deletePlan(data, testPlan.id)
      
      expect(result.currentPlanId).toBe(plan2.id)
    })
  })

  describe('setCurrentPlan', () => {
    it('should set current plan ID', () => {
      const data = addPlan(testData, testPlan)
      
      const result = setCurrentPlan(data, testPlan.id)
      
      expect(result.currentPlanId).toBe(testPlan.id)
    })

    it('should allow setting to null', () => {
      const data = addPlan(testData, testPlan)
      
      const result = setCurrentPlan(data, null)
      
      expect(result.currentPlanId).toBeNull()
    })
  })
})

describe('Vegetable operations', () => {
  let testData: GardenPlannerData
  let testPlan: GardenPlan

  beforeEach(() => {
    testPlan = createPlan('Test Plan')
    testData = addPlan({
      version: 2,
      currentPlanId: null,
      plans: [],
      rotationHistory: []
    }, testPlan)
  })

  describe('addVegetableToPlan', () => {
    it('should add vegetable to plan', () => {
      const result = addVegetableToPlan(testData, testPlan.id, 'carrots', 10)
      
      const plan = getPlanById(result, testPlan.id)
      expect(plan?.vegetables).toHaveLength(1)
      expect(plan?.vegetables[0].vegetableId).toBe('carrots')
      expect(plan?.vegetables[0].quantity).toBe(10)
      expect(plan?.vegetables[0].status).toBe('planned')
    })
  })

  describe('removeVegetableFromPlan', () => {
    it('should remove vegetable from plan', () => {
      let result = addVegetableToPlan(testData, testPlan.id, 'carrots', 10)
      const vegId = getPlanById(result, testPlan.id)?.vegetables[0].id || ''
      
      result = removeVegetableFromPlan(result, testPlan.id, vegId)
      
      const plan = getPlanById(result, testPlan.id)
      expect(plan?.vegetables).toHaveLength(0)
    })
  })
})

describe('Plot operations', () => {
  describe('createPlot', () => {
    it('should create plot with defaults', () => {
      const plot = createPlot('Bed A')
      
      expect(plot.name).toBe('Bed A')
      expect(plot.width).toBe(2)
      expect(plot.length).toBe(4)
      expect(plot.id).toBeDefined()
    })

    it('should accept custom dimensions', () => {
      const plot = createPlot('Large Bed', 3, 5)
      
      expect(plot.width).toBe(3)
      expect(plot.length).toBe(5)
    })
  })

  describe('createGridPlot', () => {
    it('should create grid plot with cells', () => {
      const plot = createGridPlot('Grid Bed', 3, 4)
      
      expect(plot.name).toBe('Grid Bed')
      expect(plot.gridRows).toBe(3)
      expect(plot.gridCols).toBe(4)
      expect(plot.cells).toHaveLength(12) // 3x4
    })

    it('should initialize cells with correct positions', () => {
      const plot = createGridPlot('Test', 2, 2)
      
      expect(plot.cells[0].row).toBe(0)
      expect(plot.cells[0].col).toBe(0)
      expect(plot.cells[3].row).toBe(1)
      expect(plot.cells[3].col).toBe(1)
    })
  })

  describe('isGridPlot', () => {
    it('should return true for grid plots', () => {
      const plot = createGridPlot('Grid', 2, 2)
      
      expect(isGridPlot(plot)).toBe(true)
    })

    it('should return false for regular plots', () => {
      const plot = createPlot('Regular')
      
      expect(isGridPlot(plot)).toBe(false)
    })
  })
})

describe('calculatePlanProgress', () => {
  it('should return zeros for empty plan', () => {
    const plan = createPlan('Empty')
    
    const progress = calculatePlanProgress(plan)
    
    expect(progress.totalVegetables).toBe(0)
    expect(progress.withDates).toBe(0)
    expect(progress.withPlots).toBe(0)
    expect(progress.completionPercentage).toBe(0)
  })

  it('should calculate progress correctly', () => {
    const plan = createPlan('Test')
    plan.vegetables = [
      { id: '1', vegetableId: 'carrots', quantity: 1, status: 'planned', plannedSowDate: '2025-04-01', plotId: 'plot1' },
      { id: '2', vegetableId: 'onions', quantity: 1, status: 'planned', plannedSowDate: '2025-04-01' },
      { id: '3', vegetableId: 'peas', quantity: 1, status: 'planned' },
    ]
    
    const progress = calculatePlanProgress(plan)
    
    expect(progress.totalVegetables).toBe(3)
    expect(progress.withDates).toBe(2)
    expect(progress.withPlots).toBe(1)
    expect(progress.completionPercentage).toBe(33) // 1/3 complete (has both date and plot)
  })
})

describe('Export/Import', () => {
  describe('exportPlan', () => {
    it('should export plan with metadata', () => {
      const plan = createPlan('Export Test')
      
      const exported = exportPlan(plan)
      
      expect(exported.plan).toEqual(plan)
      expect(exported.version).toBeDefined()
      expect(exported.exportedAt).toBeDefined()
    })
  })

  describe('importPlan', () => {
    it('should import valid plan JSON', () => {
      const plan = createPlan('Import Test')
      const exported = exportPlan(plan)
      const json = JSON.stringify(exported)
      
      const result = importPlan(json)
      
      expect(result.plan).toBeDefined()
      expect(result.plan?.name).toBe('Import Test')
      expect(result.plan?.id).not.toBe(plan.id) // New ID generated
    })

    it('should return error for invalid JSON', () => {
      const result = importPlan('not valid json')
      
      expect(result.error).toBeDefined()
      expect(result.plan).toBeUndefined()
    })

    it('should return error for missing required fields', () => {
      const result = importPlan(JSON.stringify({ plan: {} }))
      
      expect(result.error).toContain('missing required fields')
    })
  })
})

describe('localStorage operations', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('loadGardenData', () => {
    it('should return default data when localStorage is empty', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)
      
      const data = loadGardenData()
      
      expect(data.version).toBe(2)
      expect(data.plans).toEqual([])
      expect(data.currentPlanId).toBeNull()
    })

    it('should parse stored data', () => {
      const storedData: GardenPlannerData = {
        version: 2,
        currentPlanId: 'test-id',
        plans: [createPlan('Stored Plan')],
        rotationHistory: []
      }
      vi.mocked(localStorage.getItem).mockReturnValue(JSON.stringify(storedData))
      
      const data = loadGardenData()
      
      expect(data.plans).toHaveLength(1)
      expect(data.plans[0].name).toBe('Stored Plan')
    })
  })

  describe('saveGardenData', () => {
    it('should save data to localStorage', () => {
      const data: GardenPlannerData = {
        version: 2,
        currentPlanId: null,
        plans: [],
        rotationHistory: []
      }
      
      const result = saveGardenData(data)
      
      expect(result).toBe(true)
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'garden-planner-data',
        JSON.stringify(data)
      )
    })
  })
})

