# Habit Tracker

A comprehensive React-based habit tracker that helps you build and maintain daily habits, with advanced analytics and mood correlation features.

## Features

### 🏠 Dashboard
- **Today's Overview**: Quick view of today's habits and progress
- **Step Tracking**: Track your daily steps with a goal of 5,000 steps
- **Mood Tracking**: Set and track your daily mood
- **Quick Actions**: Fast step addition and habit completion
- **Motivational Messages**: Personalized encouragement based on progress

### 🗓️ Calendar View
- **Visual Progress Tracker**: Color-coded calendar showing daily performance
- **Streak Tracking**: Current and longest streaks displayed
- **Day Details**: Click any day to see detailed stats
- **Performance Legend**: Green = perfect, Red = missed, with gradient indicators
- **Monthly Navigation**: Easy month-to-month browsing

### 📊 Analytics
- **Weekly/Monthly Stats**: Comprehensive performance metrics
- **Mood Correlation**: See how mood affects habit completion
- **Trend Analysis**: Visual charts showing progress over time
- **Top Performing Days**: Rank your best days
- **Insights**: AI-powered suggestions for improvement
- **Consistency Tracking**: Monitor your habit-building consistency

### 🎯 Habit Management
- **Add Habits**: Create custom daily habits
- **Complete Habits**: Check off completed habits with visual feedback
- **Delete Habits**: Remove habits you no longer want to track
- **Progress Tracking**: Shows completion rate and habit count
- **Data Persistence**: All data is saved locally in your browser
- **Responsive Design**: Works perfectly on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser and navigate to `http://localhost:3000`

## How to Use

### 🏠 Dashboard
- **Quick Overview**: See today's habits, steps, and mood at a glance
- **Mood Tracking**: Set your daily mood (Excellent, Good, Okay, Bad, Terrible)
- **Quick Actions**: Use +1K, +2K buttons for fast step addition
- **Habit Check-ins**: Click the circle icons to mark habits as complete
- **Motivation**: Get personalized messages based on your progress

### 🗓️ Calendar View
- **Visual Progress**: See your daily performance with color-coded days
- **Streak Tracking**: Monitor your current and longest streaks
- **Day Details**: Click any day to see detailed statistics
- **Navigation**: Use arrow buttons to browse different months
- **Legend**: Understand the color coding system

### 📊 Analytics
- **Time Range**: Switch between weekly and monthly views
- **Performance Stats**: See perfect days, averages, and completion rates
- **Mood Correlation**: Discover how your mood affects habit completion
- **Trend Charts**: Visual representation of your progress over time
- **Top Days**: See your best performing days ranked
- **Insights**: Get personalized suggestions for improvement

### 🎯 Habit Management
- **Add Habits**: Create custom daily habits in the Habits tab
- **Complete Habits**: Check off completed habits with visual feedback
- **Delete Habits**: Remove habits you no longer want to track
- **Step Tracking**: Add steps manually or use quick-add buttons
- **Data Persistence**: All data is automatically saved locally
- **Responsive Design**: Optimized for both desktop and mobile use

## Project Structure

```
src/
├── components/
│   ├── Dashboard.js         # Main dashboard component
│   ├── Dashboard.css        # Dashboard styles
│   ├── CalendarView.js      # Calendar view component
│   ├── CalendarView.css     # Calendar view styles
│   ├── Analytics.js         # Analytics component
│   ├── Analytics.css        # Analytics styles
│   ├── StepTracker.js       # Step tracking component
│   ├── StepTracker.css      # Step tracker styles
│   ├── HabitList.js         # Habit management component
│   └── HabitList.css        # Habit list styles
├── App.js                   # Main application component with navigation
├── App.css                  # Main application styles
├── index.js                 # Application entry point
└── index.css                # Global styles
```

## Technologies Used

- React 18
- CSS3 with modern features
- Font Awesome icons
- Local Storage API
- Responsive design principles

## Customization

You can easily customize the app by modifying:
- Step goal in `App.js` (default: 5,000 steps)
- Colors and styling in the CSS files
- Motivational messages in the components
- Add new habit categories or features

## Browser Support

This app works in all modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Local Storage API

Enjoy building better habits! 🚶‍♂️✨
