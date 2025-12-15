'use client'

import { List, Grid3X3, Calendar } from 'lucide-react'
import { PlannerViewMode } from '@/types/garden-planner'

interface ViewSwitcherProps {
  currentView: PlannerViewMode
  onChange: (view: PlannerViewMode) => void
}

const views: { id: PlannerViewMode; label: string; icon: React.ElementType }[] = [
  { id: 'list', label: 'List View', icon: List },
  { id: 'plot', label: 'Plot View', icon: Grid3X3 },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
]

export default function ViewSwitcher({ currentView, onChange }: ViewSwitcherProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      {views.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all ${
            currentView === id
              ? 'bg-white text-green-700 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Icon className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  )
}

