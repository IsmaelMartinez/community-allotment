/**
 * API and UI Type Definitions
 * 
 * Types for API responses, chat/AI advisor, user location, and UI component props.
 */

// API Response Types
export interface ApiErrorResponse {
  error: string
}

export interface ApiSuccessResponse<T> {
  data: T
}

// Chat/AI Advisor Types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  image?: string | null
}

export interface AIAdvisorRequest {
  message: string
  messages?: ChatMessage[]
  image?: {
    data: string
    type: string
  }
}

export interface AIAdvisorResponse {
  response: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

// User Location Types
export interface UserLocation {
  latitude: number
  longitude: number
  city?: string
  country?: string
  timezone?: string
}

// Markdown Component Props
export interface MarkdownComponentProps {
  children?: React.ReactNode
  className?: string
  href?: string
}


