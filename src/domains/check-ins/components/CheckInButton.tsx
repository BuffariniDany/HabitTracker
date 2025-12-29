import { useState } from 'react'
import type { HabitId } from '../types'

interface CheckInButtonProps {
  habitId: HabitId
  isCheckedIn: boolean
  onToggle: (habitId: HabitId) => Promise<void>
  disabled?: boolean
}

export const CheckInButton: React.FC<CheckInButtonProps> = ({ 
  habitId, 
  isCheckedIn, 
  onToggle, 
  disabled = false 
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (disabled || isLoading) return
    
    setIsLoading(true)
    try {
      await onToggle(habitId)
    } catch (error) {
      console.error('Failed to toggle check-in:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`check-in-btn ${isCheckedIn ? 'checked-in' : 'not-checked-in'} ${isLoading ? 'loading' : ''}`}
      aria-label={isCheckedIn ? 'Mark as not done today' : 'Mark as done today'}
    >
      <span className="check-in-icon">
        {isLoading ? '⏳' : isCheckedIn ? '✅' : '⭕'}
      </span>
      <span className="check-in-text">
        {isLoading ? 'Saving...' : isCheckedIn ? 'Done!' : 'Do it!'}
      </span>
    </button>
  )
}