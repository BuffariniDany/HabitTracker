// Notifications Domain Types
export interface NotificationPermission {
  granted: boolean
  denied: boolean
  default: boolean
}

export interface NotificationSchedule {
  lastCheckInDate: string | null
  lastNotificationSent: string | null
  isEnabled: boolean
}

export interface NotificationConfig {
  title: string
  message: string
  icon?: string
  badge?: string
  tag: string
}

// Business Logic Interface
export interface NotificationOperations {
  requestPermission(): Promise<boolean>
  scheduleInactivityCheck(): void
  sendInactivityNotification(): Promise<void>
  checkShouldSendNotification(): Promise<boolean>
  updateLastCheckInTime(): Promise<void>
  isNotificationSupported(): boolean
}

// Data Layer Interface
export interface NotificationStorage {
  getNotificationSchedule(): Promise<NotificationSchedule>
  updateNotificationSchedule(schedule: Partial<NotificationSchedule>): Promise<void>
}