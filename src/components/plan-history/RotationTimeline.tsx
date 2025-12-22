'use client'

import { ALL_BED_IDS, BED_COLORS, getBedById } from '@/data/allotment-layout'
import { getSeasonByYear } from '@/data/historical-plans'
import { ROTATION_GROUP_DISPLAY } from '@/lib/rotation-planner'
import { PhysicalBedId, RotationGroup, RotationPlan } from '@/types/garden-planner'

interface RotationTimelineProps {
  availableYears: number[]
  plan2026: RotationPlan
}

// Get bed status info
function getBedStatusInfo(bedId: PhysicalBedId) {
  const bed = getBedById(bedId)
  if (!bed) return null
  
  return {
    status: bed.status,
    isProblem: bed.status === 'problem',
    isPerennial: bed.status === 'perennial',
    problemNote: bed.problemNotes
  }
}

export default function RotationTimeline({ availableYears, plan2026 }: RotationTimelineProps) {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Rotation Timeline - All Beds</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-3 text-gray-600">Bed</th>
              <th className="text-left py-2 px-3 text-gray-600">Status</th>
              {availableYears.slice().reverse().map(year => (
                <th key={year} className="text-center py-2 px-3 text-gray-600">{year}</th>
              ))}
              <th className="text-center py-2 px-3 text-green-600">2026</th>
            </tr>
          </thead>
          <tbody>
            {ALL_BED_IDS.map(bedId => {
              const bed = getBedById(bedId)
              const statusInfo = getBedStatusInfo(bedId)
              
              return (
                <tr key={bedId} className={`border-b last:border-0 ${statusInfo?.isProblem ? 'bg-red-50' : ''}`}>
                  <td className="py-2 px-3">
                    <span 
                      className="inline-block px-2 py-1 rounded text-white text-center text-xs font-medium"
                      style={{ backgroundColor: BED_COLORS[bedId] }}
                    >
                      {bedId}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      statusInfo?.isProblem 
                        ? 'bg-red-100 text-red-700' 
                        : statusInfo?.isPerennial
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                    }`}>
                      {bed?.status || 'unknown'}
                    </span>
                  </td>
                  {availableYears.slice().reverse().map(year => {
                    const season = getSeasonByYear(year)
                    const bedPlan = season?.beds.find(b => b.bedId === bedId)
                    const display = bedPlan ? ROTATION_GROUP_DISPLAY[bedPlan.rotationGroup as RotationGroup] : null
                    const hasPoor = bedPlan?.plantings.some(p => p.success === 'poor')
                    
                    return (
                      <td key={year} className="text-center py-2 px-3">
                        {display ? (
                          <span 
                            title={display.name}
                            className={hasPoor ? 'opacity-50' : ''}
                          >
                            {display.emoji}
                            {hasPoor && <span className="text-red-500 text-xs ml-0.5">!</span>}
                          </span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    )
                  })}
                  <td className="text-center py-2 px-3">
                    {(() => {
                      const suggestion = plan2026.suggestions.find(s => s.bedId === bedId)
                      if (!suggestion) return null
                      
                      if (suggestion.isProblemBed) {
                        return <span title="Needs attention" className="text-red-400">?</span>
                      }
                      if (suggestion.isPerennial) {
                        return <span title="Perennial - no change">🌳</span>
                      }
                      
                      const display = ROTATION_GROUP_DISPLAY[suggestion.suggestedGroup]
                      return display ? (
                        <span title={display.name} className="opacity-70">{display.emoji}</span>
                      ) : null
                    })()}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 text-xs text-gray-500 border-t pt-4">
        <span className="font-medium text-gray-700">Legend:</span>
        {Object.entries(ROTATION_GROUP_DISPLAY).map(([key, value]) => (
          <span key={key} className="flex items-center gap-1">
            {value.emoji} {value.name}
          </span>
        ))}
        <span className="flex items-center gap-1 text-red-500">! = poor results</span>
        <span className="flex items-center gap-1 text-red-400">? = needs attention</span>
      </div>
    </div>
  )
}

