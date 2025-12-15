'use client'

import { useState, useMemo } from 'react'
import { Search, Filter, Plus, X, Sun, Droplets, Clock, Leaf, ChevronDown, ChevronUp, Info } from 'lucide-react'
import { Vegetable, VegetableCategory, Month, CATEGORY_INFO, MONTH_NAMES_SHORT } from '@/types/garden-planner'
import { vegetables } from '@/lib/vegetable-database'

interface VegetableSelectorProps {
  onAddVegetable: (vegetableId: string, quantity: number) => void
  existingVegetableIds?: string[]
}

const sunIcons = {
  'full-sun': '☀️',
  'partial-shade': '⛅',
  'shade': '🌥️'
}

const waterLabels = {
  'low': 'Low',
  'moderate': 'Moderate',
  'high': 'High'
}

const difficultyColors = {
  'beginner': 'bg-green-100 text-green-800',
  'intermediate': 'bg-yellow-100 text-yellow-800',
  'advanced': 'bg-red-100 text-red-800'
}

export default function VegetableSelector({ onAddVegetable, existingVegetableIds = [] }: VegetableSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<VegetableCategory | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState<Month | null>(null)
  const [expandedVegetable, setExpandedVegetable] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const filteredVegetables = useMemo(() => {
    return vegetables.filter(veg => {
      // Search filter
      if (searchTerm && !veg.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false
      }
      
      // Category filter
      if (selectedCategory !== 'all' && veg.category !== selectedCategory) {
        return false
      }

      // Month filter (can sow or harvest in this month)
      if (selectedMonth) {
        const canSow = veg.planting.sowOutdoorsMonths.includes(selectedMonth) || 
                       veg.planting.sowIndoorsMonths.includes(selectedMonth)
        const canHarvest = veg.planting.harvestMonths.includes(selectedMonth)
        if (!canSow && !canHarvest) {
          return false
        }
      }

      return true
    })
  }, [searchTerm, selectedCategory, selectedMonth])

  const handleAddVegetable = (vegetableId: string) => {
    const quantity = quantities[vegetableId] || 1
    onAddVegetable(vegetableId, quantity)
    setQuantities(prev => ({ ...prev, [vegetableId]: 1 }))
  }

  const getCategoryColor = (category: VegetableCategory) => {
    const info = CATEGORY_INFO.find(c => c.id === category)
    const colors: Record<string, string> = {
      green: 'bg-green-100 text-green-800 border-green-300',
      orange: 'bg-orange-100 text-orange-800 border-orange-300',
      purple: 'bg-purple-100 text-purple-800 border-purple-300',
      lime: 'bg-lime-100 text-lime-800 border-lime-300',
      red: 'bg-red-100 text-red-800 border-red-300',
      yellow: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      amber: 'bg-amber-100 text-amber-800 border-amber-300',
      emerald: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    }
    return colors[info?.color || 'green']
  }

  const getCategoryName = (category: VegetableCategory) => {
    return CATEGORY_INFO.find(c => c.id === category)?.name || category
  }

  const renderPlantingMonths = (veg: Vegetable) => {
    const months: Month[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    return (
      <div className="flex gap-1 mt-2">
        {months.map(month => {
          const canSowIndoors = veg.planting.sowIndoorsMonths.includes(month)
          const canSowOutdoors = veg.planting.sowOutdoorsMonths.includes(month)
          const canHarvest = veg.planting.harvestMonths.includes(month)
          
          let bgColor = 'bg-gray-100'
          let title = MONTH_NAMES_SHORT[month]
          
          if (canHarvest) {
            bgColor = 'bg-amber-300'
            title += ' (Harvest)'
          }
          if (canSowOutdoors) {
            bgColor = 'bg-green-400'
            title += ' (Sow outdoors)'
          }
          if (canSowIndoors) {
            bgColor = canSowOutdoors ? 'bg-green-600' : 'bg-blue-400'
            title += ' (Sow indoors)'
          }

          return (
            <div
              key={month}
              className={`w-6 h-6 rounded text-xs flex items-center justify-center ${bgColor}`}
              title={title}
            >
              {MONTH_NAMES_SHORT[month].charAt(0)}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Leaf className="w-6 h-6 text-green-600 mr-2" />
        <h2 className="text-xl font-bold text-gray-800">Add Vegetables</h2>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search vegetables..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center text-sm text-gray-600 hover:text-green-600 mb-4"
      >
        <Filter className="w-4 h-4 mr-1" />
        {showFilters ? 'Hide Filters' : 'Show Filters'}
        {showFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
      </button>

      {/* Filters */}
      {showFilters && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1 text-sm rounded-full border transition ${
                  selectedCategory === 'all'
                    ? 'bg-green-600 text-white border-green-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                }`}
              >
                All
              </button>
              {CATEGORY_INFO.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 text-sm rounded-full border transition ${
                    selectedCategory === cat.id
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-green-400'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Month Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Planting/Harvest Month</label>
            <select
              value={selectedMonth || ''}
              onChange={(e) => setSelectedMonth(e.target.value ? parseInt(e.target.value) as Month : null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="">All Months</option>
              {Object.entries(MONTH_NAMES_SHORT).map(([num, name]) => (
                <option key={num} value={num}>{name}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(selectedCategory !== 'all' || selectedMonth) && (
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedMonth(null)
              }}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Planting Guide Legend */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-xs text-gray-600 flex flex-wrap gap-4">
          <span className="flex items-center"><span className="w-3 h-3 bg-blue-400 rounded mr-1"></span> Sow indoors</span>
          <span className="flex items-center"><span className="w-3 h-3 bg-green-400 rounded mr-1"></span> Sow outdoors</span>
          <span className="flex items-center"><span className="w-3 h-3 bg-amber-300 rounded mr-1"></span> Harvest</span>
        </div>
      </div>

      {/* Vegetable List */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {filteredVegetables.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No vegetables found matching your criteria.</p>
          </div>
        ) : (
          filteredVegetables.map(veg => {
            const isExpanded = expandedVegetable === veg.id
            const alreadyAdded = existingVegetableIds.includes(veg.id)

            return (
              <div
                key={veg.id}
                className={`border rounded-lg overflow-hidden transition ${
                  alreadyAdded ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-green-300'
                }`}
              >
                {/* Header */}
                <div
                  className="p-4 cursor-pointer"
                  onClick={() => setExpandedVegetable(isExpanded ? null : veg.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-800">{veg.name}</h3>
                        <span className={`px-2 py-0.5 text-xs rounded-full border ${getCategoryColor(veg.category)}`}>
                          {getCategoryName(veg.category)}
                        </span>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${difficultyColors[veg.care.difficulty]}`}>
                          {veg.care.difficulty}
                        </span>
                        {alreadyAdded && (
                          <span className="px-2 py-0.5 text-xs bg-green-500 text-white rounded-full">
                            In Plan
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{veg.description}</p>
                      
                      {/* Quick info */}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span title="Sun requirement">{sunIcons[veg.care.sun]} {veg.care.sun.replace('-', ' ')}</span>
                        <span className="flex items-center" title="Water requirement">
                          <Droplets className="w-3 h-3 mr-1" />
                          {waterLabels[veg.care.water]}
                        </span>
                        <span className="flex items-center" title="Days to harvest">
                          <Clock className="w-3 h-3 mr-1" />
                          {veg.planting.daysToHarvest.min}-{veg.planting.daysToHarvest.max} days
                        </span>
                      </div>

                      {/* Planting calendar */}
                      {renderPlantingMonths(veg)}
                    </div>

                    {/* Expand/Collapse icon */}
                    <div className="ml-4">
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-200 bg-gray-50">
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      {/* Care Requirements */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                          <Info className="w-4 h-4 mr-1" />
                          Care Requirements
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li className="flex items-center">
                            <Sun className="w-4 h-4 mr-2 text-yellow-500" />
                            {sunIcons[veg.care.sun]} {veg.care.sun.replace('-', ' ')}
                          </li>
                          <li className="flex items-center">
                            <Droplets className="w-4 h-4 mr-2 text-blue-500" />
                            Water: {waterLabels[veg.care.water]}
                          </li>
                          <li>Spacing: {veg.care.spacing.between}cm between plants, {veg.care.spacing.rows}cm between rows</li>
                          <li>Planting depth: {veg.care.depth}cm</li>
                        </ul>
                      </div>

                      {/* Tips */}
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Growing Tips</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {veg.care.tips.map((tip, i) => (
                            <li key={i} className="flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Companion Plants */}
                    {(veg.companionPlants.length > 0 || veg.avoidPlants.length > 0) && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid md:grid-cols-2 gap-4">
                          {veg.companionPlants.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-green-700 mb-1">Good Companions</h4>
                              <p className="text-sm text-gray-600">{veg.companionPlants.join(', ')}</p>
                            </div>
                          )}
                          {veg.avoidPlants.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-red-700 mb-1">Avoid Planting With</h4>
                              <p className="text-sm text-gray-600">{veg.avoidPlants.join(', ')}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Add to Plan */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-4">
                      <div className="flex items-center">
                        <label htmlFor={`qty-${veg.id}`} className="text-sm text-gray-600 mr-2">
                          Quantity:
                        </label>
                        <input
                          type="number"
                          id={`qty-${veg.id}`}
                          min="1"
                          max="999"
                          value={quantities[veg.id] || 1}
                          onChange={(e) => setQuantities(prev => ({ 
                            ...prev, 
                            [veg.id]: Math.max(1, parseInt(e.target.value) || 1)
                          }))}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <button
                        onClick={() => handleAddVegetable(veg.id)}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add to Plan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Results count */}
      <div className="mt-4 text-sm text-gray-500 text-center">
        Showing {filteredVegetables.length} of {vegetables.length} vegetables
      </div>
    </div>
  )
}

