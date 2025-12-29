import React, { useState, useEffect } from 'react'
import { 
  requestPermission, 
  isNotificationSupported,
  setNotificationsEnabled 
} from '../business/notificationOperations'
import { notificationStorage } from '../data/notificationStorage'

export const NotificationSettings: React.FC = () => {
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [notificationsEnabled, setNotificationsEnabledState] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    checkPermissionStatus()
    loadNotificationSettings()
  }, [])

  const checkPermissionStatus = () => {
    if (isNotificationSupported()) {
      setPermissionGranted(Notification.permission === 'granted')
    }
  }

  const loadNotificationSettings = async () => {
    try {
      const schedule = await notificationStorage.getNotificationSchedule()
      setNotificationsEnabledState(schedule.isEnabled)
    } catch (error) {
      console.error('Failed to load notification settings:', error)
    }
  }

  const handleRequestPermission = async () => {
    setIsLoading(true)
    try {
      const granted = await requestPermission()
      setPermissionGranted(granted)
      
      if (!granted) {
        alert('Para recibir recordatorios motivacionales, por favor permite las notificaciones en tu navegador.')
      }
    } catch (error) {
      console.error('Failed to request permission:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleNotifications = async (enabled: boolean) => {
    try {
      await setNotificationsEnabled(enabled)
      setNotificationsEnabledState(enabled)
    } catch (error) {
      console.error('Failed to update notification settings:', error)
    }
  }

  if (!isNotificationSupported()) {
    return (
      <div className="notification-settings">
        <p className="notification-info">
          📱 Las notificaciones no están disponibles en este navegador
        </p>
      </div>
    )
  }

  return (
    <div className="notification-settings">
      <h3>🔔 Recordatorios Motivacionales</h3>
      
      {!permissionGranted ? (
        <div className="permission-request">
          <p>Recibe recordatorios diarios para mantener tus hábitos 💪</p>
          <button 
            onClick={handleRequestPermission}
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? 'Solicitando...' : 'Activar Notificaciones'}
          </button>
        </div>
      ) : (
        <div className="notification-controls">
          <div className="notification-toggle">
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleToggleNotifications(e.target.checked)}
                className="toggle-input"
              />
              <span className="toggle-slider"></span>
              <span className="toggle-text">
                {notificationsEnabled ? 'Activadas' : 'Desactivadas'}
              </span>
            </label>
          </div>
          
          <p className="notification-description">
            Te recordaremos si no registras actividad por más de 24 horas
          </p>
        </div>
      )}
    </div>
  )
}