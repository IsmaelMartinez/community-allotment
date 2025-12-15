/**
 * Type definitions for the Vegetable Garden Planner feature
 */

// Vegetable Categories
export type VegetableCategory = 
  | 'leafy-greens'
  | 'root-vegetables'
  | 'brassicas'
  | 'legumes'
  | 'solanaceae'
  | 'cucurbits'
  | 'alliums'
  | 'herbs'

// Sun requirements
export type SunRequirement = 'full-sun' | 'partial-shade' | 'shade'

// Water requirements
export type WaterRequirement = 'low' | 'moderate' | 'high'

// Difficulty level
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

// Month type (1-12)
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

// Planting information
export interface PlantingInfo {
  sowIndoorsMonths: Month[]      // Months to start seeds indoors
  sowOutdoorsMonths: Month[]     // Months to direct sow outdoors
  transplantMonths: Month[]      // Months suitable for transplanting
  harvestMonths: Month[]         // Expected harvest months
  daysToHarvest: {
    min: number
    max: number
  }
}

// Care requirements
export interface CareRequirements {
  sun: SunRequirement
  water: WaterRequirement
  spacing: {
    between: number    // cm between plants
    rows: number       // cm between rows
  }
  depth: number        // cm planting depth
  difficulty: DifficultyLevel
  tips: string[]
}

// Base vegetable definition from the database
export interface Vegetable {
  id: string
  name: string
  category: VegetableCategory
  description: string
  planting: PlantingInfo
  care: CareRequirements
  companionPlants: string[]
  avoidPlants: string[]
  isCustom?: boolean
}

// A vegetable added to a garden plan
export interface PlannedVegetable {
  id: string                     // Unique ID for this planned instance
  vegetableId: string            // Reference to Vegetable.id
  quantity: number               // Number of plants planned
  plotId?: string                // Optional reference to GardenPlot.id
  plannedSowDate?: string        // ISO date string for planned sowing
  plannedTransplantDate?: string // ISO date string for transplanting
  expectedHarvestDate?: string   // ISO date string for expected harvest
  notes?: string                 // User notes for this vegetable
  status: PlannedVegetableStatus
}

export type PlannedVegetableStatus = 
  | 'planned'        // Just added to plan
  | 'sown'           // Seeds have been sown
  | 'transplanted'   // Seedlings transplanted
  | 'growing'        // Plants are growing
  | 'harvesting'     // Currently harvesting
  | 'complete'       // Harvest complete

// Garden plot/section
export interface GardenPlot {
  id: string
  name: string                   // e.g., "North Bed", "Greenhouse"
  description?: string
  width: number                  // Width in meters
  length: number                 // Length in meters
  color: string                  // Hex color for visual display
  sortOrder: number              // Order in list
}

// Complete garden plan
export interface GardenPlan {
  id: string
  name: string
  description?: string
  year: number                   // Year this plan is for
  createdAt: string              // ISO date string
  updatedAt: string              // ISO date string
  vegetables: PlannedVegetable[]
  plots: GardenPlot[]
  customVegetables: Vegetable[]  // User-created vegetables
}

// Storage format for all plans
export interface GardenPlannerData {
  version: number                // Schema version for migrations
  currentPlanId: string | null   // Currently selected plan
  plans: GardenPlan[]
}

// View modes for the planner
export type PlannerViewMode = 'list' | 'plot' | 'calendar'

// Filter options for vegetable selector
export interface VegetableFilters {
  search: string
  categories: VegetableCategory[]
  plantingMonth?: Month
  difficulty?: DifficultyLevel
  sunRequirement?: SunRequirement
}

// Planning progress statistics
export interface PlanProgress {
  totalVegetables: number
  withDates: number
  withPlots: number
  completionPercentage: number
}

// Export/Import format
export interface ExportedPlan {
  version: number
  exportedAt: string
  plan: GardenPlan
}

// Category display info
export interface CategoryInfo {
  id: VegetableCategory
  name: string
  icon: string           // Lucide icon name
  color: string          // Tailwind color class
}

// Month names for display
export const MONTH_NAMES: Record<Month, string> = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December'
}

export const MONTH_NAMES_SHORT: Record<Month, string> = {
  1: 'Jan',
  2: 'Feb',
  3: 'Mar',
  4: 'Apr',
  5: 'May',
  6: 'Jun',
  7: 'Jul',
  8: 'Aug',
  9: 'Sep',
  10: 'Oct',
  11: 'Nov',
  12: 'Dec'
}

// Category display configuration
export const CATEGORY_INFO: CategoryInfo[] = [
  { id: 'leafy-greens', name: 'Leafy Greens', icon: 'Leaf', color: 'green' },
  { id: 'root-vegetables', name: 'Root Vegetables', icon: 'Carrot', color: 'orange' },
  { id: 'brassicas', name: 'Brassicas', icon: 'Flower2', color: 'purple' },
  { id: 'legumes', name: 'Legumes', icon: 'Bean', color: 'lime' },
  { id: 'solanaceae', name: 'Solanaceae', icon: 'Cherry', color: 'red' },
  { id: 'cucurbits', name: 'Cucurbits', icon: 'Grape', color: 'yellow' },
  { id: 'alliums', name: 'Alliums', icon: 'CircleDot', color: 'amber' },
  { id: 'herbs', name: 'Herbs', icon: 'Flower', color: 'emerald' }
]

// Default plot colors
export const PLOT_COLORS = [
  '#22c55e', // green-500
  '#3b82f6', // blue-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f97316', // orange-500
]

