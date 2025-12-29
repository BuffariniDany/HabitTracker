import type { StreakData, StreakDay, HabitId } from '../types'
import type { CheckIn } from '../../check-ins/types'
import { checkInStorage } from '../../check-ins/data/checkInStorage'
import { calculateCurrentStreak, calculateLongestStreak, getTodayDate } from '../../check-ins/business/checkInOperations'

// Calculate complete streak data for a habit
export async function calculateStreakData(habitId: HabitId): Promise<StreakData> {
  const checkIns = await checkInStorage.getCheckInsForHabit(habitId)
  
  const currentStreak = calculateCurrentStreak(checkIns)
  const longestStreak = calculateLongestStreak(checkIns)
  
  // Find the most recent check-in date
  const sortedCheckIns = [...checkIns].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const lastCheckInDate = sortedCheckIns.length > 0 ? sortedCheckIns[0].date : null
  
  return {
    habitId,
    currentStreak,
    longestStreak,
    lastCheckInDate
  }
}

// Get streak history for the last N days
export async function getStreakHistory(habitId: HabitId, days: number): Promise<StreakDay[]> {
  const checkIns = await checkInStorage.getCheckInsForHabit(habitId)
  const checkInDates = new Set(checkIns.map(ci => ci.date))
  const today = getTodayDate()
  
  const history: StreakDay[] = []
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateString = date.toISOString().split('T')[0]
    
    history.push({
      date: dateString,
      isCheckedIn: checkInDates.has(dateString),
      isToday: dateString === today
    })
  }
  
  return history
}