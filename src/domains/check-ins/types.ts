// Check-ins Domain Types
export type CheckInId = string
export type CheckInDate = string // ISO date string (YYYY-MM-DD)
export type HabitId = string // Re-export from habits domain

export interface CheckIn {
  id: CheckInId
  habitId: HabitId
  date: CheckInDate
  createdAt: Date
  synced: boolean
}

export interface CheckInError {
  type: 'ALREADY_CHECKED_IN' | 'INVALID_DATE' | 'TOO_OLD' | 'FUTURE_DATE'
  message: string
}

// Business Logic Interfaces
export interface CheckInOperations {
  createCheckIn(habitId: HabitId, date: CheckInDate): Promise<CheckIn>
  removeCheckIn(habitId: HabitId, date: CheckInDate): Promise<void>
  getCheckInsForHabit(habitId: HabitId): Promise<CheckIn[]>
  getTodaysCheckIns(): Promise<CheckIn[]>
  canCheckInForDate(date: CheckInDate): boolean
  isCheckedInToday(habitId: HabitId): Promise<boolean>
}

// Data Layer Interface
export interface CheckInStorage {
  saveCheckIn(checkIn: CheckIn): Promise<void>
  getCheckInsForHabit(habitId: HabitId): Promise<CheckIn[]>
  getCheckInByHabitAndDate(habitId: HabitId, date: CheckInDate): Promise<CheckIn | null>
  deleteCheckIn(habitId: HabitId, date: CheckInDate): Promise<void>
  getAllCheckIns(): Promise<CheckIn[]>
}