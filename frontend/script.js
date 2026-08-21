
// FixIt Home Repair Task Manager - JavaScript
 
// --- Global Variables & API Configuration ---
const API_BASE_URL = 'http://localhost:5000/api'; // Make sure this matches your backend's port
let jwtToken = localStorage.getItem('jwtToken') || null; // Stores the JWT for authentication
let currentLoggedInUser = null; // Stores user data fetched from /api/auth/me
let tasks = []; // Stores tasks fetched from the backend
 
// --- Initialization on DOM Load ---
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
 
    switch(currentPage) {
        case 'login.html':
            initLogin();
            break;
        case 'signup.html':
            initSignup();
            break;
        case 'index.html':
        case '': // For direct access to index.html (e.g., if hosted at root)
            initDashboard();
            break;
        default:
            // Fallback for other paths, you might want a 404 or redirect
            initDashboard();
    }
});
 
// --- Authentication Helper Functions ---
 
function setAuthToken(token) {
    jwtToken = token;
    localStorage.setItem('jwtToken', token);
}
 
function getAuthToken() {
    return jwtToken;
}
 
function removeAuthToken() {
    jwtToken = null;
    localStorage.removeItem('jwtToken');
    // Also clear any old localStorage items for user data if they still exist
    localStorage.removeItem('fixit-user');
    localStorage.removeItem('fixit-remember');
}
 
function redirectToDashboardIfLoggedIn() {
    if (getAuthToken()) {
        window.location.href = 'index.html';
    }
}
 
function redirectToLoginIfNotLoggedIn() {
    if (!getAuthToken()) {
        window.location.href = 'login.html';
    }
}
 
// --- Login Page Functions ---
 
function initLogin() {
    const loginForm = document.getElementById('loginForm');
    const forgotPassword = document.getElementById('forgotPassword');
 
    redirectToDashboardIfLoggedIn(); // Redirect if already authenticated
 
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (forgotPassword) forgotPassword.addEventListener('click', handleForgotPassword);
}
 
async function handleLogin(e) {
    e.preventDefault();
 
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    // const rememberMe = document.getElementById('rememberMe').checked; // You can pass this to backend if session logic is more complex
 
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
 
        const data = await response.json(); // Always parse response to get message
 
        if (!response.ok) { // Check HTTP status for errors (e.g., 400, 401, 500)
            showNotification(data.message || 'Login failed!', 'error');
            return;
        }
 
        setAuthToken(data.token); // Store the JWT received from the backend
        // If your backend sends user data along with the token, you can store it here:
        // currentLoggedInUser = data.user;
 
        showNotification('Login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html'; // Redirect to dashboard
        }, 1000);
 
    } catch (error) {
        console.error('Error during login:', error);
        showNotification('An unexpected error occurred during login. Please try again.', 'error');
    }
}
 
// --- Signup Page Functions ---
 
function initSignup() {
    const signupForm = document.getElementById('signupForm');
 
    redirectToDashboardIfLoggedIn(); // Redirect if already authenticated
 
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
}
 
async function handleSignup(e) {
    e.preventDefault();
 
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        confirmPassword: document.getElementById('confirmPassword').value,
        homeType: document.getElementById('homeType').value,
        agreeTerms: document.getElementById('agreeTerms').checked,
        emailNotifications: document.getElementById('emailNotifications').checked
    };
 
    // Client-side validation (keep these)
    if (!formData.agreeTerms) {
        showNotification('You must agree to the Terms of Service and Privacy Policy', 'error');
        return;
    }
    if (formData.password !== formData.confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    if (formData.password.length < 6) {
        showNotification('Password must be at least 6 characters', 'error');
        return;
    }
 
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Only send necessary registration data to backend
            body: JSON.stringify({
                fullName: formData.fullName,
                email: formData.email,
                password: formData.password,
                homeType: formData.homeType,
                agreeTerms: formData.agreeTerms,
                emailNotifications: formData.emailNotifications
            }),
        });
 
        const data = await response.json();
 
        if (!response.ok) {
            showNotification(data.message || 'Registration failed!', 'error');
            return;
        }
 
        setAuthToken(data.token); // Store the JWT received after successful registration and auto-login
        // currentLoggedInUser = data.user; // If backend sends user data
 
        showNotification('Account created successfully!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html'; // Redirect to dashboard after successful signup and login
        }, 1000);
 
    } catch (error) {
        console.error('Error during registration:', error);
        showNotification('An unexpected error occurred during registration. Please try again.', 'error');
    }
}
 
function handleForgotPassword(e) {
    e.preventDefault();
    showNotification('Password reset feature coming soon!', 'info');
}
 
