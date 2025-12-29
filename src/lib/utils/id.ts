/**
 * Shared ID generation utility
 * Centralized ID generation for all entities in the application
 */

/**
 * Generate a unique ID with an optional prefix
 * @param prefix - Optional prefix for the ID (e.g., 'planting', 'task')
 * @returns A unique ID string
 */
export function generateId(prefix?: string): string {
  const base = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  return prefix ? `${prefix}-${base}` : base
}


