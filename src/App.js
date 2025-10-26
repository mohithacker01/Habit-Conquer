import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import Analytics from './components/Analytics';
import StepTracker from './components/StepTracker';
import HabitList from './components/HabitList';
import UserRegistration from './components/UserRegistration';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [habits, setHabits] = useState([]);
  const [steps, setSteps] = useState(0);
  const [stepGoal] = useState(5000);
  const [moodData, setMoodData] = useState({});
  const [dailyData, setDailyData] = useState({});
  const [showRegistration, setShowRegistration] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    const savedSteps = localStorage.getItem('steps');
    const savedMoodData = localStorage.getItem('moodData');
    const savedDailyData = localStorage.getItem('dailyData');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
    if (savedSteps) {
      setSteps(parseInt(savedSteps));
    }
    if (savedMoodData) {
      setMoodData(JSON.parse(savedMoodData));
    }
    if (savedDailyData) {
      setDailyData(JSON.parse(savedDailyData));
    }
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('steps', steps.toString());
  }, [steps]);

  useEffect(() => {
    localStorage.setItem('moodData', JSON.stringify(moodData));
  }, [moodData]);

  useEffect(() => {
    localStorage.setItem('dailyData', JSON.stringify(dailyData));
  }, [dailyData]);

  const addHabit = (habitName) => {
    const newHabit = {
      id: Date.now(),
      name: habitName,
      completed: false,
      date: new Date().toISOString().split('T')[0],
      category: 'general'
    };
    setHabits([...habits, newHabit]);
  };

  const toggleHabit = (habitId) => {
    const updatedHabits = habits.map(habit => 
      habit.id === habitId 
        ? { ...habit, completed: !habit.completed }
        : habit
    );
    setHabits(updatedHabits);
    
    // Update daily data
    const today = new Date().toISOString().split('T')[0];
    const completedCount = updatedHabits.filter(h => h.completed).length;
    const totalCount = updatedHabits.length;
    
    setDailyData(prev => ({
      ...prev,
      [today]: {
        ...prev[today],
        habitsCompleted: completedCount,
        totalHabits: totalCount,
        steps: steps
      }
    }));
  };

  const deleteHabit = (habitId) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
  };

  const addSteps = (stepCount) => {
    setSteps(prevSteps => {
      const newSteps = prevSteps + stepCount;
      const today = new Date().toISOString().split('T')[0];
      
      setDailyData(prev => ({
        ...prev,
        [today]: {
          ...prev[today],
          steps: newSteps
        }
      }));
      
      return newSteps;
    });
  };

  const resetSteps = () => {
    setSteps(0);
    const today = new Date().toISOString().split('T')[0];
    setDailyData(prev => ({
      ...prev,
      [today]: {
        ...prev[today],
        steps: 0
      }
    }));
  };

  const updateMood = (date, mood) => {
    setMoodData(prev => ({
      ...prev,
      [date]: mood
    }));
  };

  const handleRegistrationSuccess = (userData) => {
    console.log('User registered successfully:', userData);
    
    // Store user data in localStorage
    if (userData) {
      localStorage.setItem('currentUser', JSON.stringify(userData));
      console.log('User data saved to localStorage');
      setCurrentUser(userData); // Update state
    }
    
    // You can also store individual fields
    if (userData.username) {
      localStorage.setItem('username', userData.username);
    }
    if (userData.email) {
      localStorage.setItem('userEmail', userData.email);
    }
    if (userData.full_name) {
      localStorage.setItem('userFullName', userData.full_name);
    }
    
    alert(`Welcome ${userData.full_name || userData.username}! Registration successful!`);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            habits={habits}
            steps={steps}
            stepGoal={stepGoal}
            onToggleHabit={toggleHabit}
            onAddSteps={addSteps}
            onResetSteps={resetSteps}
            onUpdateMood={updateMood}
            moodData={moodData}
          />
        );
      case 'calendar':
        return (
          <CalendarView 
            habits={habits}
            dailyData={dailyData}
            moodData={moodData}
          />
        );
      case 'analytics':
        return (
          <Analytics 
            habits={habits}
            dailyData={dailyData}
            moodData={moodData}
            stepGoal={stepGoal}
          />
        );
      case 'habits':
        return (
          <>
            <StepTracker 
              steps={steps}
              stepGoal={stepGoal}
              onAddSteps={addSteps}
              onResetSteps={resetSteps}
            />
            <HabitList 
              habits={habits}
              onAddHabit={addHabit}
              onToggleHabit={toggleHabit}
              onDeleteHabit={deleteHabit}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-container">
            <img 
              src="/logo.jpg" 
              alt="Habit Tracker Logo" 
              className="app-logo"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="logo-fallback" style={{display: 'none'}}>
              <i className="fas fa-user-circle"></i>
            </div>
          </div>
          <div className="header-text">
            <h1>Habit Tracker</h1>
            <p className="subtitle">
              {currentUser ? `Welcome, ${currentUser.full_name || currentUser.username}!` : 'Track your daily habits and steps'}
            </p>
          </div>
          <div className="header-actions">
            {currentUser ? (
              <div className="user-info">
                <span className="user-name">{currentUser.full_name || currentUser.username}</span>
                <button 
                  className="logout-btn"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to logout?')) {
                      localStorage.removeItem('currentUser');
                      setCurrentUser(null);
                      alert('Logged out successfully!');
                    }
                  }}
                  title="Logout"
                >
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            ) : (
              <button 
                className="register-btn"
                onClick={() => setShowRegistration(true)}
                title="Register New User"
              >
                <i className="fas fa-user-plus"></i> Register
              </button>
            )}
          </div>
        </div>
      </header>

      <nav className="navigation">
        <button 
          className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          <i className="fas fa-home"></i> Dashboard
        </button>
        <button 
          className={`nav-btn ${currentView === 'calendar' ? 'active' : ''}`}
          onClick={() => setCurrentView('calendar')}
        >
          <i className="fas fa-calendar"></i> Calendar
        </button>
        <button 
          className={`nav-btn ${currentView === 'analytics' ? 'active' : ''}`}
          onClick={() => setCurrentView('analytics')}
        >
          <i className="fas fa-chart-bar"></i> Analytics
        </button>
        <button 
          className={`nav-btn ${currentView === 'habits' ? 'active' : ''}`}
          onClick={() => setCurrentView('habits')}
        >
          <i className="fas fa-tasks"></i> Habits
        </button>
      </nav>

      <div className="main-content">
        {renderCurrentView()}
      </div>

      {showRegistration && (
        <UserRegistration
          onClose={() => setShowRegistration(false)}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
}

export default App;
