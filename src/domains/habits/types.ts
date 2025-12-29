// Habit Domain Types
export type HabitId = string
export type HabitName = string
export type HabitColor = string

export interface Habit {
  id: HabitId
  name: HabitName
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  color?: HabitColor
}

export interface ValidationResult {
  isValid: boolean
  error?: string
}

export interface HabitError {
  type: 'INVALID_NAME' | 'DUPLICATE_NAME' | 'NOT_FOUND'
  message: string
}

// Business Logic Interfaces
export interface HabitOperations {
  createHabit(name: HabitName): Promise<Habit>
  updateHabitName(id: HabitId, name: HabitName): Promise<Habit>
  deleteHabit(id: HabitId): Promise<void>
  getHabits(): Promise<Habit[]>
  validateHabitName(name: string): ValidationResult
}

// Data Layer Interface
export interface HabitStorage {
  saveHabit(habit: Habit): Promise<void>
  getHabits(): Promise<Habit[]>
  getHabitById(id: HabitId): Promise<Habit | null>
  deleteHabit(id: HabitId): Promise<void>
}