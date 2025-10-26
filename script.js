// Step Tracker Application
class StepTracker {
    constructor() {
        this.goalSteps = 5000;
        this.currentSteps = 0;
        this.caloriesPerStep = 0.04; // Average calories burned per step
        this.stepsPerMile = 2000; // Average steps per mile
        this.storageKey = 'stepTrackerData';
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateDisplay();
        this.updateDate();
        this.updateWeekGrid();
        this.updateMotivation();
    }

    setupEventListeners() {
        // Add steps button
        document.getElementById('addSteps').addEventListener('click', () => {
            this.addSteps();
        });

        // Enter key in input
        document.getElementById('stepInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addSteps();
            }
        });

        // Quick add buttons
        document.querySelectorAll('.btn-quick').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const steps = parseInt(e.target.dataset.steps);
                this.addSteps(steps);
            });
        });
    }

    addSteps(customSteps = null) {
        const input = document.getElementById('stepInput');
        const steps = customSteps || parseInt(input.value) || 0;
        
        if (steps > 0) {
            this.currentSteps += steps;
            this.saveData();
            this.updateDisplay();
            this.updateMotivation();
            this.animateProgress();
            
            // Clear input if manually entered
            if (!customSteps) {
                input.value = '';
            }
        }
    }

    updateDisplay() {
        // Update step counter
        document.getElementById('currentSteps').textContent = this.currentSteps.toLocaleString();
        
        // Update progress bar
        const percentage = Math.min((this.currentSteps / this.goalSteps) * 100, 100);
        document.getElementById('progressFill').style.width = `${percentage}%`;
        document.getElementById('percentage').textContent = `${Math.round(percentage)}%`;
        document.getElementById('progressText').textContent = 
            `${this.currentSteps.toLocaleString()} / ${this.goalSteps.toLocaleString()} steps`;
        
        // Update calories and distance
        const calories = Math.round(this.currentSteps * this.caloriesPerStep);
        const distance = (this.currentSteps / this.stepsPerMile).toFixed(1);
        
        document.getElementById('caloriesBurned').textContent = calories;
        document.getElementById('distance').textContent = distance;
        
        // Update goal achievement styling
        if (this.currentSteps >= this.goalSteps) {
            document.querySelector('.progress-card').classList.add('goal-achieved');
        } else {
            document.querySelector('.progress-card').classList.remove('goal-achieved');
        }
    }

    animateProgress() {
        const progressFill = document.getElementById('progressFill');
        progressFill.classList.add('animate');
        setTimeout(() => {
            progressFill.classList.remove('animate');
        }, 500);
    }

    updateDate() {
        const today = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        document.getElementById('currentDate').textContent = today.toLocaleDateString('en-US', options);
    }

    updateWeekGrid() {
        const weekGrid = document.getElementById('weekGrid');
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        
        weekGrid.innerHTML = '';
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            const daySteps = this.getDaySteps(date);
            
            dayCell.innerHTML = `
                <div class="day-name">${dayName}</div>
                <div class="day-steps">${daySteps.toLocaleString()}</div>
            `;
            
            // Add completion status
            if (daySteps >= this.goalSteps) {
                dayCell.classList.add('completed');
            } else if (daySteps > 0) {
                dayCell.classList.add('partial');
            }
            
            // Highlight today
            if (date.toDateString() === today.toDateString()) {
                dayCell.style.border = '2px solid #667eea';
            }
            
            weekGrid.appendChild(dayCell);
        }
        
        this.updateWeekStats();
    }

    updateWeekStats() {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        
        let weekTotal = 0;
        let completedDays = 0;
        let currentStreak = 0;
        
        // Calculate week total and completed days
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const daySteps = this.getDaySteps(date);
            weekTotal += daySteps;
            
            if (daySteps >= this.goalSteps) {
                completedDays++;
            }
        }
        
        // Calculate current streak
        let checkDate = new Date(today);
        while (this.getDaySteps(checkDate) >= this.goalSteps) {
            currentStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
        }
        
        const weekAvg = Math.round(weekTotal / 7);
        
        document.getElementById('weekTotal').textContent = weekTotal.toLocaleString();
        document.getElementById('weekStreak').textContent = currentStreak;
        document.getElementById('weekAvg').textContent = weekAvg.toLocaleString();
    }

    updateMotivation() {
        const motivationCard = document.getElementById('motivationCard');
        const motivationIcon = document.getElementById('motivationIcon');
        const motivationText = document.getElementById('motivationText');
        
        let message = '';
        let icon = 'fas fa-trophy';
        
        if (this.currentSteps >= this.goalSteps) {
            message = '🎉 Congratulations! You\'ve reached your daily goal!';
            icon = 'fas fa-trophy';
        } else if (this.currentSteps >= this.goalSteps * 0.8) {
            message = '🔥 You\'re so close! Just a few more steps to go!';
            icon = 'fas fa-fire';
        } else if (this.currentSteps >= this.goalSteps * 0.5) {
            message = '💪 Great progress! Keep up the momentum!';
            icon = 'fas fa-dumbbell';
        } else if (this.currentSteps > 0) {
            message = '🚶‍♀️ Every step counts! You\'re building a healthy habit!';
            icon = 'fas fa-walking';
        } else {
            message = '🌟 Start your walking journey today! Your health will thank you!';
            icon = 'fas fa-star';
        }
        
        motivationIcon.className = icon;
        motivationText.textContent = message;
    }

    getDaySteps(date) {
        const data = this.getStoredData();
        const dateKey = date.toDateString();
        return data[dateKey] || 0;
    }

    getStoredData() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : {};
    }

    saveData() {
        const data = this.getStoredData();
        const today = new Date().toDateString();
        data[today] = this.currentSteps;
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    loadData() {
        const today = new Date().toDateString();
        const data = this.getStoredData();
        this.currentSteps = data[today] || 0;
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new StepTracker();
});

// Add some fun features
document.addEventListener('DOMContentLoaded', () => {
    // Add confetti effect when goal is reached
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('goal-achieved')) {
                    // Simple confetti effect
                    createConfetti();
                }
            }
        });
    });
    
    const progressCard = document.querySelector('.progress-card');
    if (progressCard) {
        observer.observe(progressCard, { attributes: true });
    }
});

function createConfetti() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = 'fall 3s linear forwards';
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 50);
    }
}

// Add CSS for confetti animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

