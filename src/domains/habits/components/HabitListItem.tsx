import React from 'react'
import type { Habit } from '../types'

interface HabitListItemProps {
  habit: Habit
  onEdit: (habit: Habit) => void
  onDelete: (habitId: string) => void
}

export const HabitListItem: React.FC<HabitListItemProps> = ({ 
  habit, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="habit-item">
      <div className="habit-info">
        <h3 className="habit-name">{habit.name}</h3>
        <p className="habit-created">
          Created: {habit.createdAt.toLocaleDateString()}
        </p>
      </div>
      <div className="habit-actions">
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
  )
}