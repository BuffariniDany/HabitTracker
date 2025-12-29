import type { NotificationSchedule, NotificationStorage } from '../types'

// Simple localStorage-based storage for notification settings
class LocalStorageNotificationStorage implements NotificationStorage {
  private readonly STORAGE_KEY = 'habit-tracker-notifications'

  async getNotificationSchedule(): Promise<NotificationSchedule> {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    
    if (!stored) {
      // Default schedule
      return {
        lastCheckInDate: null,
        lastNotificationSent: null,
        isEnabled: true // Enable by default, user can disable
      }
    }
    
    try {
      return JSON.parse(stored)
    } catch {
      // Return default if parsing fails
      return {
        lastCheckInDate: null,
        lastNotificationSent: null,
        isEnabled: true
      }
    }
  }

  async updateNotificationSchedule(updates: Partial<NotificationSchedule>): Promise<void> {
    const current = await this.getNotificationSchedule()
    const updated = { ...current, ...updates }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated))
  }
}

export const notificationStorage = new LocalStorageNotificationStorage()