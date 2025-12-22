'use client'

import { Leaf, Sun, Cloud, Bug, Sprout, Calendar, Camera, Recycle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface QuickTopic {
  icon: LucideIcon
  title: string
  query: string
}

const quickTopics: QuickTopic[] = [
  { icon: Sprout, title: 'Planting Guide', query: 'What should I plant in my allotment this month?' },
  { icon: Bug, title: 'Pest Control', query: 'How do I deal with common garden pests naturally?' },
  { icon: Sun, title: 'Summer Care', query: 'How should I care for my plants during hot summer weather?' },
  { icon: Cloud, title: 'Watering Tips', query: 'What are the best watering practices for vegetables?' },
  { icon: Calendar, title: 'Seasonal Tasks', query: 'What are the most important gardening tasks for June?' },
  { icon: Recycle, title: 'Composting Help', query: 'How do I start composting? What materials should I use?' },
  { icon: Camera, title: 'Plant Diagnosis', query: 'I\'ve uploaded a photo of my plant. Can you tell me what might be wrong with it?' },
  { icon: Leaf, title: 'Plant Health', query: 'My tomato leaves are turning yellow, what could be wrong?' }
]

interface QuickTopicsProps {
  onSelectTopic: (query: string) => void
}

export default function QuickTopics({ onSelectTopic }: QuickTopicsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">🌿 Popular Gardening Topics</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickTopics.map((topic, index) => {
          const IconComponent = topic.icon
          return (
            <button
              key={`topic-${index}-${topic.title}`}
              onClick={() => onSelectTopic(topic.query)}
              className="bg-white p-4 rounded-lg shadow-md border hover:shadow-lg transition text-left"
            >
              <div className="flex items-center mb-2">
                <IconComponent className="w-5 h-5 text-primary-600 mr-2" />
                <span className="font-medium text-gray-800">{topic.title}</span>
              </div>
              <p className="text-sm text-gray-600">{topic.query}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