// --- Dashboard Functions (`index.html`) ---
 
async function initDashboard() {
    // Check if user is logged in using JWT
    if (!getAuthToken()) {
        redirectToLoginIfNotLoggedIn();
        return; // Stop execution if not logged in
    }
 
    // Fetch user data to display welcome message and verify token validity
    currentLoggedInUser = await fetchUserData();
    if (!currentLoggedInUser) {
        // If fetchUserData failed (e.g., token invalid/expired), it would have redirected to login
        return; // Stop execution
    }
    document.getElementById('welcomeUser').textContent = `Welcome, ${currentLoggedInUser.fullName || 'User'}!`;
 
    // Initialize dashboard elements
    const taskForm = document.getElementById('taskForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const filterRoom = document.getElementById('filterRoom');
    const filterStatus = document.getElementById('filterStatus');
    const filterPriority = document.getElementById('filterPriority');
 
    // Event listeners
    if (taskForm) taskForm.addEventListener('submit', handleSaveTask);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (filterRoom) filterRoom.addEventListener('change', fetchAndDisplayTasks);
    if (filterStatus) filterStatus.addEventListener('change', fetchAndDisplayTasks);
    if (filterPriority) filterPriority.addEventListener('change', fetchAndDisplayTasks);
 
    // Initial load and display of tasks
    await fetchAndDisplayTasks();
}
 
async function fetchUserData() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`, // Send JWT
            },
        });
 
        if (!response.ok) {
            // If token is invalid or expired, clear it and redirect
            removeAuthToken();
            redirectToLoginIfNotLoggedIn();
            showNotification('Session expired. Please log in again.', 'error');
            return null;
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching user data:', error);
        removeAuthToken(); // Assume token is bad if fetch fails
        redirectToLoginIfNotLoggedIn();
        showNotification('Failed to verify session. Please log in again.', 'error');
        return null;
    }
}
 
async function fetchAndDisplayTasks() {
    const roomFilter = document.getElementById('filterRoom').value;
    const statusFilter = document.getElementById('filterStatus').value;
    const priorityFilter = document.getElementById('filterPriority').value;
 
    const queryParams = new URLSearchParams();
    if (roomFilter) queryParams.append('room', roomFilter);
    if (statusFilter) queryParams.append('status', statusFilter);
    if (priorityFilter) queryParams.append('priority', priorityFilter);
 
    const url = `${API_BASE_URL}/tasks?${queryParams.toString()}`;
 
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
            },
        });
 
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching tasks:', errorData.message);
            if (response.status === 401 || response.status === 403) {
                removeAuthToken();
                redirectToLoginIfNotLoggedIn();
                showNotification('Session expired while fetching tasks. Please log in again.', 'error');
            } else {
                showNotification(errorData.message || 'Failed to load tasks.', 'error');
            }
            return;
        }
 
        const fetchedTasks = await response.json();
        tasks = fetchedTasks; // Update the global tasks array with backend data
        displayTasks(); // Render main task list
        displayReminders(); // Render reminders based on the new tasks
    } catch (error) {
        console.error('Network error fetching tasks:', error);
        showNotification('Could not connect to the server to fetch tasks. Please check your connection.', 'error');
    }
}
 
function handleLogout() {
    removeAuthToken(); // Clear JWT
    showNotification('You have been logged out.', 'info');
    setTimeout(() => {
        window.location.href = 'login.html'; // Redirect to login page
    }, 500); // Give notification time to show
}
 
function displayTasks() {
    const tasksList = document.getElementById('tasksList');
    const filteredTasks = getFilteredTasks(); // Filter the `tasks` array populated by backend fetch
 
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <h3>No tasks found</h3>
                <p>Add your first maintenance task to get started!</p>
            </div>
        `;
        return;
    }
 
    tasksList.innerHTML = filteredTasks.map(task => createTaskHTML(task)).join('');
 
    addTaskEventListeners(); // Add event listeners to dynamically created buttons
}
 
