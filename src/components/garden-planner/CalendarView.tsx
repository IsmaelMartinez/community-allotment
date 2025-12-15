'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar, Leaf, Sun, Droplets, Scissors, Clock } from 'lucide-react'
import { PlannedVegetable, Month, MONTH_NAMES, CATEGORY_INFO } from '@/types/garden-planner'
import { getVegetableById } from '@/lib/vegetable-database'

interface CalendarViewProps {
  vegetables: PlannedVegetable[]
  year: number
}

type CalendarMode = 'yearly' | 'monthly'

export default function CalendarView({ vegetables, year }: CalendarViewProps) {
  const [mode, setMode] = useState<CalendarMode>('yearly')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [showPlantingGuide, setShowPlantingGuide] = useState(true)

  const currentMonth = new Date().getMonth() + 1

  // Get planting and harvest info for all vegetables
  const vegetableSchedule = useMemo(() => {
    return vegetables.map(veg => {
      const vegInfo = getVegetableById(veg.vegetableId)
      return {
        ...veg,
        vegInfo
      }
    }).filter(v => v.vegInfo)
  }, [vegetables])

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

  // Yearly Calendar View
  const renderYearlyView = () => {
    const months: Month[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[900px]">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 border border-gray-200 font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10 min-w-[150px]">
                Vegetable
              </th>
              {months.map(month => (
                <th
                  key={month}
                  className={`p-2 border border-gray-200 text-center text-sm font-semibold ${
                    month === currentMonth ? 'bg-green-100 text-green-800' : 'text-gray-700'
                  }`}
                >
                  {MONTH_NAMES[month].substring(0, 3)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vegetableSchedule.map(({ id, vegInfo }) => {
              if (!vegInfo) return null

              return (
                <tr key={id} className="hover:bg-gray-50">
                  <td className="p-3 border border-gray-200 sticky left-0 bg-white z-10">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${getCategoryColor(vegInfo.category)}`} />
                      <span className="font-medium text-sm">{vegInfo.name}</span>
                    </div>
                  </td>
                  {months.map(month => {
                    const canSowIndoors = vegInfo.planting.sowIndoorsMonths.includes(month)
                    const canSowOutdoors = vegInfo.planting.sowOutdoorsMonths.includes(month)
                    const canHarvest = vegInfo.planting.harvestMonths.includes(month)
                    const canTransplant = vegInfo.planting.transplantMonths.includes(month)

                    let bgColor = ''
                    const activities: string[] = []

                    if (canSowIndoors) {
                      activities.push('🌱')
                    }
                    if (canSowOutdoors) {
                      activities.push('🌿')
                      bgColor = 'bg-green-100'
                    }
                    if (canTransplant) {
                      activities.push('🪴')
                      if (!bgColor) bgColor = 'bg-cyan-100'
                    }
                    if (canHarvest) {
                      activities.push('✂️')
                      bgColor = canSowOutdoors ? 'bg-gradient-to-r from-green-100 to-amber-100' : 'bg-amber-100'
                    }

                    return (
                      <td
                        key={month}
                        className={`p-1 border border-gray-200 text-center ${bgColor} ${
                          month === currentMonth ? 'ring-2 ring-inset ring-green-300' : ''
                        }`}
                        title={[
                          canSowIndoors && 'Sow indoors',
                          canSowOutdoors && 'Sow outdoors',
                          canTransplant && 'Transplant',
                          canHarvest && 'Harvest'
                        ].filter(Boolean).join(', ')}
                      >
                        <div className="flex justify-center gap-0.5 text-xs">
                          {activities.map((emoji, i) => (
                            <span key={i}>{emoji}</span>
                          ))}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  // Monthly Calendar View
  const renderMonthlyView = () => {
    const daysInMonth = new Date(year, selectedMonth, 0).getDate()
    const firstDayOfMonth = new Date(year, selectedMonth - 1, 1).getDay()
    
    // Get vegetables that can be worked on this month
    const monthVegetables = vegetableSchedule.filter(({ vegInfo }) => {
      if (!vegInfo) return false
      const month = selectedMonth as Month
      return (
        vegInfo.planting.sowIndoorsMonths.includes(month) ||
        vegInfo.planting.sowOutdoorsMonths.includes(month) ||
        vegInfo.planting.transplantMonths.includes(month) ||
        vegInfo.planting.harvestMonths.includes(month)
      )
    })

    // Calculate weeks
    const weeks: (number | null)[][] = []
    let currentWeek: (number | null)[] = Array(firstDayOfMonth).fill(null)
    
    for (let day = 1; day <= daysInMonth; day++) {
      currentWeek.push(day)
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null)
      weeks.push(currentWeek)
    }

    const today = new Date()
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === selectedMonth
    const todayDate = today.getDate()

    return (
      <div className="space-y-6">
        {/* Month Navigator */}
        <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-md">
          <button
            onClick={() => setSelectedMonth(m => m > 1 ? m - 1 : 12)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xl font-semibold text-gray-800">
            {MONTH_NAMES[selectedMonth as Month]} {year}
          </h3>
          <button
            onClick={() => setSelectedMonth(m => m < 12 ? m + 1 : 1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calendar Grid */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-7 bg-gray-100">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {weeks.flat().map((day, idx) => (
                <div
                  key={idx}
                  className={`h-24 border border-gray-100 p-1 ${
                    day === null ? 'bg-gray-50' : ''
                  } ${
                    isCurrentMonth && day === todayDate ? 'bg-green-50 ring-2 ring-inset ring-green-300' : ''
                  }`}
                >
                  {day && (
                    <div className="text-xs font-medium text-gray-700">{day}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Month Tasks */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h4 className="font-semibold text-gray-800 mb-4">
              Tasks for {MONTH_NAMES[selectedMonth as Month]}
            </h4>
            
            {monthVegetables.length === 0 ? (
              <p className="text-gray-500 text-sm">No vegetables scheduled for this month.</p>
            ) : (
              <div className="space-y-4">
                {/* Group by activity */}
                {['sowIndoors', 'sowOutdoors', 'transplant', 'harvest'].map(activity => {
                  const activityVegetables = monthVegetables.filter(({ vegInfo }) => {
                    if (!vegInfo) return false
                    const month = selectedMonth as Month
                    switch (activity) {
                      case 'sowIndoors': return vegInfo.planting.sowIndoorsMonths.includes(month)
                      case 'sowOutdoors': return vegInfo.planting.sowOutdoorsMonths.includes(month)
                      case 'transplant': return vegInfo.planting.transplantMonths.includes(month)
                      case 'harvest': return vegInfo.planting.harvestMonths.includes(month)
                      default: return false
                    }
                  })

                  if (activityVegetables.length === 0) return null

                  const icons = {
                    sowIndoors: <Sun className="w-4 h-4 text-blue-500" />,
                    sowOutdoors: <Leaf className="w-4 h-4 text-green-500" />,
                    transplant: <Droplets className="w-4 h-4 text-cyan-500" />,
                    harvest: <Scissors className="w-4 h-4 text-amber-500" />
                  }

                  const labels = {
                    sowIndoors: 'Sow Indoors',
                    sowOutdoors: 'Sow Outdoors',
                    transplant: 'Transplant',
                    harvest: 'Harvest'
                  }

                  const colors = {
                    sowIndoors: 'bg-blue-50 border-blue-200',
                    sowOutdoors: 'bg-green-50 border-green-200',
                    transplant: 'bg-cyan-50 border-cyan-200',
                    harvest: 'bg-amber-50 border-amber-200'
                  }

                  return (
                    <div key={activity} className={`p-3 rounded-lg border ${colors[activity as keyof typeof colors]}`}>
                      <div className="flex items-center mb-2">
                        {icons[activity as keyof typeof icons]}
                        <span className="ml-2 font-medium text-sm">{labels[activity as keyof typeof labels]}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {activityVegetables.map(({ id, vegInfo }) => (
                          <span
                            key={id}
                            className="px-2 py-0.5 bg-white rounded text-xs text-gray-700"
                          >
                            {vegInfo?.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (vegetables.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No vegetables to schedule</h3>
        <p className="text-gray-500">Add vegetables to your plan to see the planting calendar.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('yearly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              mode === 'yearly'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Yearly Overview
          </button>
          <button
            onClick={() => setMode('monthly')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              mode === 'monthly'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Monthly View
          </button>
        </div>

        <button
          onClick={() => setShowPlantingGuide(!showPlantingGuide)}
          className="text-sm text-gray-600 hover:text-green-600"
        >
          {showPlantingGuide ? 'Hide' : 'Show'} Legend
        </button>
      </div>

      {/* Legend */}
      {showPlantingGuide && (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h4 className="font-semibold text-gray-700 mb-3">Planting Guide Legend</h4>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <span className="mr-2">🌱</span>
              <span className="text-gray-600">Sow indoors</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🌿</span>
              <span className="bg-green-100 px-2 rounded text-gray-600">Sow outdoors</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">🪴</span>
              <span className="bg-cyan-100 px-2 rounded text-gray-600">Transplant</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2">✂️</span>
              <span className="bg-amber-100 px-2 rounded text-gray-600">Harvest</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1 text-green-600" />
              <span className="text-gray-600">Current month</span>
            </div>
          </div>
        </div>
      )}

      {/* Calendar Content */}
      <div className="bg-white rounded-lg shadow-md p-4">
        {mode === 'yearly' ? renderYearlyView() : renderMonthlyView()}
      </div>
    </div>
  )
}

