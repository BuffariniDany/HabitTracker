// Streaks Domain Types
export type HabitId = string // Re-export from habits domain
export type CheckInDate = string // Re-export from check-ins domain

export interface StreakData {
  habitId: HabitId
  currentStreak: number
  longestStreak: number
  lastCheckInDate: CheckInDate | null
}

export interface StreakDay {
  date: CheckInDate
  isCheckedIn: boolean
  isToday: boolean
}

// Business Logic Interface
export interface StreakCalculations {
  calculateStreakData(habitId: HabitId): Promise<StreakData>
  getStreakHistory(habitId: HabitId, days: number): Promise<StreakDay[]>
}