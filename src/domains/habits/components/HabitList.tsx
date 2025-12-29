import React, { useState, useEffect } from 'react'
import { HabitListItem } from './HabitListItem'
import { HabitForm } from './HabitForm'
import { createHabit, updateHabitName, deleteHabit } from '../business/habitOperations'
import { habitStorage } from '../data/habitStorage'
import type { Habit } from '../types'

export const HabitList: React.FC = () => {
  const [habits, setHabits] = useState<Habit[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [loading, setLoading] = useState(true)

  // Load habits on component mount
  useEffect(() => {
    loadHabits()
  }, [])

  const loadHabits = async () => {
    try {
      const allHabits = await habitStorage.getHabits()
      // Only show active habits
      setHabits(allHabits.filter(h => h.isActive))
    } catch (error) {
      console.error('Failed to load habits:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateHabit = async (name: string) => {
    try {
      const newHabit = createHabit(name)
      await habitStorage.saveHabit(newHabit)
      setHabits(prev => [...prev, newHabit])
      setShowForm(false)
    } catch (error) {
      console.error('Failed to create habit:', error)
      alert('Failed to create habit. Please try again.')
    }
  }

  const handleUpdateHabit = async (name: string) => {
    if (!editingHabit) return
    
    try {
      const updatedHabit = updateHabitName(editingHabit, name)
      await habitStorage.saveHabit(updatedHabit)
      setHabits(prev => prev.map(h => h.id === updatedHabit.id ? updatedHabit : h))
      setEditingHabit(null)
    } catch (error) {
      console.error('Failed to update habit:', error)
      alert('Failed to update habit. Please try again.')
    }
  }

  const handleDeleteHabit = async (habitId: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) return
    
    try {
      const habit = habits.find(h => h.id === habitId)
      if (habit) {
        const deletedHabit = deleteHabit(habit)
        await habitStorage.saveHabit(deletedHabit)
        setHabits(prev => prev.filter(h => h.id !== habitId))
      }
    } catch (error) {
      console.error('Failed to delete habit:', error)
      alert('Failed to delete habit. Please try again.')
    }
  }

  const handleEditHabit = (habit: Habit) => {
    setEditingHabit(habit)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingHabit(null)
  }

  if (loading) {
    return <div className="loading">Loading habits...</div>
  }

  return (
    <div className="habit-list-container">
      <div className="habit-list-header">
        <h2>My Habits</h2>
        {!showForm && !editingHabit && (
          <button 
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Add New Habit
          </button>
        )}
      </div>

      {(showForm || editingHabit) && (
        <div className="habit-form-container">
          <HabitForm
            habit={editingHabit || undefined}
            onSubmit={editingHabit ? handleUpdateHabit : handleCreateHabit}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      <div className="habit-list">
        {habits.length === 0 ? (
          <div className="empty-state">
            <p>No habits yet. Create your first habit to get started!</p>
          </div>
        ) : (
          habits.map(habit => (
            <HabitListItem
              key={habit.id}
              habit={habit}
              onEdit={handleEditHabit}
              onDelete={handleDeleteHabit}
            />
          ))
        )}
      </div>
    </div>
  )
}