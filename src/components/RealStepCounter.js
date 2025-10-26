import React, { useState, useEffect, useRef } from 'react';
import './RealStepCounter.css';

const RealStepCounter = ({ onStepsUpdate, isActive }) => {
  const [steps, setSteps] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [error, setError] = useState(null);
  const [lastStepTime, setLastStepTime] = useState(0);
  
  // tweaked these values after testing on my phone
  const stepThreshold = 0.25; 
  const stepCooldown = 250; // ms between steps 
  const lastAcceleration = useRef({ x: 0, y: 0, z: 0 });
  const stepCount = useRef(0);

  useEffect(() => {
    if (isActive && isTracking) {
      startStepTracking();
    } else {
      stopStepTracking();
    }
  }, [isActive, isTracking]);

  const startStepTracking = async () => {
    try {
      if (!window.DeviceMotionEvent) {
        throw new Error('Device motion not supported on this device');
      }

      // ios permission stuff - annoying but necessary
      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        const permission = await DeviceMotionEvent.requestPermission();
        if (permission !== 'granted') {
          throw new Error('Motion permission denied');
        }
      }

      setPermissionGranted(true);
      setError(null);

      window.addEventListener('devicemotion', handleMotion);
      
    } catch (err) {
      setError(err.message);
      setIsTracking(false);
    }
  };

  const stopStepTracking = () => {
    window.removeEventListener('devicemotion', handleMotion);
  };

  const handleMotion = (event) => {
    const { acceleration } = event;
    
    if (!acceleration) return;

    const { x, y, z } = acceleration;
    const currentAcceleration = { x, y, z };
    
    // calc acceleration change
    const deltaX = Math.abs(currentAcceleration.x - lastAcceleration.current.x);
    const deltaY = Math.abs(currentAcceleration.y - lastAcceleration.current.y);
    const deltaZ = Math.abs(currentAcceleration.z - lastAcceleration.current.z);
    
    const totalDelta = deltaX + deltaY + deltaZ;
    const currentTime = Date.now();
    
    // check if this looks like a step
    if (totalDelta > stepThreshold && 
        (currentTime - lastStepTime) > stepCooldown) {
      
      if (isWalkingPattern(currentAcceleration, lastAcceleration.current)) {
        stepCount.current += 1;
        setSteps(stepCount.current);
        setLastStepTime(currentTime);
        
        if (onStepsUpdate) {
          onStepsUpdate(stepCount.current);
        }
      }
    }
    
    lastAcceleration.current = currentAcceleration;
  };

  const isWalkingPattern = (current, last) => {
    // basic walking detection - mostly vertical movement
    const verticalChange = Math.abs(current.z - last.z);
    return verticalChange > 0.08; // adjusted this after testing
  };

  const startTracking = () => {
    setIsTracking(true);
    setError(null);
  };

  const stopTracking = () => {
    setIsTracking(false);
  };

  const resetSteps = () => {
    stepCount.current = 0;
    setSteps(0);
    if (onStepsUpdate) {
      onStepsUpdate(0);
    }
  };

  const getStatusMessage = () => {
    if (error) {
      return `Error: ${error}`;
    }
    if (!permissionGranted && isTracking) {
      return 'Getting permission...';
    }
    if (isTracking) {
      return '🚶‍♂️ Counting steps automatically!';
    }
    return 'Click start to begin auto step counting';
  };

  const getStatusColor = () => {
    if (error) return '#ff6b6b';
    if (isTracking) return '#4CAF50';
    return '#667eea';
  };

  return (
    <div className="real-step-counter">
      <div className="counter-header">
        <h3><i className="fas fa-mobile-alt"></i> Real-Time Step Counter</h3>
        <div className="status-indicator" style={{ backgroundColor: getStatusColor() }}>
          <div className="status-dot"></div>
        </div>
      </div>

      <div className="step-display">
        <div className="step-number">{steps}</div>
        <div className="step-label">Steps Detected</div>
      </div>

      <div className="status-message">
        <p>{getStatusMessage()}</p>
      </div>

      <div className="control-buttons">
        {!isTracking ? (
          <button 
            className="btn-start"
            onClick={startTracking}
            disabled={!isActive}
          >
            <i className="fas fa-play"></i> Start Tracking
          </button>
        ) : (
          <button 
            className="btn-stop"
            onClick={stopTracking}
          >
            <i className="fas fa-stop"></i> Stop Tracking
          </button>
        )}
        
        <button 
          className="btn-reset"
          onClick={resetSteps}
        >
          <i className="fas fa-refresh"></i> Reset
        </button>
      </div>

      <div className="instructions">
        <h4>How it works:</h4>
        <ul>
          <li>Uses phone motion sensors to detect steps</li>
          <li>Counts steps automatically when walking</li>
          <li>Works best with phone in pocket</li>
          <li>Needs motion permission</li>
        </ul>
      </div>

      {error && (
        <div className="error-message">
          <p><i className="fas fa-exclamation-triangle"></i> {error}</p>
          <p>Try refreshing or check device settings</p>
        </div>
      )}
    </div>
  );
};

export default RealStepCounter;
