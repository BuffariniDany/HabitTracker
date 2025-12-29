import React from 'react'
import type { Habit } from '../types'
import type { StreakData } from '../../streaks/types'
import { CheckInButton } from '../../check-ins/components/CheckInButton'
import { StreakDisplay } from '../../streaks/components/StreakDisplay'

interface HabitListItemProps {
  habit: Habit
  streakData: StreakData
  isCheckedInToday: boolean
  onEdit: (habit: Habit) => void
  onDelete: (habitId: string) => void
  onToggleCheckIn: (habitId: string) => Promise<void>
}

export const HabitListItem: React.FC<HabitListItemProps> = ({ 
  habit, 
  streakData,
  isCheckedInToday,
  onEdit, 
  onDelete,
  onToggleCheckIn
}) => {
  return (
    <div className={`habit-item ${isCheckedInToday ? 'completed-today' : ''}`}>
      <div className="habit-main-content">
        <div className="habit-info">
          <h3 className="habit-name">{habit.name}</h3>
          <p className="habit-created">
            Created: {habit.createdAt.toLocaleDateString()}
          </p>
        </div>
        
        <div className="habit-progress">
          <StreakDisplay streakData={streakData} compact />
        </div>
      </div>
      
      <div className="habit-actions">
        <CheckInButton
          habitId={habit.id}
          isCheckedIn={isCheckedInToday}
          onToggle={onToggleCheckIn}
        />
        
        <div className="habit-management">
          <button 
            onClick={() => onEdit(habit)}
            className="btn btn-edit"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(habit.id)}
            className="btn btn-delete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}