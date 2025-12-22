'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * Hook for persisting state in localStorage with automatic serialization
 * Simplifies the pattern of loading/saving state from/to localStorage
 * 
 * @param key - The localStorage key to use
 * @param initialValue - Default value if nothing is stored
 * @returns Tuple of [value, setValue, clearValue]
 */
export function usePersistedState<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Initialize state with a function to avoid hydration mismatch
  const [state, setState] = useState<T>(() => {
    // Return initial value during SSR
    if (typeof window === 'undefined') {
      return initialValue
    }
    
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        return JSON.parse(stored) as T
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
    }
    
    return initialValue
  })

  // Track if we've hydrated (mounted on client)
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate on mount
  useEffect(() => {
    setIsHydrated(true)
    
    // Re-read from localStorage on mount to handle hydration
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        setState(JSON.parse(stored) as T)
      }
    } catch (error) {
      console.error(`Error hydrating localStorage key "${key}":`, error)
    }
  }, [key])

  // Save to localStorage whenever state changes (after hydration)
  useEffect(() => {
    if (!isHydrated) return
    
    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error)
    }
  }, [key, state, isHydrated])

  // Wrapped setter that handles function updates
  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setState(prev => {
      const nextValue = typeof value === 'function' 
        ? (value as (prev: T) => T)(prev) 
        : value
      return nextValue
    })
  }, [])

  // Clear the stored value
  const clearValue = useCallback(() => {
    try {
      localStorage.removeItem(key)
      setState(initialValue)
    } catch (error) {
      console.error(`Error clearing localStorage key "${key}":`, error)
    }
  }, [key, initialValue])

  return [state, setValue, clearValue]
}

/**
 * Hook for boolean flags with localStorage persistence
 * Convenience wrapper around usePersistedState
 */
export function usePersistedBoolean(
  key: string,
  defaultValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = usePersistedState(key, defaultValue)
  
  const toggle = useCallback(() => {
    setValue(prev => !prev)
  }, [setValue])
  
  return [value, toggle, setValue]
}

/**
 * Hook for numeric values with localStorage persistence
 * Includes validation to ensure value stays within bounds
 */
export function usePersistedNumber(
  key: string,
  defaultValue: number = 0,
  options?: { min?: number; max?: number }
): [number, (value: number) => void, () => void] {
  const [value, setValue, clearValue] = usePersistedState(key, defaultValue)
  
  const setValidatedValue = useCallback((newValue: number) => {
    let validValue = newValue
    
    if (options?.min !== undefined) {
      validValue = Math.max(options.min, validValue)
    }
    if (options?.max !== undefined) {
      validValue = Math.min(options.max, validValue)
    }
    
    setValue(validValue)
  }, [setValue, options?.min, options?.max])
  
  return [value, setValidatedValue, clearValue]
}

/**
 * Hook for managing persisted arrays with common operations
 */
export function usePersistedArray<T>(
  key: string,
  defaultValue: T[] = []
): {
  items: T[]
  setItems: (items: T[]) => void
  addItem: (item: T) => void
  removeItem: (predicate: (item: T) => boolean) => void
  updateItem: (predicate: (item: T) => boolean, update: Partial<T> | ((item: T) => T)) => void
  clearItems: () => void
} {
  const [items, setItems, clearItems] = usePersistedState<T[]>(key, defaultValue)
  
  const addItem = useCallback((item: T) => {
    setItems(prev => [...prev, item])
  }, [setItems])
  
  const removeItem = useCallback((predicate: (item: T) => boolean) => {
    setItems(prev => prev.filter(item => !predicate(item)))
  }, [setItems])
  
  const updateItem = useCallback((
    predicate: (item: T) => boolean,
    update: Partial<T> | ((item: T) => T)
  ) => {
    setItems(prev => prev.map(item => {
      if (!predicate(item)) return item
      
      if (typeof update === 'function') {
        return (update as (item: T) => T)(item)
      }
      
      return { ...item, ...update }
    }))
  }, [setItems])
  
  return {
    items,
    setItems,
    addItem,
    removeItem,
    updateItem,
    clearItems
  }
}

export default usePersistedState

