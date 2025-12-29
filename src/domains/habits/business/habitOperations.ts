import type { Habit, HabitId, HabitName, ValidationResult, HabitOperations } from '../types'

// Generate unique ID for habits
function generateHabitId(): HabitId {
  return `habit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Validate habit name according to requirements
export function validateHabitName(name: string): ValidationResult {
  const trimmedName = name.trim()
  
  if (!trimmedName || trimmedName.length === 0) {
    return {
      isValid: false,
      error: 'Habit name cannot be empty'
    }
  }
  
  if (trimmedName !== name) {
    return {
      isValid: false,
      error: 'Habit name cannot contain only whitespace'
    }
  }
  
  if (trimmedName.length > 100) {
    return {
      isValid: false,
      error: 'Habit name must be less than 100 characters'
    }
  }
  
  return { isValid: true }
}

// Create a new habit with validation
export function createHabit(name: HabitName): Habit {
  const validation = validateHabitName(name)
  if (!validation.isValid) {
    throw new Error(validation.error)
  }
  
  const now = new Date()
  return {
    id: generateHabitId(),
    name: name.trim(),
    createdAt: now,
    updatedAt: now,
    isActive: true
  }
}

// Update habit name while preserving other data
export function updateHabitName(habit: Habit, newName: HabitName): Habit {
  const validation = validateHabitName(newName)
  if (!validation.isValid) {
    throw new Error(validation.error)
  }
  
  return {
    ...habit,
    name: newName.trim(),
    updatedAt: new Date()
  }
}

// Soft delete habit (mark as inactive)
export function deleteHabit(habit: Habit): Habit {
  return {
    ...habit,
    isActive: false,
    updatedAt: new Date()
  }
}