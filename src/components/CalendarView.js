import React, { useState } from 'react';
import './CalendarView.css';

const CalendarView = ({ habits, dailyData, moodData }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getDateString = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getDayStatus = (date) => {
    const dateString = getDateString(date);
    const dayData = dailyData[dateString];
    const mood = moodData[dateString];
    
    if (!dayData) return 'no-data';
    
    const { habitsCompleted = 0, totalHabits = 0, steps = 0 } = dayData;
    const habitRate = totalHabits > 0 ? (habitsCompleted / totalHabits) : 0;
    const stepGoal = 5000;
    const stepRate = steps / stepGoal;
    
    if (habitRate >= 1 && stepRate >= 1) return 'perfect';
    if (habitRate >= 0.8 && stepRate >= 0.8) return 'excellent';
    if (habitRate >= 0.6 || stepRate >= 0.6) return 'good';
    if (habitRate > 0 || stepRate > 0) return 'partial';
    return 'missed';
  };

  const getStatusColor = (status) => {
    const colors = {
      'perfect': '#4CAF50',
      'excellent': '#8BC34A',
      'good': '#FFC107',
      'partial': '#FF9800',
      'missed': '#F44336',
      'no-data': '#E0E0E0'
    };
    return colors[status] || '#E0E0E0';
  };

  const getStatusEmoji = (status) => {
    const emojis = {
      'perfect': '🏆',
      'excellent': '🌟',
      'good': '👍',
      'partial': '⚠️',
      'missed': '❌',
      'no-data': '⚪'
    };
    return emojis[status] || '⚪';
  };

  const getStreakInfo = () => {
    const today = new Date();
    const dates = Object.keys(dailyData).sort().reverse();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      const status = getDayStatus(date);
      
      if (status === 'perfect' || status === 'excellent') {
        if (i === 0) currentStreak++;
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return { currentStreak, longestStreak };
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const { currentStreak, longestStreak } = getStreakInfo();

  const selectedDateData = selectedDate ? dailyData[getDateString(selectedDate)] : null;
  const selectedDateMood = selectedDate ? moodData[getDateString(selectedDate)] : null;

  return (
    <div className="calendar-view">
      <div className="calendar-header">
        <h2><i className="fas fa-calendar"></i> Progress Calendar</h2>
        <div className="streak-info">
          <div className="streak-item">
            <span className="streak-number">{currentStreak}</span>
            <span className="streak-label">Current Streak</span>
          </div>
          <div className="streak-item">
            <span className="streak-number">{longestStreak}</span>
            <span className="streak-label">Best Streak</span>
          </div>
        </div>
      </div>

      <div className="calendar-container">
        <div className="calendar-nav">
          <button 
            className="nav-btn"
            onClick={() => navigateMonth(-1)}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <h3 className="month-year">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <button 
            className="nav-btn"
            onClick={() => navigateMonth(1)}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>

        <div className="calendar-grid">
          <div className="day-headers">
            {dayNames.map(day => (
              <div key={day} className="day-header">{day}</div>
            ))}
          </div>
          
          <div className="calendar-days">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="empty-day"></div>;
              }
              
              const status = getDayStatus(day);
              const isToday = day.toDateString() === new Date().toDateString();
              const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
              
              return (
                <div
                  key={index}
                  className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
                  style={{ backgroundColor: getStatusColor(status) }}
                  onClick={() => setSelectedDate(day)}
                >
                  <span className="day-number">{day.getDate()}</span>
                  <span className="day-status">{getStatusEmoji(status)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <h4>Legend</h4>
        <div className="legend-items">
          {[
            { status: 'perfect', label: 'Perfect Day', emoji: '🏆' },
            { status: 'excellent', label: 'Excellent', emoji: '🌟' },
            { status: 'good', label: 'Good', emoji: '👍' },
            { status: 'partial', label: 'Partial', emoji: '⚠️' },
            { status: 'missed', label: 'Missed', emoji: '❌' },
            { status: 'no-data', label: 'No Data', emoji: '⚪' }
          ].map(item => (
            <div key={item.status} className="legend-item">
              <div 
                className="legend-color" 
                style={{ backgroundColor: getStatusColor(item.status) }}
              ></div>
              <span className="legend-emoji">{item.emoji}</span>
              <span className="legend-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="date-details">
          <h3>
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </h3>
          
          {selectedDateData ? (
            <div className="date-stats">
              <div className="stat-item">
                <i className="fas fa-tasks"></i>
                <div>
                  <div className="stat-number">{selectedDateData.habitsCompleted || 0}</div>
                  <div className="stat-label">Habits Completed</div>
                </div>
              </div>
              
              <div className="stat-item">
                <i className="fas fa-walking"></i>
                <div>
                  <div className="stat-number">{(selectedDateData.steps || 0).toLocaleString()}</div>
                  <div className="stat-label">Steps</div>
                </div>
              </div>
              
              {selectedDateMood && (
                <div className="stat-item">
                  <i className="fas fa-heart"></i>
                  <div>
                    <div className="stat-number">{selectedDateMood}</div>
                    <div className="stat-label">Mood</div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="no-data">
              <i className="fas fa-calendar-times"></i>
              <p>No data for this day</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CalendarView;

