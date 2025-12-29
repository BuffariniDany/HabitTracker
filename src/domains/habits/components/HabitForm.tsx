import React, { useState } from 'react'
import { validateHabitName } from '../business/habitOperations'
import type { Habit } from '../types'

interface HabitFormProps {
  habit?: Habit
  onSubmit: (name: string) => void
  onCancel: () => void
}

export const HabitForm: React.FC<HabitFormProps> = ({ 
  habit, 
  onSubmit, 
  onCancel 
}) => {
  const [name, setName] = useState(habit?.name || '')
  const [error, setError] = useState<string>('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const validation = validateHabitName(name)
    if (!validation.isValid) {
      setError(validation.error || 'Invalid habit name')
      return
    }
    
    setError('')
    onSubmit(name)
  }

  return (
    <form onSubmit={handleSubmit} className="habit-form">
      <div className="form-group">
        <label htmlFor="habit-name">Habit Name</label>
        <input
          id="habit-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter habit name..."
          className={error ? 'input-error' : ''}
        />
        {error && <p className="error-message">{error}</p>}
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {habit ? 'Update' : 'Create'} Habit
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  )
}