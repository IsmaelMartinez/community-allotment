'use client'

import { useState } from 'react'
import { Send, Leaf, Sun, Cloud, Bug, Sprout, Calendar } from 'lucide-react'

const quickTopics = [
  { icon: Sprout, title: 'Planting Guide', query: 'What should I plant in my allotment this month?' },
  { icon: Bug, title: 'Pest Control', query: 'How do I deal with common garden pests naturally?' },
  { icon: Sun, title: 'Summer Care', query: 'How should I care for my plants during hot summer weather?' },
  { icon: Cloud, title: 'Watering Tips', query: 'What are the best watering practices for vegetables?' },
  { icon: Calendar, title: 'Seasonal Tasks', query: 'What are the most important gardening tasks for June?' },
  { icon: Leaf, title: 'Plant Health', query: 'My tomato leaves are turning yellow, what could be wrong?' }
]

const sampleConversation = [
  {
    role: 'user',
    content: 'My tomato plants have yellow leaves on the bottom. Should I be worried?'
  },
  {
    role: 'assistant',
    content: 'Yellow lower leaves on tomato plants are quite common and usually not a major concern! Here are the most likely causes:\n\n🍃 **Natural aging**: Lower leaves naturally yellow and drop as the plant grows taller.\n\n💧 **Watering issues**: Either overwatering or inconsistent watering can cause yellowing. Tomatoes prefer deep, infrequent watering.\n\n🌱 **Nutrient deficiency**: Nitrogen deficiency causes lower leaves to yellow first. Consider a balanced fertilizer.\n\n**What to do:**\n• Remove yellow leaves to prevent disease spread\n• Check soil moisture - it should be consistently moist but not waterlogged\n• Mulch around plants to maintain soil moisture\n• Feed with tomato fertilizer every 2 weeks\n\nIf yellowing spreads rapidly up the plant or you see spots/lesions, it could be a disease like blight. Feel free to describe any other symptoms!'
  }
]

export default function AIAdvisorPage() {
  const [messages, setMessages] = useState(sampleConversation)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (query: string) => {
    const newMessage = { role: 'user' as const, content: query }
    setMessages(prev => [...prev, newMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I'd be happy to help with your gardening question! Based on what you've described, here are some recommendations tailored for allotment growing...",
        "Great question! For allotment gardeners, this is a common concern. Let me break this down for you...",
        "This is perfect timing for asking about this! Given that we're in June, here's what I recommend for your allotment..."
      ]
      
      const response = {
        role: 'assistant' as const,
        content: responses[Math.floor(Math.random() * responses.length)] + "\n\n(This is a demo response. In the full app, this would connect to a specialized plant/gardening AI model for accurate, detailed advice.)"
      }
      
      setMessages(prev => [...prev, response])
      setIsLoading(false)
    }, 1500)
  }

  const handleQuickTopic = (query: string) => {
    handleSubmit(query)
  }

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      handleSubmit(input)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">🤖 AI Plant Advisor</h1>
        <p className="text-gray-600 mb-6">
          Get expert gardening advice powered by AI. Ask about plant care, pest control, 
          seasonal tasks, or any allotment-related questions.
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <Leaf className="w-5 h-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">Specialized for Allotment Gardening</span>
          </div>
          <p className="text-green-700 text-sm">
            Our AI is trained specifically on allotment gardening, vegetable growing, 
            and climate-specific advice for optimal results.
          </p>
        </div>
      </div>

      {/* Quick Topics */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">🚀 Quick Topics</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickTopics.map((topic, index) => {
            const IconComponent = topic.icon
            return (
              <button
                key={index}
                onClick={() => handleQuickTopic(topic.query)}
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

      {/* Chat Interface */}
      <div className="bg-white rounded-lg shadow-md">
        {/* Chat Header */}
        <div className="border-b border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-800">Chat with Plant Expert AI</h3>
          <p className="text-sm text-gray-600">Ask anything about your allotment garden!</p>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl p-4 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-4 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <form onSubmit={handleInputSubmit} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about plant care, pests, diseases, or seasonal tasks..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-800">💡 Tips for Best Results</h3>
        <ul className="space-y-2 text-blue-700">
          <li>• Be specific about your location and climate when asking for advice</li>
          <li>• Include details about symptoms, timing, and growing conditions</li>
          <li>• Ask follow-up questions to get more detailed guidance</li>
          <li>• Mention your experience level for appropriately tailored advice</li>
        </ul>
      </div>
    </div>
  )
}
