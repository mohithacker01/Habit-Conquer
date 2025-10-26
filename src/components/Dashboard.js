import React, { useState } from 'react';
import './Dashboard.css';

const Dashboard = ({ habits, steps, stepGoal, onToggleHabit, onAddSteps, onResetSteps, onUpdateMood, moodData }) => {
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const currentMood = moodData[today];

  const percentage = Math.min((steps / stepGoal) * 100, 100);
  const completedHabits = habits.filter(habit => habit.completed).length;
  const totalHabits = habits.length;
  const habitCompletionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  const handleMoodSelect = (mood) => {
    onUpdateMood(today, mood);
    setShowMoodSelector(false);
  };

  const getMotivationMessage = () => {
    if (completedHabits === totalHabits && steps >= stepGoal) {
      return "🎉 Perfect day! You've completed everything!";
    } else if (completedHabits === totalHabits) {
      return "Habits are the compound interest of self-improvement.";
    } else if (steps >= stepGoal) {
      return "🚶‍♂️ Great steps! Now complete your habits!";
    } else if (completedHabits > 0 || steps > 0) {
      return "💪 Good start! Keep building momentum!";
    } else {
      return "👋 Ready to start your day? Let's build some great habits!";
    }
  };

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      'excellent': '😄',
      'good': '😊',
      'okay': '😐',
      'bad': '😔',
      'terrible': '😢'
    };
    return moodEmojis[mood] || '😐';
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2><i className="fas fa-home"></i> Today's Dashboard</h2>
        <span className="date">{new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}</span>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-walking"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{steps.toLocaleString()}</div>
            <div className="stat-label">Steps</div>
            <div className="stat-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <span className="progress-text">{Math.round(percentage)}%</span>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{completedHabits}/{totalHabits}</div>
            <div className="stat-label">Habits</div>
            <div className="stat-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${habitCompletionRate}%` }}
                ></div>
              </div>
              <span className="progress-text">{habitCompletionRate}%</span>
            </div>
          </div>
        </div>

        <div className="stat-card mood-card">
          <div className="stat-icon">
            <i className="fas fa-heart"></i>
          </div>
          <div className="stat-content">
            <div className="mood-display">
              {currentMood ? (
                <div className="current-mood">
                  <span className="mood-emoji">{getMoodEmoji(currentMood)}</span>
                  <span className="mood-text">{currentMood}</span>
                </div>
              ) : (
                <div className="no-mood">No mood set</div>
              )}
            </div>
            <button 
              className="mood-btn"
              onClick={() => setShowMoodSelector(!showMoodSelector)}
            >
              {currentMood ? 'Change Mood' : 'Set Mood'}
            </button>
          </div>
        </div>
      </div>

      {/* Mood Selector */}
      {showMoodSelector && (
        <div className="mood-selector">
          <h3>How are you feeling today?</h3>
          <div className="mood-options">
            {[
              { value: 'excellent', emoji: '😄', label: 'Excellent' },
              { value: 'good', emoji: '😊', label: 'Good' },
              { value: 'okay', emoji: '😐', label: 'Okay' },
              { value: 'bad', emoji: '😔', label: 'Bad' },
              { value: 'terrible', emoji: '😢', label: 'Terrible' }
            ].map(mood => (
              <button
                key={mood.value}
                className={`mood-option ${currentMood === mood.value ? 'selected' : ''}`}
                onClick={() => handleMoodSelect(mood.value)}
              >
                <span className="mood-emoji-large">{mood.emoji}</span>
                <span className="mood-label">{mood.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Today's Habits */}
      <div className="today-habits">
        <h3><i className="fas fa-list-check"></i> Today's Habits</h3>
        {habits.length === 0 ? (
          <div className="empty-habits">
            <i className="fas fa-clipboard-list"></i>
            <p>No habits set up yet. Go to the Habits tab to add some!</p>
          </div>
        ) : (
          <div className="habits-list">
            {habits.map(habit => (
              <div 
                key={habit.id} 
                className={`habit-item ${habit.completed ? 'completed' : ''}`}
              >
                <button
                  className="habit-checkbox"
                  onClick={() => onToggleHabit(habit.id)}
                >
                  <i className={`fas ${habit.completed ? 'fa-check' : 'fa-circle'}`}></i>
                </button>
                <span className="habit-name">{habit.name}</span>
                <div className="habit-status">
                  {habit.completed ? (
                    <span className="status-completed">✅ Done</span>
                  ) : (
                    <span className="status-pending">⏳ Pending</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3><i className="fas fa-bolt"></i> Quick Actions</h3>
        <div className="action-buttons">
          <button 
            className="action-btn primary"
            onClick={() => onAddSteps(1000)}
          >
            <i className="fas fa-plus"></i> +1K Steps
          </button>
          <button 
            className="action-btn secondary"
            onClick={() => onAddSteps(2000)}
          >
            <i className="fas fa-plus"></i> +2K Steps
          </button>
          <button 
            className="action-btn reset"
            onClick={onResetSteps}
          >
            <i className="fas fa-refresh"></i> Reset Steps
          </button>
        </div>
      </div>

      {/* Motivation */}
      <div className="motivation-section">
        <div className="motivation-content">
          <i className="fas fa-lightbulb"></i>
          <p>{getMotivationMessage()}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
