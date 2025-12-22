'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  History, 
  ChevronLeft, 
  ChevronRight, 
  Lightbulb,
  Sprout
} from 'lucide-react'
import { getAvailableYears, getSeasonByYear, getProblemBedsSummary } from '@/data/historical-plans'
import { generate2026Plan } from '@/lib/rotation-planner'

// Extracted components
import Year2026Planning from '@/components/plan-history/Year2026Planning'
import SeasonView from '@/components/plan-history/SeasonView'
import RotationTimeline from '@/components/plan-history/RotationTimeline'

export default function PlanHistoryPage() {
  const availableYears = getAvailableYears()
  const [selectedYear, setSelectedYear] = useState<number | '2026'>(availableYears[0] || 2025)
  
  // Generate 2026 suggestions
  const plan2026 = generate2026Plan()
  const problemBedsSummary = getProblemBedsSummary()

  const currentSeason = selectedYear === '2026' ? null : getSeasonByYear(selectedYear)

  function navigateYear(direction: 'prev' | 'next') {
    if (selectedYear === '2026') {
      setSelectedYear(availableYears[0])
      return
    }
    
    const currentIndex = availableYears.indexOf(selectedYear)
    if (direction === 'prev' && currentIndex < availableYears.length - 1) {
      setSelectedYear(availableYears[currentIndex + 1])
    } else if (direction === 'next') {
      if (currentIndex === 0) {
        setSelectedYear('2026')
      } else if (currentIndex > 0) {
        setSelectedYear(availableYears[currentIndex - 1])
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <History className="w-10 h-10 text-amber-600 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Allotment History</h1>
              <p className="text-sm text-gray-500">Past seasons and 2026 planning</p>
            </div>
          </div>
          <Link 
            href="/garden-planner"
            className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:shadow-md transition"
          >
            <Sprout className="w-4 h-4" />
            Garden Planner
          </Link>
        </div>

        {/* Year Navigation */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateYear('prev')}
              disabled={selectedYear === availableYears[availableYears.length - 1]}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {availableYears.map(year => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    selectedYear === year
                      ? 'bg-amber-500 text-white shadow'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {year}
                </button>
              ))}
              <button
                onClick={() => setSelectedYear('2026')}
                className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                  selectedYear === '2026'
                    ? 'bg-green-500 text-white shadow'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                <Lightbulb className="w-4 h-4" />
                Plan 2026
              </button>
            </div>

            <button
              onClick={() => navigateYear('next')}
              disabled={selectedYear === '2026'}
              className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* 2026 Planning View */}
        {selectedYear === '2026' && (
          <Year2026Planning 
            plan2026={plan2026} 
            problemBedsSummary={problemBedsSummary} 
          />
        )}

        {/* Historical Season View */}
        {selectedYear !== '2026' && currentSeason && (
          <SeasonView season={currentSeason} year={selectedYear} />
        )}

        {/* Rotation Timeline */}
        <RotationTimeline availableYears={availableYears} plan2026={plan2026} />
      </div>
    </div>
  )
}
