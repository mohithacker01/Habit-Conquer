import React, { useState } from 'react';
import './HabitList.css';

const HabitList = ({ habits, onAddHabit, onToggleHabit, onDeleteHabit }) => {
  const [newHabit, setNewHabit] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddHabit = (e) => {
    e.preventDefault();
    if (newHabit.trim()) {
      onAddHabit(newHabit.trim());
      setNewHabit('');
      setShowAddForm(false);
    }
  };

  const completedHabits = habits.filter(habit => habit.completed).length;
  const totalHabits = habits.length;
  const completionRate = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  return (
    <div className="habit-list card">
      <div className="habit-header">
        <h2><i className="fas fa-tasks"></i> Daily Habits</h2>
        <div className="habit-stats">
          <span className="completion-rate">{completionRate}% Complete</span>
          <span className="habit-count">{completedHabits}/{totalHabits}</span>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-clipboard-list"></i>
          <p>No habits yet. Add your first habit to get started!</p>
        </div>
      ) : (
        <div className="habits-container">
          {habits.map(habit => (
            <div 
              key={habit.id} 
              className={`habit-item ${habit.completed ? 'completed' : ''}`}
            >
              <div className="habit-content">
                <button
                  className="habit-checkbox"
                  onClick={() => onToggleHabit(habit.id)}
                >
                  <i className={`fas ${habit.completed ? 'fa-check' : 'fa-circle'}`}></i>
                </button>
                <span className="habit-name">{habit.name}</span>
              </div>
              <button
                className="delete-btn"
                onClick={() => onDeleteHabit(habit.id)}
                title="Delete habit"
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      {!showAddForm ? (
        <button 
          className="add-habit-btn"
          onClick={() => setShowAddForm(true)}
        >
          <i className="fas fa-plus"></i> Add New Habit
        </button>
      ) : (
        <form className="add-habit-form" onSubmit={handleAddHabit}>
          <input
            type="text"
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            placeholder="Enter habit name..."
            className="habit-input"
            autoFocus
          />
          <div className="form-buttons">
            <button type="submit" className="btn-save">
              <i className="fas fa-check"></i> Save
            </button>
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => {
                setShowAddForm(false);
                setNewHabit('');
              }}
            >
              <i className="fas fa-times"></i> Cancel
            </button>
          </div>
        </form>
      )}

      {habits.length > 0 && (
        <div className="motivation-section">
          {completionRate === 100 ? (
            <div className="success-message">
              <i className="fas fa-trophy"></i>
              <p>🎉 Perfect! You've completed all your habits today!</p>
            </div>
          ) : completionRate >= 75 ? (
            <div className="good-message">
              <i className="fas fa-star"></i>
              <p>🌟 Great job! You're doing amazing!</p>
            </div>
          ) : completionRate >= 50 ? (
            <div className="ok-message">
              <i className="fas fa-thumbs-up"></i>
              <p>👍 Good progress! Keep it up!</p>
            </div>
          ) : (
            <div className="encourage-message">
              <i className="fas fa-heart"></i>
              <p>💪 Every habit counts! You've got this!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HabitList;

