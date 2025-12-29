import type { CheckIn, CheckInId, CheckInDate, HabitId } from '../types'

// Generate unique ID for check-ins
function generateCheckInId(): CheckInId {
  return `checkin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Get today's date in YYYY-MM-DD format
export function getTodayDate(): CheckInDate {
  return new Date().toISOString().split('T')[0]
}

// Check if a date is valid for check-ins (not future, not older than 7 days)
export function canCheckInForDate(date: CheckInDate): boolean {
  const checkInDate = new Date(date)
  const today = new Date()
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 7)
  
  // Reset time to start of day for accurate comparison
  today.setHours(23, 59, 59, 999)
  sevenDaysAgo.setHours(0, 0, 0, 0)
  checkInDate.setHours(12, 0, 0, 0) // Set to noon to avoid timezone issues
  
  return checkInDate >= sevenDaysAgo && checkInDate <= today
}

// Create a new check-in
export function createCheckIn(habitId: HabitId, date: CheckInDate): CheckIn {
  if (!canCheckInForDate(date)) {
    throw new Error('Cannot check in for this date. Check-ins are only allowed for today and up to 7 days back.')
  }
  
  const now = new Date()
  return {
    id: generateCheckInId(),
    habitId,
    date,
    createdAt: now,
    synced: false
  }
}

// Calculate current streak from check-ins
export function calculateCurrentStreak(checkIns: CheckIn[]): number {
  if (checkIns.length === 0) return 0
  
  // Sort check-ins by date (most recent first)
  const sortedCheckIns = [...checkIns].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  const today = getTodayDate()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayDate = yesterday.toISOString().split('T')[0]
  
  let streak = 0
  let currentDate = today
  
  // Check if there's a check-in for today or yesterday to start the streak
  const hasToday = sortedCheckIns.some(ci => ci.date === today)
  const hasYesterday = sortedCheckIns.some(ci => ci.date === yesterdayDate)
  
  if (!hasToday && !hasYesterday) {
    return 0 // No recent activity
  }
  
  // Start from today if checked in today, otherwise from yesterday
  if (!hasToday) {
    currentDate = yesterdayDate
  }
  
  // Count consecutive days backwards
  for (const checkIn of sortedCheckIns) {
    if (checkIn.date === currentDate) {
      streak++
      // Move to previous day
      const prevDay = new Date(currentDate)
      prevDay.setDate(prevDay.getDate() - 1)
      currentDate = prevDay.toISOString().split('T')[0]
    } else if (checkIn.date < currentDate) {
      // Gap found, streak ends
      break
    }
  }
  
  return streak
}

// Calculate longest streak from check-ins
export function calculateLongestStreak(checkIns: CheckIn[]): number {
  if (checkIns.length === 0) return 0
  
  // Sort check-ins by date
  const sortedCheckIns = [...checkIns].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  
  let longestStreak = 0
  let currentStreak = 0
  let lastDate: Date | null = null
  
  for (const checkIn of sortedCheckIns) {
    const checkInDate = new Date(checkIn.date)
    
    if (lastDate === null) {
      // First check-in
      currentStreak = 1
    } else {
      const daysDiff = Math.floor((checkInDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === 1) {
        // Consecutive day
        currentStreak++
      } else {
        // Gap found, reset streak
        currentStreak = 1
      }
    }
    
    longestStreak = Math.max(longestStreak, currentStreak)
    lastDate = checkInDate
  }
  
  return longestStreak
}