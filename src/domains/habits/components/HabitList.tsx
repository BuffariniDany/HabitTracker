import React, { useState, useEffect } from 'react'
import { HabitListItem } from './HabitListItem'
import { HabitForm } from './HabitForm'
import { createHabit, updateHabitName, deleteHabit } from '../business/habitOperations'
import { habitStorage } from '../data/habitStorage'
import { checkInStorage } from '../../check-ins/data/checkInStorage'
import { createCheckIn, getTodayDate } from '../../check-ins/business/checkInOperations'
import { calculateStreakData } from '../../streaks/business/streakCalculations'
import type { Habit } from '../types'
import type { StreakData } from '../../streaks/types'

interface HabitWithProgress {
  habit: Habit
  streakData: StreakData
  isCheckedInToday: boolean
}

export const HabitList: React.FC = () => {
  const [habitsWithProgress, setHabitsWithProgress] = useState<HabitWithProgress[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null)
  const [loading, setLoading] = useState(true)

  // Load habits and their progress data
  useEffect(() => {
    loadHabitsWithProgress()
  }, [])

  const loadHabitsWithProgress = async () => {
    try {
      const allHabits = await habitStorage.getHabits()
      const activeHabits = allHabits.filter(h => h.isActive)
      const today = getTodayDate()
      
      const habitsWithProgressData = await Promise.all(
        activeHabits.map(async (habit) => {
          const streakData = await calculateStreakData(habit.id)
          const todayCheckIn = await checkInStorage.getCheckInByHabitAndDate(habit.id, today)
          
          return {
            habit,
            streakData,
            isCheckedInToday: !!todayCheckIn
          }
        })
      )
      
      setHabitsWithProgress(habitsWithProgressData)
    } catch (error) {
      console.error('Failed to load habits with progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateHabit = async (name: string) => {
    try {
      const newHabit = createHabit(name)
      await habitStorage.saveHabit(newHabit)
      
      // Add to list with initial progress data
      const initialStreakData: StreakData = {
        habitId: newHabit.id,
        currentStreak: 0,
        longestStreak: 0,
        lastCheckInDate: null
      }
      
      setHabitsWithProgress(prev => [...prev, {
        habit: newHabit,
        streakData: initialStreakData,
        isCheckedInToday: false
      }])
      
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
      
      setHabitsWithProgress(prev => prev.map(item => 
        item.habit.id === updatedHabit.id 
          ? { ...item, habit: updatedHabit }
          : item
      ))
      
      setEditingHabit(null)
    } catch (error) {
      console.error('Failed to update habit:', error)
      alert('Failed to update habit. Please try again.')
    }
  }

  const handleDeleteHabit = async (habitId: string) => {
    if (!confirm('Are you sure you want to delete this habit?')) return
    
    try {
      const habitItem = habitsWithProgress.find(item => item.habit.id === habitId)
      if (habitItem) {
        const deletedHabit = deleteHabit(habitItem.habit)
        await habitStorage.saveHabit(deletedHabit)
        setHabitsWithProgress(prev => prev.filter(item => item.habit.id !== habitId))
      }
    } catch (error) {
      console.error('Failed to delete habit:', error)
      alert('Failed to delete habit. Please try again.')
    }
  }

  const handleToggleCheckIn = async (habitId: string) => {
    try {
      const today = getTodayDate()
      const existingCheckIn = await checkInStorage.getCheckInByHabitAndDate(habitId, today)
      
      if (existingCheckIn) {
        // Remove check-in
        await checkInStorage.deleteCheckIn(habitId, today)
      } else {
        // Add check-in
        const newCheckIn = createCheckIn(habitId, today)
        await checkInStorage.saveCheckIn(newCheckIn)
      }
      
      // Refresh progress data for this habit
      const updatedStreakData = await calculateStreakData(habitId)
      const newCheckInStatus = !existingCheckIn
      
      setHabitsWithProgress(prev => prev.map(item => 
        item.habit.id === habitId
          ? { 
              ...item, 
              streakData: updatedStreakData,
              isCheckedInToday: newCheckInStatus
            }
          : item
      ))
      
    } catch (error) {
      console.error('Failed to toggle check-in:', error)
      alert('Failed to update check-in. Please try again.')
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

  // Separate completed and pending habits for better UX
  const completedToday = habitsWithProgress.filter(item => item.isCheckedInToday)
  const pendingToday = habitsWithProgress.filter(item => !item.isCheckedInToday)

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

      {habitsWithProgress.length === 0 ? (
        <div className="empty-state">
          <p>No habits yet. Create your first habit to get started!</p>
        </div>
      ) : (
        <div className="habit-sections">
          {pendingToday.length > 0 && (
            <div className="habit-section">
              <h3 className="section-title">📋 Today's Goals</h3>
              <div className="habit-list">
                {pendingToday.map(item => (
                  <HabitListItem
                    key={item.habit.id}
                    habit={item.habit}
                    streakData={item.streakData}
                    isCheckedInToday={item.isCheckedInToday}
                    onEdit={handleEditHabit}
                    onDelete={handleDeleteHabit}
                    onToggleCheckIn={handleToggleCheckIn}
                  />
                ))}
              </div>
            </div>
          )}
          
          {completedToday.length > 0 && (
            <div className="habit-section">
              <h3 className="section-title">✅ Completed Today</h3>
              <div className="habit-list">
                {completedToday.map(item => (
                  <HabitListItem
                    key={item.habit.id}
                    habit={item.habit}
                    streakData={item.streakData}
                    isCheckedInToday={item.isCheckedInToday}
                    onEdit={handleEditHabit}
                    onDelete={handleDeleteHabit}
                    onToggleCheckIn={handleToggleCheckIn}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}