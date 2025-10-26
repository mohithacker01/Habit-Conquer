import React, { useState } from 'react';
import './Analytics.css';

const Analytics = ({ habits, dailyData, moodData, stepGoal }) => {
  const [timeRange, setTimeRange] = useState('week');

  const getDateRange = (range) => {
    const today = new Date();
    const dates = [];
    
    switch (range) {
      case 'week':
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          dates.push(date.toISOString().split('T')[0]);
        }
        break;
      case 'month':
        for (let i = 29; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(today.getDate() - i);
          dates.push(date.toISOString().split('T')[0]);
        }
        break;
      default:
        break;
    }
    
    return dates;
  };

  const calculateStats = () => {
    const dates = getDateRange(timeRange);
    const stats = {
      totalDays: dates.length,
      daysWithData: 0,
      totalHabitsCompleted: 0,
      totalSteps: 0,
      perfectDays: 0,
      averageHabitsPerDay: 0,
      averageStepsPerDay: 0,
      habitCompletionRate: 0,
      stepCompletionRate: 0
    };

    dates.forEach(date => {
      const dayData = dailyData[date];
      if (dayData) {
        stats.daysWithData++;
        stats.totalHabitsCompleted += dayData.habitsCompleted || 0;
        stats.totalSteps += dayData.steps || 0;
        
        const habitRate = dayData.totalHabits > 0 ? (dayData.habitsCompleted / dayData.totalHabits) : 0;
        const stepRate = (dayData.steps || 0) / stepGoal;
        
        if (habitRate >= 1 && stepRate >= 1) {
          stats.perfectDays++;
        }
      }
    });

    if (stats.daysWithData > 0) {
      stats.averageHabitsPerDay = Math.round(stats.totalHabitsCompleted / stats.daysWithData);
      stats.averageStepsPerDay = Math.round(stats.totalSteps / stats.daysWithData);
      stats.habitCompletionRate = Math.round((stats.totalHabitsCompleted / (stats.daysWithData * habits.length)) * 100);
      stats.stepCompletionRate = Math.round((stats.totalSteps / (stats.daysWithData * stepGoal)) * 100);
    }

    return stats;
  };

  const getMoodCorrelation = () => {
    const dates = getDateRange(timeRange);
    const moodStats = {
      excellent: { count: 0, avgHabits: 0, avgSteps: 0, totalHabits: 0, totalSteps: 0 },
      good: { count: 0, avgHabits: 0, avgSteps: 0, totalHabits: 0, totalSteps: 0 },
      okay: { count: 0, avgHabits: 0, avgSteps: 0, totalHabits: 0, totalSteps: 0 },
      bad: { count: 0, avgHabits: 0, avgSteps: 0, totalHabits: 0, totalSteps: 0 },
      terrible: { count: 0, avgHabits: 0, avgSteps: 0, totalHabits: 0, totalSteps: 0 }
    };

    dates.forEach(date => {
      const mood = moodData[date];
      const dayData = dailyData[date];
      
      if (mood && dayData) {
        moodStats[mood].count++;
        moodStats[mood].totalHabits += dayData.habitsCompleted || 0;
        moodStats[mood].totalSteps += dayData.steps || 0;
      }
    });

    // Calculate averages
    Object.keys(moodStats).forEach(mood => {
      if (moodStats[mood].count > 0) {
        moodStats[mood].avgHabits = Math.round(moodStats[mood].totalHabits / moodStats[mood].count);
        moodStats[mood].avgSteps = Math.round(moodStats[mood].totalSteps / moodStats[mood].count);
      }
    });

    return moodStats;
  };

  const getWeeklyTrend = () => {
    const dates = getDateRange('week');
    return dates.map(date => {
      const dayData = dailyData[date];
      const mood = moodData[date];
      return {
        date,
        habits: dayData?.habitsCompleted || 0,
        steps: dayData?.steps || 0,
        mood,
        dayName: new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
      };
    });
  };

  const getTopPerformingDays = () => {
    const dates = Object.keys(dailyData).sort().slice(-7); // Last 7 days
    return dates
      .map(date => {
        const dayData = dailyData[date];
        const habitScore = dayData?.habitsCompleted || 0;
        const stepScore = (dayData?.steps || 0) / stepGoal;
        const totalScore = habitScore + stepScore;
        
        return {
          date,
          score: totalScore,
          habits: dayData?.habitsCompleted || 0,
          steps: dayData?.steps || 0,
          dayName: new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  const stats = calculateStats();
  const moodCorrelation = getMoodCorrelation();
  const weeklyTrend = getWeeklyTrend();
  const topDays = getTopPerformingDays();

  const getMoodEmoji = (mood) => {
    const emojis = {
      'excellent': '😄',
      'good': '😊',
      'okay': '😐',
      'bad': '😔',
      'terrible': '😢'
    };
    return emojis[mood] || '😐';
  };

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2><i className="fas fa-chart-bar"></i> Analytics</h2>
        <div className="time-range-selector">
          <button 
            className={`range-btn ${timeRange === 'week' ? 'active' : ''}`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={`range-btn ${timeRange === 'month' ? 'active' : ''}`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="overview-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.perfectDays}</div>
            <div className="stat-label">Perfect Days</div>
            <div className="stat-subtitle">out of {stats.totalDays}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.averageHabitsPerDay}</div>
            <div className="stat-label">Avg Habits/Day</div>
            <div className="stat-subtitle">{stats.habitCompletionRate}% completion</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-walking"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{stats.averageStepsPerDay.toLocaleString()}</div>
            <div className="stat-label">Avg Steps/Day</div>
            <div className="stat-subtitle">{stats.stepCompletionRate}% of goal</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-fire"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number">{Math.round((stats.daysWithData / stats.totalDays) * 100)}%</div>
            <div className="stat-label">Consistency</div>
            <div className="stat-subtitle">days with activity</div>
          </div>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="trend-section">
        <h3><i className="fas fa-chart-line"></i> {timeRange === 'week' ? 'Weekly' : 'Monthly'} Trend</h3>
        <div className="trend-chart">
          {weeklyTrend.map((day, index) => (
            <div key={day.date} className="trend-day">
              <div className="day-name">{day.dayName}</div>
              <div className="day-bars">
                <div className="habit-bar">
                  <div 
                    className="bar-fill"
                    style={{ height: `${(day.habits / habits.length) * 100}%` }}
                  ></div>
                </div>
                <div className="step-bar">
                  <div 
                    className="bar-fill"
                    style={{ height: `${Math.min((day.steps / stepGoal) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <div className="day-mood">
                {day.mood && <span>{getMoodEmoji(day.mood)}</span>}
              </div>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-color habit-color"></div>
            <span>Habits</span>
          </div>
          <div className="legend-item">
            <div className="legend-color step-color"></div>
            <span>Steps</span>
          </div>
        </div>
      </div>

      {/* Mood Correlation */}
      <div className="mood-correlation">
        <h3><i className="fas fa-heart"></i> Mood & Performance Correlation</h3>
        <div className="correlation-grid">
          {Object.entries(moodCorrelation).map(([mood, data]) => (
            data.count > 0 && (
              <div key={mood} className="mood-stat">
                <div className="mood-header">
                  <span className="mood-emoji">{getMoodEmoji(mood)}</span>
                  <span className="mood-name">{mood.charAt(0).toUpperCase() + mood.slice(1)}</span>
                  <span className="mood-count">({data.count} days)</span>
                </div>
                <div className="mood-metrics">
                  <div className="metric">
                    <span className="metric-value">{data.avgHabits}</span>
                    <span className="metric-label">Avg Habits</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{data.avgSteps.toLocaleString()}</span>
                    <span className="metric-label">Avg Steps</span>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Top Performing Days */}
      <div className="top-days">
        <h3><i className="fas fa-trophy"></i> Top Performing Days</h3>
        <div className="top-days-list">
          {topDays.map((day, index) => (
            <div key={day.date} className="top-day">
              <div className="rank">
                <span className="rank-number">#{index + 1}</span>
              </div>
              <div className="day-info">
                <div className="day-name">{day.dayName}</div>
                <div className="day-score">Score: {day.score.toFixed(1)}</div>
              </div>
              <div className="day-stats">
                <div className="day-stat">
                  <i className="fas fa-tasks"></i>
                  <span>{day.habits} habits</span>
                </div>
                <div className="day-stat">
                  <i className="fas fa-walking"></i>
                  <span>{day.steps.toLocaleString()} steps</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="insights">
        <h3><i className="fas fa-lightbulb"></i> Insights</h3>
        <div className="insights-list">
          {stats.perfectDays > 0 && (
            <div className="insight positive">
              <i className="fas fa-star"></i>
              <p>You had {stats.perfectDays} perfect day{stats.perfectDays > 1 ? 's' : ''} this {timeRange}!</p>
            </div>
          )}
          
          {moodCorrelation.excellent.count > 0 && moodCorrelation.excellent.avgHabits > moodCorrelation.bad.avgHabits && (
            <div className="insight positive">
              <i className="fas fa-heart"></i>
              <p>You complete more habits on excellent mood days!</p>
            </div>
          )}
          
          {stats.averageStepsPerDay >= stepGoal && (
            <div className="insight positive">
              <i className="fas fa-walking"></i>
              <p>You're consistently hitting your step goal!</p>
            </div>
          )}
          
          {stats.habitCompletionRate < 50 && (
            <div className="insight improvement">
              <i className="fas fa-target"></i>
              <p>Try to improve your habit completion rate for better consistency.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

