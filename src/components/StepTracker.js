import React, { useState } from 'react';
import RealStepCounter from './RealStepCounter';
import './StepTracker.css';

const StepTracker = ({ steps, stepGoal, onAddSteps, onResetSteps }) => {
  const [inputSteps, setInputSteps] = useState('');
  const [showInput, setShowInput] = useState(false);
  const [useRealCounter, setUseRealCounter] = useState(false);

  const percentage = Math.min((steps / stepGoal) * 100, 100);
  const caloriesBurned = Math.round(steps * 0.04); // rough estimate
  const distance = (steps * 0.0005).toFixed(1); // miles (2000 steps per mile)

  const handleAddSteps = () => {
    const stepCount = parseInt(inputSteps);
    if (stepCount > 0) {
      onAddSteps(stepCount);
      setInputSteps('');
      setShowInput(false);
    }
  };

  const handleQuickAdd = (stepCount) => {
    onAddSteps(stepCount);
  };

  const handleRealStepUpdate = (realSteps) => {
    // sync real steps with main counter
    const currentSteps = steps;
    const newSteps = realSteps;
    if (newSteps > currentSteps) {
      onAddSteps(newSteps - currentSteps);
    }
  };

  const getMotivationMessage = () => {
    return "Habits are the compound interest of self-improvement.";
  };

  return (
    <div className="step-tracker card">
      <div className="step-header">
        <h2><i className="fas fa-walking"></i> Step Tracker</h2>
        <div className="header-controls">
          <span className="date">{new Date().toLocaleDateString()}</span>
          <button 
            className={`mode-toggle ${useRealCounter ? 'active' : ''}`}
            onClick={() => setUseRealCounter(!useRealCounter)}
          >
            <i className={`fas ${useRealCounter ? 'fa-mobile-alt' : 'fa-hand-paper'}`}></i>
            {useRealCounter ? 'Auto' : 'Manual'}
          </button>
        </div>
      </div>

      <div className="step-display">
        <div className="step-number">{steps.toLocaleString()}</div>
        <div className="step-label">Steps Today</div>
      </div>

      <div className="progress-section">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <div className="progress-text">
          <span>{steps.toLocaleString()} / {stepGoal.toLocaleString()} steps</span>
          <span className="percentage">{Math.round(percentage)}%</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <i className="fas fa-fire"></i>
          <div>
            <div className="stat-number">{caloriesBurned}</div>
            <div className="stat-label">Calories</div>
          </div>
        </div>
        <div className="stat-item">
          <i className="fas fa-route"></i>
          <div>
            <div className="stat-number">{distance}</div>
            <div className="stat-label">Miles</div>
          </div>
        </div>
      </div>

      {useRealCounter ? (
        <RealStepCounter 
          onStepsUpdate={handleRealStepUpdate}
          isActive={true}
        />
      ) : (
        <div className="step-controls">
          {!showInput ? (
            <div className="control-buttons">
              <button 
                className="btn-primary"
                onClick={() => setShowInput(true)}
              >
                <i className="fas fa-plus"></i> Add Steps
              </button>
              <button 
                className="btn-secondary"
                onClick={onResetSteps}
              >
                <i className="fas fa-refresh"></i> Reset
              </button>
            </div>
          ) : (
            <div className="input-section">
              <input
                type="number"
                value={inputSteps}
                onChange={(e) => setInputSteps(e.target.value)}
                placeholder="Enter steps"
                className="step-input"
              />
              <div className="input-buttons">
                <button 
                  className="btn-primary"
                  onClick={handleAddSteps}
                  disabled={!inputSteps}
                >
                  Add
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setShowInput(false);
                    setInputSteps('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="quick-add">
            <button 
              className="btn-quick"
              onClick={() => handleQuickAdd(1000)}
            >
              +1K
            </button>
            <button 
              className="btn-quick"
              onClick={() => handleQuickAdd(2000)}
            >
              +2K
            </button>
            <button 
              className="btn-quick"
              onClick={() => handleQuickAdd(5000)}
            >
              +5K
            </button>
          </div>
        </div>
      )}

      <div className="motivation">
        <p>{getMotivationMessage()}</p>
      </div>
    </div>
  );
};

export default StepTracker;
