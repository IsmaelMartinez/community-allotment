'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, Truck, Package, Users, Sprout } from 'lucide-react'

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const eventTypes = {
  delivery: { color: 'bg-orange-100 border-orange-300 text-orange-800', icon: Truck },
  order: { color: 'bg-blue-100 border-blue-300 text-blue-800', icon: Package },
  community: { color: 'bg-purple-100 border-purple-300 text-purple-800', icon: Users },
  seasonal: { color: 'bg-green-100 border-green-300 text-green-800', icon: Sprout }
}

const events = {
  '2025-06-21': [
    { id: 1, title: 'Bark Mulch Delivery', time: '09:00', type: 'delivery', description: 'Fresh bark mulch delivery at main entrance' },
  ],
  '2025-06-20': [
    { id: 2, title: 'Seed Order Deadline', time: 'All Day', type: 'order', description: 'Last day to submit summer seed orders' },
  ],
  '2025-06-23': [
    { id: 3, title: 'Compost Delivery', time: '10:00', type: 'delivery', description: 'Organic compost delivery (rescheduled)' },
  ],
  '2025-06-28': [
    { id: 4, title: 'Community BBQ & Plot Tour', time: '15:00', type: 'community', description: 'Annual summer BBQ and garden tour' },
  ],
  '2025-06-30': [
    { id: 5, title: 'June Planting Tasks', time: 'All Day', type: 'seasonal', description: 'Last chance to plant heat-loving vegetables' },
  ],
  '2025-07-01': [
    { id: 6, title: 'Summer Watering Tips Workshop', time: '18:00', type: 'community', description: 'Learn efficient watering techniques' },
  ],
  '2025-07-05': [
    { id: 7, title: 'Tool Sharing Day', time: '10:00', type: 'community', description: 'Bring tools to share and borrow' },
  ],
  '2025-07-15': [
    { id: 8, title: 'Mid-Season Plant Health Check', time: 'All Day', type: 'seasonal', description: 'Assess plant health and apply treatments' },
  ]
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 18)) // June 2025
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayWeekday = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'next') {
        newDate.setMonth(newDate.getMonth() + 1)
      } else {
        newDate.setMonth(newDate.getMonth() - 1)
      }
      return newDate
    })
  }

  const formatDate = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const getDayEvents = (day: number) => {
    const dateStr = formatDate(day)
    return events[dateStr as keyof typeof events] || []
  }

  const renderCalendarDays = () => {
    const days = []
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50"></div>)
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(day)
      const dayEvents = getDayEvents(day)
      const isToday = day === 18 && month === 5 // June 18, 2025
      const isSelected = selectedDate === dateStr
      
      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-1 cursor-pointer transition hover:bg-gray-50 ${
            isToday ? 'bg-primary-50 border-primary-300' : ''
          } ${isSelected ? 'ring-2 ring-primary-500' : ''}`}
          onClick={() => setSelectedDate(dateStr)}
        >
          <div className={`text-sm font-medium ${isToday ? 'text-primary-800' : 'text-gray-700'}`}>
            {day}
          </div>
          <div className="mt-1 space-y-1">
            {dayEvents.slice(0, 2).map((event) => {
              const eventStyle = eventTypes[event.type as keyof typeof eventTypes]
              return (
                <div
                  key={event.id}
                  className={`text-xs p-1 rounded border ${eventStyle.color} truncate`}
                  title={event.title}
                >
                  {event.title}
                </div>
              )
            })}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </div>
      )
    }
    
    return days
  }

  const selectedEvents = selectedDate ? (events[selectedDate as keyof typeof events] || []) : []

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">📅 Community Calendar</h1>
        <p className="text-gray-600 mb-6">
          Keep track of deliveries, community events, seasonal tasks, and important deadlines.
        </p>
        
        {/* Add Event Button */}
        <div className="flex justify-end mb-4">
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition flex items-center">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Calendar Header */}
            <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 hover:bg-primary-700 rounded"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-semibold">
                {months[month]} {year}
              </h2>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 hover:bg-primary-700 rounded"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 bg-gray-100">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7">
              {renderCalendarDays()}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Legend */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Event Types</h3>
            <div className="space-y-2">
              {Object.entries(eventTypes).map(([type, style]) => {
                const IconComponent = style.icon
                return (
                  <div key={type} className="flex items-center">
                    <IconComponent className="w-4 h-4 mr-2 text-gray-600" />
                    <div className={`w-4 h-4 rounded border ${style.color} mr-2`}></div>
                    <span className="text-sm capitalize">{type}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selected Date Events */}
          {selectedDate && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-lg font-semibold mb-4">
                Events for {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              {selectedEvents.length > 0 ? (
                <div className="space-y-3">
                  {selectedEvents.map((event) => {
                    const eventStyle = eventTypes[event.type as keyof typeof eventTypes]
                    const IconComponent = eventStyle.icon
                    return (
                      <div key={event.id} className={`p-3 rounded-lg border ${eventStyle.color}`}>
                        <div className="flex items-start">
                          <IconComponent className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <div className="font-medium">{event.title}</div>
                            <div className="text-sm opacity-75">{event.time}</div>
                            <div className="text-sm mt-1">{event.description}</div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No events scheduled for this date.</p>
              )}
            </div>
          )}

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {Object.entries(events)
                .flatMap(([date, dayEvents]) => 
                  dayEvents.map(event => ({ ...event, date }))
                )
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .slice(0, 5)
                .map((event) => {
                  const eventStyle = eventTypes[event.type as keyof typeof eventTypes]
                  const IconComponent = eventStyle.icon
                  const eventDate = new Date(event.date)
                  return (
                    <div key={`${event.date}-${event.id}`} className="flex items-center p-2 hover:bg-gray-50 rounded">
                      <IconComponent className="w-4 h-4 mr-3 text-gray-600 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{event.title}</div>
                        <div className="text-xs text-gray-500">
                          {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {event.time}
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
