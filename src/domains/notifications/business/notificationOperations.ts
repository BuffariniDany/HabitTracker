import type { NotificationConfig } from '../types'
import { notificationStorage } from '../data/notificationStorage'
import { checkInStorage } from '../../check-ins/data/checkInStorage'
import { getTodayDate } from '../../check-ins/business/checkInOperations'

// Check if notifications are supported in this browser
export function isNotificationSupported(): boolean {
  return 'Notification' in window && 'serviceWorker' in navigator
}

// Request notification permission from user
export async function requestPermission(): Promise<boolean> {
  if (!isNotificationSupported()) {
    return false
  }

  try {
    const permission = await Notification.requestPermission()
    return permission === 'granted'
  } catch (error) {
    console.error('Failed to request notification permission:', error)
    return false
  }
}

// Check if we should send an inactivity notification
export async function checkShouldSendNotification(): Promise<boolean> {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return false
  }

  const schedule = await notificationStorage.getNotificationSchedule()
  
  if (!schedule.isEnabled) {
    return false
  }

  const today = getTodayDate()
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayDate = yesterday.toISOString().split('T')[0]

  // Get all check-ins from the last 24 hours
  const allCheckIns = await checkInStorage.getAllCheckIns()
  const recentCheckIns = allCheckIns.filter(checkIn => {
    const checkInDate = checkIn.date
    return checkInDate === today || checkInDate === yesterdayDate
  })

  // If there are recent check-ins, no notification needed
  if (recentCheckIns.length > 0) {
    return false
  }

  // Check if we already sent a notification today
  if (schedule.lastNotificationSent === today) {
    return false
  }

  // Check if it's been more than 24 hours since last check-in
  const lastCheckInDate = schedule.lastCheckInDate
  if (!lastCheckInDate) {
    // No previous check-ins, send notification after 24 hours of app usage
    return true
  }

  const lastCheckIn = new Date(lastCheckInDate)
  const hoursSinceLastCheckIn = (now.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60)
  
  return hoursSinceLastCheckIn >= 24
}

// Send the inactivity notification
export async function sendInactivityNotification(): Promise<void> {
  if (!isNotificationSupported() || Notification.permission !== 'granted') {
    return
  }

  const config: NotificationConfig = {
    title: 'Habit Tracker 💪',
    message: 'Hoy no registraste dedicar un tiempo para tu meta, estas a tiempo 💪',
    icon: '/HabitTracker/vite.svg',
    tag: 'inactivity-reminder'
  }

  try {
    // Use service worker to show notification if available
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.ready
      await registration.showNotification(config.title, {
        body: config.message,
        icon: config.icon,
        badge: config.icon,
        tag: config.tag,
        requireInteraction: false,
        silent: false,
        data: {
          url: '/HabitTracker/',
          action: 'open-app'
        }
      })
    } else {
      // Fallback to regular notification
      new Notification(config.title, {
        body: config.message,
        icon: config.icon,
        tag: config.tag
      })
    }

    // Update last notification sent time
    const today = getTodayDate()
    await notificationStorage.updateNotificationSchedule({
      lastNotificationSent: today
    })

    console.log('Inactivity notification sent successfully')
  } catch (error) {
    console.error('Failed to send notification:', error)
  }
}

// Update the last check-in time for notification scheduling
export async function updateLastCheckInTime(): Promise<void> {
  const today = getTodayDate()
  await notificationStorage.updateNotificationSchedule({
    lastCheckInDate: today
  })
}

// Schedule periodic checks for inactivity (every hour)
export function scheduleInactivityCheck(): void {
  // Check every hour if we should send a notification
  setInterval(async () => {
    try {
      const shouldSend = await checkShouldSendNotification()
      if (shouldSend) {
        await sendInactivityNotification()
      }
    } catch (error) {
      console.error('Error in inactivity check:', error)
    }
  }, 60 * 60 * 1000) // Check every hour

  // Also check when the page becomes visible (user returns to app)
  document.addEventListener('visibilitychange', async () => {
    if (!document.hidden) {
      try {
        const shouldSend = await checkShouldSendNotification()
        if (shouldSend) {
          await sendInactivityNotification()
        }
      } catch (error) {
        console.error('Error in visibility change check:', error)
      }
    }
  })
}

// Enable or disable notifications
export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
  await notificationStorage.updateNotificationSchedule({
    isEnabled: enabled
  })
}