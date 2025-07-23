// Admin panel JavaScript functionality

let currentSection = 'dashboard';

// Show specific admin section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    event.target.classList.add('active');
    currentSection = sectionId;
    
    // Load section-specific data
    loadSectionData(sectionId);
}

// Load data for specific section
function loadSectionData(sectionId) {
    switch (sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'leads':
            loadLeadsData();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
        default:
            break;
    }
}

// Load dashboard data
function loadDashboardData() {
    // Simulate real-time data updates
    setTimeout(() => {
        updateStatCard('Total Conversations', Math.floor(Math.random() * 50) + 100);
        updateStatCard('Leads Captured', Math.floor(Math.random() * 20) + 80);
    }, 500);
}

// Update stat card values
function updateStatCard(label, value) {
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        const content = card.querySelector('.stat-content p');
        if (content && content.textContent === label) {
            const valueElement = card.querySelector('.stat-content h3');
            valueElement.textContent = value;
            card.style.animation = 'pulse 0.5s ease';
        }
    });
}

// Load leads data
function loadLeadsData() {
    console.log('Loading leads data...');
    // In a real implementation, this would fetch data from the backend
}

// Load analytics data
function loadAnalyticsData() {
    console.log('Loading analytics data...');
    // In a real implementation, this would load charts and metrics
}

// Agent configuration functions
function saveConfiguration() {
    const agentName = document.getElementById('agentName').value;
    const agentPersonality = document.getElementById('agentPersonality').value;
    const voiceStyle = document.getElementById('voiceStyle').value;
    const greeting = document.getElementById('greeting').value;
    
    const config = {
        name: agentName,
        personality: agentPersonality,
        voiceStyle: voiceStyle,
        greeting: greeting,
        questions: getQuestionList()
    };
    
    console.log('Saving configuration:', config);
    
    // In a real implementation, this would save to backend
    showNotification('Configuration saved successfully!', 'success');
}

// Get current question list
function getQuestionList() {
    const questions = [];
    document.querySelectorAll('.question-item input').forEach(input => {
        if (input.value.trim()) {
            questions.push(input.value.trim());
        }
    });
    return questions;
}

// Test agent configuration
function testAgent() {
    showNotification('Opening test agent in new window...', 'info');
    setTimeout(() => {
        window.open('voice-interface.html', '_blank');
    }, 1000);
}

// Add new question to the list
function addQuestion() {
    const questionList = document.querySelector('.question-list');
    const questionItem = document.createElement('div');
    questionItem.className = 'question-item';
    questionItem.innerHTML = `
        <input type="text" placeholder="Enter your question..." />
        <button class="remove-btn" onclick="removeQuestion(this)">×</button>
    `;
    
    questionList.insertBefore(questionItem, document.querySelector('.add-question-btn'));
}

// Remove question from the list
function removeQuestion(button) {
    button.parentElement.remove();
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Initialize admin panel
function initializeAdmin() {
    // Set up event listeners
    document.querySelector('.add-question-btn').addEventListener('click', addQuestion);
    
    // Load initial data
    loadDashboardData();
    
    // Set up auto-refresh for dashboard
    setInterval(() => {
        if (currentSection === 'dashboard') {
            loadDashboardData();
        }
    }, 30000); // Refresh every 30 seconds
}

// Handle workflow actions
function editWorkflow(workflowId) {
    showNotification('Opening workflow editor...', 'info');
    // In real implementation, this would open n8n workflow editor
}

function viewWorkflowInN8n(workflowId) {
    showNotification('Opening n8n interface...', 'info');
    // In real implementation, this would open n8n in new tab
}

function activateWorkflow(workflowId) {
    showNotification('Activating workflow...', 'info');
    // In real implementation, this would activate the workflow via API
}

// Handle integration actions
function configureIntegration(integrationName) {
    showNotification(`Opening ${integrationName} configuration...`, 'info');
    // In real implementation, this would open integration settings
}

function connectIntegration(integrationName) {
    showNotification(`Connecting to ${integrationName}...`, 'info');
    // In real implementation, this would start OAuth flow or API key setup
}

// Export leads to CSV
function exportLeads() {
    showNotification('Preparing CSV export...', 'info');
    
    // Simulate CSV generation
    setTimeout(() => {
        const csvContent = generateLeadsCSV();
        downloadCSV(csvContent, 'leads-export.csv');
        showNotification('CSV export completed!', 'success');
    }, 2000);
}

// Generate CSV content for leads
function generateLeadsCSV() {
    const leads = [
        ['Name', 'Email', 'Phone', 'Status', 'Source', 'Date'],
        ['John Smith', 'john@example.com', '+1-555-0123', 'Qualified', 'Facebook Ad', '2024-01-15'],
        ['Sarah Johnson', 'sarah@example.com', '+1-555-0124', 'Pending', 'Google Ad', '2024-01-15'],
        ['Mike Wilson', 'mike@example.com', '+1-555-0125', 'Qualified', 'LinkedIn Ad', '2024-01-14']
    ];
    
    return leads.map(row => row.join(',')).join('\n');
}

// Download CSV file
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', initializeAdmin);

// Add notification styles
const adminStyle = document.createElement('style');
adminStyle.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    }
    
    .notification.success {
        background: #27ae60;
    }
    
    .notification.info {
        background: #3498db;
    }
    
    .notification.warning {
        background: #f39c12;
    }
    
    .notification.error {
        background: #e74c3c;
    }
    
    .notification button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: 15px;
    }
    
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
`;
document.head.appendChild(adminStyle);
```

```