function createTaskHTML(task) {
    // Use task._id from MongoDB for data-task-id
    const displayStatus = formatText(task.status); // Backend should provide status like 'pending', 'completed', 'overdue'
    const taskClass = task.status === 'completed' ? 'task-completed' :
                      task.status === 'overdue' ? 'task-overdue' : '';
 
    const nextDueDateStr = task.nextDueDate ? formatDate(task.nextDueDate) : 'N/A';
    const lastCompletedStr = task.lastCompleted ? formatDate(task.lastCompleted) : 'Never';
 
    return `
        <div class="task-item ${taskClass}" data-task-id="${task._id}">
            <div class="task-header">
                <h3 class="task-title">${task.taskName}</h3>
                <span class="task-priority priority-${task.priority}">${task.priority}</span>
            </div>
            <div class="task-details">
                <div class="task-detail">
                    <strong>Room:</strong> ${formatText(task.room)}
                </div>
                <div class="task-detail">
                    <strong>Appliance:</strong> ${formatText(task.appliance)}
                </div>
                <div class="task-detail">
                    <strong>Frequency:</strong> ${formatText(task.frequency)}
                </div>
                <div class="task-detail">
                    <strong>Next Due:</strong> ${nextDueDateStr}
                </div>
                <div class="task-detail">
                    <strong>Last Completed:</strong> ${lastCompletedStr}
                </div>
                <div class="task-detail">
                    <strong>Status:</strong> ${displayStatus}
                </div>
            </div>
            ${task.notes ? `<div class="task-notes"><strong>Notes:</strong> ${task.notes}</div>` : ''}
            <div class="task-actions">
                ${task.status !== 'completed' ? `
                    <button class="task-btn complete-btn" data-id="${task._id}">
                        Complete
                    </button>
                ` : ''}
                <button class="task-btn edit-btn" data-id="${task._id}">
                    Edit
                </button>
                <button class="task-btn delete-btn" data-id="${task._id}">
                    Delete
                </button>
            </div>
        </div>
    `;
}
 
function displayReminders() {
    const remindersList = document.getElementById('remindersList');
    const upcomingTasks = getUpcomingTasks();
 
    if (upcomingTasks.length === 0) {
        remindersList.innerHTML = `
            <div class="empty-state">
                <h3>No upcoming reminders</h3>
                <p>All your tasks are up to date!</p>
            </div>
        `;
        return;
    }
 
    remindersList.innerHTML = upcomingTasks.map(task => createReminderHTML(task)).join('');
}
 
function createReminderHTML(task) {
    const daysUntilDue = task.nextDueDate ? getDaysUntilDue(task.nextDueDate) : Infinity;
    const urgencyClass = daysUntilDue <= 0 ? 'urgent' : // Overdue or Due Today
                         daysUntilDue <= 3 ? 'urgent' :
                         daysUntilDue <= 7 ? 'soon' : 'upcoming';
 
    return `
        <div class="reminder-item ${urgencyClass}">
            <div class="reminder-header">
                <h4>${task.taskName}</h4>
                <span class="reminder-time">${getDueDateText(daysUntilDue)}</span>
            </div>
            <div class="reminder-details">
                <span>${formatText(task.room)} - ${formatText(task.appliance)}</span>
            </div>
        </div>
    `;
}
 
function getFilteredTasks() {
    const roomFilter = document.getElementById('filterRoom').value;
    const statusFilter = document.getElementById('filterStatus').value;
    const priorityFilter = document.getElementById('filterPriority').value;
 
    return tasks.filter(task => {
        const matchesRoom = !roomFilter || task.room === roomFilter;
        const matchesStatus = !statusFilter || task.status === statusFilter; // Use backend's status
        const matchesPriority = !priorityFilter || task.priority === priorityFilter;
 
        return matchesRoom && matchesStatus && matchesPriority;
    });
}
 
function getUpcomingTasks() {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000));
 
    return tasks
        .filter(task => {
            // Filter pending/overdue tasks with a due date within 30 days or already overdue
            return task.status !== 'completed' && task.nextDueDate && new Date(task.nextDueDate) <= thirtyDaysFromNow;
        })
        .sort((a, b) => new Date(a.nextDueDate) - new Date(b.nextDueDate));
}
 
async function completeTask(taskId) {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify({ status: 'completed' }), // Backend will handle lastCompleted and nextDue update
        });
 
        const data = await response.json();
 
        if (!response.ok) {
            showNotification(data.message || 'Failed to complete task.', 'error');
            return;
        }
 
        showNotification('Task marked as complete!', 'success');
        await fetchAndDisplayTasks(); // Re-fetch and re-render to update UI with new status and due date
    } catch (error) {
        console.error('Error completing task:', error);
        showNotification('An unexpected error occurred while completing the task.', 'error');
    }
}
 
