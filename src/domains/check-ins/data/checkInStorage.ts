import type { CheckIn, CheckInDate, HabitId, CheckInStorage } from '../types'

// Simple localStorage-based storage for check-ins
// Will be upgraded to IndexedDB in later tasks
class LocalStorageCheckInStorage implements CheckInStorage {
  private readonly STORAGE_KEY = 'habit-tracker-checkins'

  async saveCheckIn(checkIn: CheckIn): Promise<void> {
    const checkIns = await this.getAllCheckIns()
    
    // Remove existing check-in for same habit and date (prevent duplicates)
    const filtered = checkIns.filter(ci => 
      !(ci.habitId === checkIn.habitId && ci.date === checkIn.date)
    )
    
    filtered.push(checkIn)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered))
  }

  async getAllCheckIns(): Promise<CheckIn[]> {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (!stored) return []
    
    try {
      const checkIns = JSON.parse(stored)
      // Convert date strings back to Date objects
      return checkIns.map((checkIn: any) => ({
        ...checkIn,
        createdAt: new Date(checkIn.createdAt)
      }))
    } catch {
      return []
    }
  }

  async getCheckInsForHabit(habitId: HabitId): Promise<CheckIn[]> {
    const allCheckIns = await this.getAllCheckIns()
    return allCheckIns.filter(ci => ci.habitId === habitId)
  }

  async getCheckInByHabitAndDate(habitId: HabitId, date: CheckInDate): Promise<CheckIn | null> {
    const checkIns = await this.getCheckInsForHabit(habitId)
    return checkIns.find(ci => ci.date === date) || null
  }

  async deleteCheckIn(habitId: HabitId, date: CheckInDate): Promise<void> {
    const allCheckIns = await this.getAllCheckIns()
    const filtered = allCheckIns.filter(ci => 
      !(ci.habitId === habitId && ci.date === date)
    )
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered))
  }
}

export const checkInStorage = new LocalStorageCheckInStorage()