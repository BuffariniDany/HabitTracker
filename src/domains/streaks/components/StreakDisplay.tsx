import type { StreakData } from '../types'

interface StreakDisplayProps {
  streakData: StreakData
  compact?: boolean
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ 
  streakData, 
  compact = false 
}) => {
  const { currentStreak, longestStreak } = streakData

  if (compact) {
    return (
      <div className="streak-display compact">
        <span className="current-streak">
          🔥 {currentStreak}
        </span>
      </div>
    )
  }

  return (
    <div className="streak-display">
      <div className="streak-item current">
        <span className="streak-icon">🔥</span>
        <div className="streak-info">
          <span className="streak-number">{currentStreak}</span>
          <span className="streak-label">Current</span>
        </div>
      </div>
      
      {longestStreak > 0 && (
        <div className="streak-item longest">
          <span className="streak-icon">🏆</span>
          <div className="streak-info">
            <span className="streak-number">{longestStreak}</span>
            <span className="streak-label">Best</span>
          </div>
        </div>
      )}
    </div>
  )
}