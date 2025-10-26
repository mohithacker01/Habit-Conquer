import React, { useState } from 'react';
import './UserRegistration.css';

// Try both localhost and 127.0.0.1 - use whichever works
const API_BASE_URL = 'http://localhost:8000'; // Try this if 127.0.0.1 doesn't work
// const API_BASE_URL = 'http://127.0.0.1:8000'; // Original

const UserRegistration = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    full_name: '',
    dob: '',
    height_cm: '',
    weight_kg: '',
    sex: 'male'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.username || !formData.password || !formData.email || 
          !formData.full_name || !formData.dob) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Prepare request body
      const requestBody = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        full_name: formData.full_name,
        dob: formData.dob,
        height_cm: formData.height_cm ? parseInt(formData.height_cm) : null,
        weight_kg: formData.weight_kg ? parseInt(formData.weight_kg) : null,
        sex: formData.sex
      };

      console.log('Sending registration request to:', `${API_BASE_URL}/user/create`);
      console.log('Request body:', requestBody);

      const response = await fetch(`${API_BASE_URL}/user/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Registration failed');
      }

      setSuccess(true);
      
      // Call onSuccess callback after a short delay
      setTimeout(() => {
        if (onSuccess) onSuccess(data);
        if (onClose) onClose();
      }, 1500);

    } catch (err) {
      console.error('Registration error:', err);
      
      // Provide more specific error messages
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setError('Unable to connect to the server. Please make sure the backend API is running on http://127.0.0.1:8000');
      } else if (err.message.includes('CORS')) {
        setError('CORS error: The backend API needs to allow requests from this origin.');
      } else {
        setError(err.message || 'Failed to register user. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-overlay">
      <div className="registration-modal">
        <div className="modal-header">
          <h2>User Registration</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {success ? (
          <div className="success-message">
            <i className="fas fa-check-circle"></i>
            <h3>Registration Successful!</h3>
            <p>Your account has been created successfully.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="registration-form">
            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                {error}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Enter username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="full_name">Full Name *</label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  placeholder="Enter full name"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter password"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="dob">Date of Birth *</label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="sex">Sex *</label>
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="height_cm">Height (cm)</label>
                <input
                  type="number"
                  id="height_cm"
                  name="height_cm"
                  value={formData.height_cm}
                  onChange={handleChange}
                  placeholder="Enter height in cm"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight_kg">Weight (kg)</label>
                <input
                  type="number"
                  id="weight_kg"
                  name="weight_kg"
                  value={formData.weight_kg}
                  onChange={handleChange}
                  placeholder="Enter weight in kg"
                  min="0"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Registering...
                  </>
                ) : (
                  <>
                    <i className="fas fa-user-plus"></i> Register
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UserRegistration;
