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
        <p>Si estas buscando una comunidad únete a <a href="https://www.linkedin.com/company/aws-wic-buenos-aires/" target="_blank" rel="noopener noreferrer">AWS Women In Cloud Buenos Aires</a>, donde aprendemos, compartimos y crecemos juntas en AWS mediante meetups y workshops. ¡Unite y despeguemos junt@s!</p>
      </footer>
    </div>
  )
}

export default App