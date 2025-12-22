'use client'

import { useRef, useState } from 'react'
import { Send, Camera, X } from 'lucide-react'
import Image from 'next/image'

interface ChatInputProps {
  onSubmit: (message: string, image?: File) => void
  isLoading: boolean
}

export default function ChatInput({ onSubmit, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be smaller than 5MB')
        return
      }
      
      setSelectedImage(file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() || selectedImage) {
      onSubmit(input, selectedImage || undefined)
      setInput('')
      removeImage()
    }
  }

  return (
    <div className="border-t border-gray-200 p-4">
      {/* Image preview */}
      {imagePreview && (
        <div className="mb-4 relative inline-block">
          <Image 
            src={imagePreview} 
            alt="Plant for analysis"
            className="max-w-xs h-auto rounded border"
            style={{ maxHeight: '150px' }}
            width={300}
            height={150}
            unoptimized={true}
          />
          <button
            onClick={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about planting, pests, soil, weather, or any garden question..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            disabled={isLoading}
          />
          
          {/* Image upload button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-2"
            disabled={isLoading}
            title="Upload plant photo"
          >
            <Camera className="w-5 h-5" />
          </button>
          
          <button
            type="submit"
            disabled={isLoading || (!input.trim() && !selectedImage)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        {/* Helper text */}
        <div className="text-sm text-gray-500">
          {selectedImage ? (
            <span className="text-green-600">📷 Image ready for analysis</span>
          ) : (
            <span>💡 Tip: Upload a plant photo for visual diagnosis</span>
          )}
        </div>
      </form>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
        capture="environment"
      />
    </div>
  )
}

export { ChatInput }

