import React from 'react'
import { HabitList } from '@domains/habits/components/HabitList'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Habit Tracker</h1>
        <p>Build better habits, one day at a time</p>
      </header>
      
      <main className="app-main">
        <HabitList />
      </main>
      
      <footer className="app-footer">
        <p>Offline-first PWA • Your data stays on your device</p>
      </footer>
    </div>
  )
}

export default App