async function editTask(taskId) {
    const taskToEdit = tasks.find(t => t._id === taskId);
    if (!taskToEdit) {
        showNotification('Task not found for editing.', 'error');
        return;
    }
 
    // Populate the form with current task data
    document.getElementById('taskName').value = taskToEdit.taskName;
    document.getElementById('room').value = taskToEdit.room;
    document.getElementById('appliance').value = taskToEdit.appliance;
    document.getElementById('frequency').value = taskToEdit.frequency;
    document.getElementById('priority').value = taskToEdit.priority;
    document.getElementById('notes').value = taskToEdit.notes || '';
 
    // Store the ID of the task being edited on the form element itself
    // This allows `handleSaveTask` to know if it's updating or creating
    document.getElementById('taskForm').dataset.editingTaskId = taskId;
    document.getElementById('taskForm').querySelector('button[type="submit"]').textContent = 'Update Task';
 
 
    showNotification('Task loaded for editing. Make changes and click "Update Task".', 'info');
    document.getElementById('taskForm').scrollIntoView({ behavior: 'smooth' });
}
 
// Handles both creating a new task (POST) and updating an existing one (PUT)
async function handleSaveTask(e) {
    e.preventDefault();
 
    const taskId = document.getElementById('taskForm').dataset.editingTaskId;
    const method = taskId ? 'PUT' : 'POST';
    const url = taskId ? `${API_BASE_URL}/tasks/${taskId}` : `${API_BASE_URL}/tasks`;
 
    const taskData = {
        taskName: document.getElementById('taskName').value,
        room: document.getElementById('room').value,
        appliance: document.getElementById('appliance').value,
        frequency: document.getElementById('frequency').value,
        priority: document.getElementById('priority').value,
        notes: document.getElementById('notes').value,
    };
 
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getAuthToken()}`,
            },
            body: JSON.stringify(taskData),
        });
 
        const data = await response.json();
 
        if (!response.ok) {
            showNotification(data.message || 'Failed to save task.', 'error');
            return;
        }
 
        showNotification(taskId ? 'Task updated successfully!' : 'Task added successfully!', 'success');
        document.getElementById('taskForm').reset(); // Clear form
        delete document.getElementById('taskForm').dataset.editingTaskId; // Clear editing state
        document.getElementById('taskForm').querySelector('button[type="submit"]').textContent = 'Add Task'; // Reset button text
 
        await fetchAndDisplayTasks(); // Re-fetch and re-render tasks
    } catch (error) {
        console.error('Error saving task:', error);
        showNotification('An unexpected error occurred while saving the task.', 'error');
    }
}
// taskForm.addEventListener('submit', handleSaveTask);
 
 
async function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                },
            });
 
            if (!response.ok) {
                const errorData = await response.json();
                showNotification(errorData.message || 'Failed to delete task.', 'error');
                return;
            }
 
            showNotification('Task deleted', 'info');
            await fetchAndDisplayTasks(); // Re-fetch and re-render
        } catch (error) {
            console.error('Error deleting task:', error);
            showNotification('An unexpected error occurred while deleting the task.', 'error');
        }
    }
}
 
function filterTasks() {
    fetchAndDisplayTasks(); // Re-fetch tasks with current filter parameters
}
 
// --- Utility Functions ---
 
function getDaysUntilDue(dueDate) {
    if (!dueDate) return Infinity; // Handle tasks with no due date
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
 
function getDueDateText(days) {
    if (days < 0) return 'Overdue';
    if (days === 0) return 'Due Today';
    if (days === 1) return 'Due Tomorrow';
    if (days <= 7) return `Due in ${days} days`;
    if (days === Infinity) return 'No due date'; // For tasks without a set due date
    return `Due in ${Math.ceil(days / 7)} weeks`;
}
 
function formatText(text) {
    if (!text) return '';
    // Replaces hyphens with spaces and capitalizes the first letter of each word
    return text.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}
 
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
 
// This function now uses event delegation to handle clicks on dynamically created buttons
function addTaskEventListeners() {
    const tasksList = document.getElementById('tasksList');
    // Remove existing listener to prevent duplicates when tasks are re-rendered
    tasksList.removeEventListener('click', handleTaskButtonClick);
    // Add a single listener to the parent container
    tasksList.addEventListener('click', handleTaskButtonClick);
}
 
function handleTaskButtonClick(e) {
    const target = e.target;
    // Check which button was clicked based on its class
    if (target.classList.contains('complete-btn')) {
        completeTask(target.dataset.id); // Pass the task ID from data-id attribute
    } else if (target.classList.contains('edit-btn')) {
        editTask(target.dataset.id);
    } else if (target.classList.contains('delete-btn')) {
        deleteTask(target.dataset.id);
    }
}
 
// Notification system (no changes needed here as it's purely client-side UI)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
 
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    `;
 
    switch(type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        case 'info':
            notification.style.background = '#17a2b8';
            break;
        default:
            notification.style.background = '#6c757d';
    }
 
    document.body.appendChild(notification);
 
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) { // Check if still in DOM before removing
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}
 
// Add notification animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
 
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
 
// --- END OF SCRIPT ---
