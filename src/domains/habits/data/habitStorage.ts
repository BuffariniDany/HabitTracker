import type { Habit, HabitId, HabitStorage } from '../types'

// Simple localStorage-based storage for initial version
// Will be upgraded to IndexedDB in later tasks
class LocalStorageHabitStorage implements HabitStorage {
  private readonly STORAGE_KEY = 'habit-tracker-habits'

  async saveHabit(habit: Habit): Promise<void> {
    const habits = await this.getHabits()
    const existingIndex = habits.findIndex(h => h.id === habit.id)
    
    if (existingIndex >= 0) {
      habits[existingIndex] = habit
    } else {
      habits.push(habit)
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(habits))
  }

  async getHabits(): Promise<Habit[]> {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (!stored) return []
    
    try {
      const habits = JSON.parse(stored)
      // Convert date strings back to Date objects
      return habits.map((habit: any) => ({
        ...habit,
        createdAt: new Date(habit.createdAt),
        updatedAt: new Date(habit.updatedAt)
      }))
    } catch {
      return []
    }
  }

  async getHabitById(id: HabitId): Promise<Habit | null> {
    const habits = await this.getHabits()
    return habits.find(h => h.id === id) || null
  }

  async deleteHabit(id: HabitId): Promise<void> {
    const habits = await this.getHabits()
    const filtered = habits.filter(h => h.id !== id)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered))
  }
}

export const habitStorage = new LocalStorageHabitStorage()