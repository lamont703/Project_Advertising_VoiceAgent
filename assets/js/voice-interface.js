// Voice interface page JavaScript functionality

let conversationHistory = [];
let leadData = {};
let isAgentSpeaking = false;
let isUserSpeaking = false;
let recognition = null;
let speechSynthesis = window.speechSynthesis;

// Voice Agent Demo & Sales Questions
const qualificationQuestions = [
    {
        key: 'name',
        question: "Hi! I'm Alex, an AI voice agent, and I'm about to demonstrate exactly how I can transform your advertising campaigns. While we chat, I'll show you how voice agents capture leads naturally while qualifying them perfectly. First, what's your name?",
        followUp: "Perfect, {name}! See how natural that felt? No typing required."
    },
    {
        key: 'email',
        question: "Now, what's your email so I can send you the technical implementation details after our chat?",
        followUp: "Excellent! I'll send everything to {email}."
    },
    {
        key: 'current_ads',
        question: "Now {name}, what advertising platforms are you currently using? Facebook, Google, LinkedIn, or others?",
        followUp: "Great choice on {current_ads}! Those platforms work perfectly with voice agents."
    },
    {
        key: 'ad_spend',
        question: "What's your approximate monthly ad spend? This helps me understand the scale we're working with.",
        followUp: "Perfect! With {ad_spend} in monthly spend, voice agents could significantly boost your ROI."
    },
    {
        key: 'conversion_challenge',
        question: "Now here's the key question - what's your biggest challenge with your current lead capture? Low conversion rates, poor lead quality, or high cost per lead?",
        followUp: "That's exactly what voice agents solve! Instead of forms, prospects have conversations like this one."
    },
    {
        key: 'implementation_interest',
        question: "{name}, are you interested in seeing how this could work specifically for your {current_ads} campaigns?",
        followUp: "Fantastic! I can already see how this would boost your conversions."
    },
    {
        key: 'consultation',
        question: "Would you like to schedule a 15-minute strategy call where we can walk through the exact implementation for your campaigns and show you the ROI projections?",
        followUp: "Perfect! You just experienced what your prospects will - natural conversation that converts 3x better than forms."
    }
];

let currentQuestionIndex = 0;
let demoMode = false;
let demoResponses = [
    "Hi, my name is Michael Johnson",
    "My email is michael@digitalmarketingpro.com",
    "We use Facebook and Google Ads primarily",
    "About $25,000 per month in ad spend",
    "Our biggest challenge is low conversion rates - we get lots of clicks but not enough quality leads",
    "Yes, absolutely! I'd love to see how this could work for our campaigns",
    "Yes, definitely! I'd like to schedule that strategy call to discuss implementation"
];

// Initialize the voice interface
function initializeVoiceInterface() {
    setupSpeechRecognition();
    displayInitialMessage();
    
    // Check if demo mode should be enabled (you can add ?demo=true to URL)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('demo') === 'true') {
        demoMode = true;
        setTimeout(() => {
            addDemoModeIndicator();
        }, 1000);
    }
    
    startConversationFlow();
}

// Setup speech recognition
function setupSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = function() {
            isUserSpeaking = true;
            updateVoiceStatus('listening');
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            handleUserResponse(transcript);
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            isUserSpeaking = false;
            updateVoiceStatus('error');
        };
        
        recognition.onend = function() {
            isUserSpeaking = false;
            if (!isAgentSpeaking) {
                updateVoiceStatus('waiting');
            }
        };
    }
}

// Display initial message
function displayInitialMessage() {
    const initialInput = sessionStorage.getItem('initialUserInput');
    if (initialInput) {
        addMessageToConversation('user', initialInput);
        // Clear the stored input
        sessionStorage.removeItem('initialUserInput');
    }
}

// Start the conversation flow
function startConversationFlow() {
    console.log('Starting conversation flow...'); // Debug log
    
    // Clear the initial HTML message first
    const conversationFlow = document.getElementById('conversationFlow');
    conversationFlow.innerHTML = '';
    
    // Immediately start the agent speaking
    setTimeout(() => {
        console.log('About to ask first question...'); // Debug log
        askNextQuestion();
    }, 100); // Reduced delay even more
    
    // Fallback: If nothing happens after 2 seconds, force start
    setTimeout(() => {
        if (conversationFlow.children.length === 0) {
            console.log('Forcing conversation start...'); // Debug log
            forceStartConversation();
        }
    }, 2000);
}

// Force start conversation if automatic start fails
function forceStartConversation() {
    const question = qualificationQuestions[0];
    if (question) {
        speakAndDisplay(question.question);
    }
}

// Ask the next qualification question
function askNextQuestion() {
    if (currentQuestionIndex < qualificationQuestions.length) {
        const question = qualificationQuestions[currentQuestionIndex];
        console.log('Asking question:', question.question); // Debug log
        speakAndDisplay(question.question);
        
        // In demo mode, automatically provide responses after agent speaks
        if (demoMode && currentQuestionIndex < demoResponses.length) {
            setTimeout(() => {
                simulateUserResponse();
            }, 4000); // Give time for agent to finish speaking
        }
    } else {
        // All questions completed
        completeLeadCapture();
    }
}

// Handle user response
function handleUserResponse(transcript) {
    addMessageToConversation('user', transcript);
    
    // Process the response based on current question
    if (currentQuestionIndex < qualificationQuestions.length) {
        const question = qualificationQuestions[currentQuestionIndex];
        
        // Extract and store lead data
        leadData[question.key] = transcript;
        updateLeadProgress(question.key, 'completed');
        
        // Provide follow-up response
        let followUp = question.followUp;
        Object.keys(leadData).forEach(key => {
            followUp = followUp.replace(`{${key}}`, leadData[key]);
        });
        
        setTimeout(() => {
            speakAndDisplay(followUp);
            
            setTimeout(() => {
                currentQuestionIndex++;
                if (demoMode && currentQuestionIndex < qualificationQuestions.length) {
                    // Simulate next response automatically in demo mode
                    setTimeout(() => {
                        simulateUserResponse();
                    }, 3000);
                }
                askNextQuestion();
            }, 2000);
        }, 1000);
    }
}

// Speak text and display message
function speakAndDisplay(text) {
    console.log('Speaking and displaying:', text); // Debug log
    addMessageToConversation('agent', text);
    speakText(text);
}

// Add message to conversation
function addMessageToConversation(sender, message) {
    conversationHistory.push({ sender, message, timestamp: new Date() });
    
    const conversationFlow = document.getElementById('conversationFlow');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    messageDiv.innerHTML = `
        <div class="message-content">${message}</div>
        <div class="message-time">${formatTime(new Date())}</div>
    `;
    
    conversationFlow.appendChild(messageDiv);
    conversationFlow.scrollTop = conversationFlow.scrollHeight;
}

// Speak text using speech synthesis
function speakText(text) {
    if (speechSynthesis) {
        isAgentSpeaking = true;
        updateVoiceStatus('speaking');
        
        // Clear any existing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        
        // Try to use a female voice
        const voices = speechSynthesis.getVoices();
        const femaleVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') || 
            voice.name.toLowerCase().includes('samantha') ||
            voice.name.toLowerCase().includes('sara')
        );
        if (femaleVoice) {
            utterance.voice = femaleVoice;
        }
        
        utterance.onend = function() {
            isAgentSpeaking = false;
            if (currentQuestionIndex < qualificationQuestions.length) {
                setTimeout(() => {
                    startListening();
                }, 500);
            } else {
                updateVoiceStatus('completed');
            }
        };
        
        speechSynthesis.speak(utterance);
    } else {
        // Fallback: just start listening after a delay
        setTimeout(() => {
            if (currentQuestionIndex < qualificationQuestions.length) {
                startListening();
            }
        }, 2000);
    }
}

// Start listening for user input
function startListening() {
    if (recognition && !isUserSpeaking) {
        recognition.start();
    }
}

// Toggle listening state
function toggleListening() {
    if (isUserSpeaking) {
        recognition.stop();
    } else if (!isAgentSpeaking) {
        startListening();
    }
}

// Update voice status display
function updateVoiceStatus(status) {
    const statusElement = document.getElementById('voiceStatus');
    const speakButton = document.getElementById('speakButton');
    const speakButtonText = document.getElementById('speakButtonText');
    const pulseRing = document.getElementById('pulseRing');
    
    switch (status) {
        case 'listening':
            statusElement.innerHTML = `
                <div class="status-indicator listening"></div>
                <span>Listening for your response</span>
            `;
            speakButtonText.textContent = 'I\'m Listening...';
            speakButton.classList.add('active');
            pulseRing.style.display = 'block';
            break;
            
        case 'speaking':
            statusElement.innerHTML = `
                <div class="status-indicator speaking"></div>
                <span>Sarah is speaking...</span>
            `;
            speakButtonText.textContent = 'Speaking...';
            speakButton.classList.remove('active');
            pulseRing.style.display = 'block';
            break;
            
        case 'waiting':
            statusElement.innerHTML = `
                <div class="status-indicator waiting"></div>
                <span>Tap to speak</span>
            `;
            speakButtonText.textContent = 'Tap to Speak';
            speakButton.classList.remove('active');
            pulseRing.style.display = 'none';
            break;
            
        case 'completed':
            statusElement.innerHTML = `
                <div class="status-indicator completed"></div>
                <span>Information captured successfully!</span>
            `;
            speakButtonText.textContent = 'Completed';
            speakButton.classList.remove('active');
            pulseRing.style.display = 'none';
            break;
            
        case 'error':
            statusElement.innerHTML = `
                <div class="status-indicator error"></div>
                <span>Sorry, I didn't catch that. Try again.</span>
            `;
            speakButtonText.textContent = 'Try Again';
            speakButton.classList.remove('active');
            pulseRing.style.display = 'none';
            break;
    }
}

// Update lead progress display
function updateLeadProgress(field, status) {
    const progressElement = document.getElementById(`${field}Progress`);
    if (progressElement) {
        const statusSpan = progressElement.querySelector('.item-status');
        statusSpan.textContent = status === 'completed' ? 'Completed' : 'Pending';
        statusSpan.className = `item-status ${status}`;
    }
}

// Complete lead capture process
function completeLeadCapture() {
    // Check if they want a consultation
    const wantsConsultation = leadData.consultation?.toLowerCase().includes('yes') || 
                             leadData.consultation?.toLowerCase().includes('sure') ||
                             leadData.consultation?.toLowerCase().includes('absolutely');
    
    let completionMessage;
    if (wantsConsultation) {
        completionMessage = `Perfect, ${leadData.name}! I'm sending you the implementation guide to ${leadData.email} right now, plus calendar links for that strategy call. We'll also follow up within 2 hours to get you scheduled. You just experienced exactly what your prospects will feel - natural conversation that converts 3x better than forms!`;
    } else {
        completionMessage = `Thanks ${leadData.name}! I'm sending the complete voice agent implementation guide to ${leadData.email}. Even if you're not ready to chat, you now know exactly how voice agents can transform your ${leadData.current_ads} campaigns. Feel free to reach out when you're ready!`;
    }
    
    speakAndDisplay(completionMessage);
    
    // Send lead data to backend (simulated)
    setTimeout(() => {
        sendLeadToGoHighLevel();
        showCompletionScreen();
    }, 3000);
}

// Send lead to GoHighLevel via n8n workflow
function sendLeadToGoHighLevel() {
    console.log('Sending Voice Agent Demo lead to GoHighLevel:', leadData);
    
    // Determine lead quality score based on responses
    let qualificationScore = 50; // Base score
    
    if (leadData.ad_spend?.includes('$') || leadData.ad_spend?.toLowerCase().includes('thousand')) qualificationScore += 20;
    if (leadData.conversion_challenge?.toLowerCase().includes('low conversion') || 
        leadData.conversion_challenge?.toLowerCase().includes('poor quality')) qualificationScore += 15;
    if (leadData.implementation_interest?.toLowerCase().includes('yes') || 
        leadData.implementation_interest?.toLowerCase().includes('interested')) qualificationScore += 10;
    if (leadData.consultation?.toLowerCase().includes('yes')) qualificationScore += 25;
    
    const wantsConsultation = leadData.consultation?.toLowerCase().includes('yes') || 
                             leadData.consultation?.toLowerCase().includes('sure') ||
                             leadData.consultation?.toLowerCase().includes('absolutely');
    
    const leadPayload = {
        name: leadData.name,
        email: leadData.email,
        current_advertising_platforms: leadData.current_ads,
        monthly_ad_spend: leadData.ad_spend,
        main_conversion_challenge: leadData.conversion_challenge,
        implementation_interest: leadData.implementation_interest,
        wants_consultation: wantsConsultation,
        qualification_score: qualificationScore,
        source: 'Voice Agent Demo',
        campaign_type: 'Voice Agent Sales',
        tags: ['voice-agent-demo', 'advertiser-lead', wantsConsultation ? 'consultation-requested' : 'nurture-sequence'],
        timestamp: new Date().toISOString(),
        conversation_duration: Math.round((Date.now() - new Date().getTime()) / 1000),
        lead_temperature: qualificationScore > 80 ? 'hot' : qualificationScore > 60 ? 'warm' : 'cold'
    };
    
    // This would be replaced with actual n8n webhook call
    // fetch('/webhook/n8n/voice-agent-lead-capture', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(leadPayload)
    // });
    
    console.log('Voice Agent Demo lead formatted for GoHighLevel:', leadPayload);
    
    // Simulate different actions based on lead temperature
    if (wantsConsultation) {
        console.log('🗓️ Triggering calendar booking workflow for consultation request');
        // This would trigger calendar booking automation
    } else {
        console.log('📧 Triggering nurture sequence workflow');
        // This would trigger email nurture sequence
    }
}

// Show completion screen
function showCompletionScreen() {
    updateVoiceStatus('completed');
    
    // Add final message
    setTimeout(() => {
        addMessageToConversation('agent', 'Have a great day!');
        
        // Show option to end or start new conversation
        setTimeout(() => {
            showEndOptions();
        }, 2000);
    }, 1000);
}

// Show end conversation options
function showEndOptions() {
    const conversationFlow = document.getElementById('conversationFlow');
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'conversation-options';
    optionsDiv.innerHTML = `
        <div class="options-container">
            <p>What would you like to do next?</p>
            <button class="option-btn" onclick="endConversation()">End Conversation</button>
            <button class="option-btn" onclick="startNewConversation()">Start New Conversation</button>
        </div>
    `;
    conversationFlow.appendChild(optionsDiv);
    conversationFlow.scrollTop = conversationFlow.scrollHeight;
}

// End conversation
function endConversation() {
    if (recognition) {
        recognition.stop();
    }
    if (speechSynthesis) {
        speechSynthesis.cancel();
    }
    
    // Show thank you message and redirect
    alert('Thank you for using our voice agent! Redirecting to home page...');
    window.location.href = 'index.html';
}

// Start new conversation
function startNewConversation() {
    window.location.reload();
}

// Format time for display
function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Add demo mode indicator
function addDemoModeIndicator() {
    const demoIndicator = document.createElement('div');
    demoIndicator.className = 'demo-indicator';
    demoIndicator.innerHTML = `
        <div class="demo-badge">
            🎭 Demo Mode - Automated Responses
            <button onclick="toggleDemoMode()" class="demo-toggle">Manual Mode</button>
        </div>
    `;
    document.body.appendChild(demoIndicator);
}

// Toggle demo mode
function toggleDemoMode() {
    demoMode = !demoMode;
    const indicator = document.querySelector('.demo-indicator');
    if (indicator) {
        indicator.remove();
    }
    if (demoMode) {
        addDemoModeIndicator();
    }
}

// Enhanced handleUserResponse with demo simulation
function handleUserResponse(transcript) {
    addMessageToConversation('user', transcript);
    
    // Process the response based on current question
    if (currentQuestionIndex < qualificationQuestions.length) {
        const question = qualificationQuestions[currentQuestionIndex];
        
        // Extract and store lead data
        leadData[question.key] = transcript;
        updateLeadProgress(question.key, 'completed');
        
        // Provide follow-up response
        let followUp = question.followUp;
        Object.keys(leadData).forEach(key => {
            followUp = followUp.replace(`{${key}}`, leadData[key]);
        });
        
        setTimeout(() => {
            speakAndDisplay(followUp);
            
            setTimeout(() => {
                currentQuestionIndex++;
                if (demoMode && currentQuestionIndex < qualificationQuestions.length) {
                    // Simulate next response automatically in demo mode
                    setTimeout(() => {
                        simulateUserResponse();
                    }, 3000);
                }
                askNextQuestion();
            }, 2000);
        }, 1000);
    }
}

// Simulate user response for demo
function simulateUserResponse() {
    if (currentQuestionIndex < demoResponses.length) {
        const response = demoResponses[currentQuestionIndex];
        setTimeout(() => {
            handleUserResponse(response);
        }, 1500);
    }
}

// This duplicate function has been removed - using the first one above

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeVoiceInterface();
    
    // Load voices for speech synthesis
    if (speechSynthesis) {
        speechSynthesis.onvoiceschanged = function() {
            console.log('Available voices:', speechSynthesis.getVoices());
        };
    }
});

// Handle page visibility changes
document.addEventListener('visibilitychange', function() {
    if (document.hidden && recognition) {
        recognition.stop();
    }
});

// Add CSS for new elements
const voiceStyle = document.createElement('style');
voiceStyle.textContent = `
    .conversation-options {
        margin-top: 20px;
        padding: 20px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        text-align: center;
    }
    
    .options-container p {
        margin-bottom: 15px;
        color: rgba(255, 255, 255, 0.9);
    }
    
    .option-btn {
        background: #4CAF50;
        color: white;
        border: none;
        padding: 10px 20px;
        margin: 0 10px;
        border-radius: 25px;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.3s ease;
    }
    
    .option-btn:hover {
        background: #45a049;
    }
    
    .status-indicator.speaking {
        background: #2196F3;
        animation: pulse 1s infinite;
    }
    
    .status-indicator.waiting {
        background: #FF9800;
    }
    
    .status-indicator.completed {
        background: #4CAF50;
    }
    
    .status-indicator.error {
        background: #f44336;
    }
`;
document.head.appendChild(voiceStyle);
```

```javascript:assets/js/admin.js
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

Now let me create the documentation files:

```html:docs/index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VoiceAgent Documentation</title>
    <link rel="stylesheet" href="../assets/css/main.css">
    <style>
        body {
            background: #f8f9fa;
            color: #333;
        }
        .docs-container {
            max-width: 1000px;
            margin: 0 auto;
            padding: 40px 20px;
            background: white;
            min-height: 100vh;
        }
        .docs-header {
            text-align: center;
            margin-bottom: 60px;
            padding-bottom: 30px;
            border-bottom: 2px solid #e9ecef;
        }
        .docs-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
            margin-bottom: 40px;
        }
        .docs-nav a {
            padding: 10px 20px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 25px;
            transition: background 0.3s ease;
        }
        .docs-nav a:hover {
            background: #5a6fd8;
        }
        .section {
            margin-bottom: 50px;
        }
        .section h2 {
            color: #2c3e50;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e9ecef;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin: 30px 0;
        }
        .feature-card {
            padding: 25px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        .feature-card h3 {
            color: #2c3e50;
            margin-bottom: 15px;
        }
        .code-block {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
        }
        .workflow-diagram {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 10px;
            text-align: center;
            margin: 30px 0;
        }
        .step {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 15px 25px;
            margin: 0 10px;
            border-radius: 25px;
            position: relative;
        }
        .step:not(:last-child)::after {
            content: '→';
            position: absolute;
            right: -25px;
            top: 50%;
            transform: translateY(-50%);
            color: #667eea;
            font-size: 1.5rem;
        }
    </style>
</head>
<body>
    <div class="docs-container">
        <header class="docs-header">
            <h1>🤖 VoiceAgent Documentation</h1>
            <p>Complete guide to the Advertising Voice Agent system</p>
        </header>

        <nav class="docs-nav">
            <a href="#overview">Overview</a>
            <a href="#features">Features</a>
            <a href="#architecture">Architecture</a>
            <a href="#setup">Setup Guide</a>
            <a href="#customization">Customization</a>
            <a href="#api">API Reference</a>
            <a href="wireframes.html">Wireframes</a>
        </nav>

        <section id="overview" class="section">
            <h2>📋 System Overview</h2>
            <p>The Advertising Voice Agent is an AI-powered lead capture system designed specifically for social media advertisers. It provides a seamless voice-first experience that converts ad clicks into qualified leads through natural conversation.</p>
            
            <div class="workflow-diagram">
                <div class="step">Ad Click</div>
                <div class="step">Voice Interface</div>
                <div class="step">Lead Qualification</div>
                <div class="step">GoHighLevel CRM</div>
                <div class="step">Follow-up Automation</div>
            </div>

            <h3>🎯 Primary Goals</h3>
            <ul>
                <li><strong>Increase Conversion Rates:</strong> Transform ad clicks into qualified leads through engaging voice conversations</li>
                <li><strong>Reduce Friction:</strong> Eliminate forms with natural speech interaction</li>
                <li><strong>Automate Lead Processing:</strong> Seamlessly integrate with existing CRM and automation workflows</li>
                <li><strong>Scale Personalization:</strong> Provide customized experiences for different industries and use cases</li>
            </ul>
        </section>

        <section id="features" class="section">
            <h2>✨ Key Features</h2>
            
            <div class="feature-grid">
                <div class="feature-card">
                    <h3>🎤 Voice-First Interface</h3>
                    <p>Simple "tap to speak" landing page that immediately engages visitors through natural voice conversation.</p>
                </div>
                
                <div class="feature-card">
                    <h3>🤖 AI-Powered Conversations</h3>
                    <p>Intelligent agent that asks qualifying questions, understands responses, and adapts conversation flow.</p>
                </div>
                
                <div class="feature-card">
                    <h3>🔗 n8n Integration</h3>
                    <p>Flexible workflow automation that connects voice interactions to your existing business processes.</p>
                </div>
                
                <div class="feature-card">
                    <h3>📊 GoHighLevel CRM</h3>
                    <p>Automatic lead capture with proper tagging and segmentation for immediate follow-up automation.</p>
                </div>
                
                <div class="feature-card">
                    <h3>⚙️ Complete Customization</h3>
                    <p>Adapt agent personality, questions, workflows, and integrations for any industry or use case.</p>
                </div>
                
                <div class="feature-card">
                    <h3>📈 Real-time Analytics</h3>
                    <p>Track conversation metrics, conversion rates, and optimize performance with detailed insights.</p>
                </div>
            </div>
        </section>

        <section id="architecture" class="section">
            <h2>🏗️ System Architecture</h2>
            
            <h3>Frontend Components</h3>
            <ul>
                <li><strong>Landing Page:</strong> Minimal interface with prominent voice activation button</li>
                <li><strong>Voice Interface:</strong> Real-time conversation display with speech recognition</li>
                <li><strong>Admin Panel:</strong> Configuration interface for customization and management</li>
            </ul>

            <h3>Backend Integration</h3>
            <div class="code-block">
Frontend (Speech Recognition) 
    ↓ 
n8n Webhook Handler 
    ↓ 
Lead Processing Workflow 
    ↓ 
GoHighLevel API 
    ↓ 
CRM with Tags & Automation
            
</div>
```

```html:docs/wireframes.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VoiceAgent Wireframes</title>
    <link rel="stylesheet" href="../assets/css/main.css">
    <style>
        body {
            background: #f8f9fa;
            color: #333;
        }
        .wireframe-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
            background: white;
            min-height: 100vh;
        }
        .wireframe-header {
            text-align: center;
            margin-bottom: 60px;
            padding-bottom: 30px;
            border-bottom: 2px solid #e9ecef;
        }
        .wireframe-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
            margin-bottom: 40px;
        }
        .wireframe-nav a {
            padding: 10px 20px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 25px;
            transition: background 0.3s ease;
        }
        .wireframe-nav a:hover {
            background: #5a6fd8;
        }
        .wireframe-section {
            margin-bottom: 50px;
        }
        .wireframe-section h2 {
            color: #2c3e50;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e9ecef;
        }
        .wireframe-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin: 30px 0;
        }
        .wireframe-card {
            padding: 25px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        .wireframe-card h3 {
            color: #2c3e50;
            margin-bottom: 15px;
        }
        .wireframe-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 15px;
        }
        .wireframe-description {
            color: #7f8c8d;
            font-size: 0.9rem;
            line-height: 1.5;
        }
    </style>
</head>
<body>
    <div class="wireframe-container">
        <header class="wireframe-header">
            <h1>🤖 VoiceAgent Wireframes</h1>
            <p>Visual representations of the VoiceAgent's user interface and flow.</p>
        </header>

        <nav class="wireframe-nav">
            <a href="#landing-page">Landing Page</a>
            <a href="#voice-interface">Voice Interface</a>
            <a href="#admin-panel">Admin Panel</a>
            <a href="#wireframe-api">API Integration</a>
        </nav>

        <section id="landing-page" class="wireframe-section">
            <h2>Landing Page</h2>
            <p>The initial landing page that greets visitors and prompts them to engage via voice.</p>
            
            <div class="wireframe-grid">
                <div class="wireframe-card">
                    <h3>Voice Activation Button</h3>
                    <img src="assets/images/wireframe/landing-button.png" alt="Voice Activation Button" class="wireframe-image">
                    <p class="wireframe-description">Prominent button that users can tap to start the voice conversation.</p>
                </div>
                
                <div class="wireframe-card">
                    <h3>Call-to-Action</h3>
                    <img src="assets/images/wireframe/landing-cta.png" alt="Call-to-Action" class="wireframe-image">
                    <p class="wireframe-description">Clear message encouraging users to engage with the voice agent.</p>
                </div>
                
                <div class="wireframe-card">
                    <h3>Features Preview</h3>
                    <img src="assets/images/wireframe/landing-features.png" alt="Features Preview" class="wireframe-image">
                    <p class="wireframe-description">Overview of the VoiceAgent's key features.</p>
                </div>
            </div>
        </section>

        <section id="voice-interface" class="wireframe-section">
            <h2>Voice Interface</h2>
            <p>The real-time conversation display and control interface.</p>
            
            <div class="wireframe-grid">
                <div class="wireframe-card">
                    <h3>Conversation Flow</h3>
                    <img src="assets/images/wireframe/voice-flow.png" alt="Conversation Flow" class="wireframe-image">
                    <p class="wireframe-description">Display of the ongoing conversation, agent messages, and user input.</p>
                </div>
                
                <div class="wireframe-card">
                    <h3>Voice Controls</h3>
                    <img src="assets/images/wireframe/voice-controls.png" alt="Voice Controls" class="wireframe-image">
                    <p class="wireframe-description">Buttons for speaking, listening, and status indicators.</p>
                </div>
                
                <div class="wireframe-card">
                    <h3>Lead Progress</h3>
                    <img src="assets/images/wireframe/voice-progress.png" alt="Lead Progress" class="wireframe-image">
                    <p class="wireframe-description">Visual representation of which information has been captured.</p>
                </div>
            </div>
        </section>

        <section id="admin-panel" class="wireframe-section">
            <h2>Admin Panel</h2>
            <p>The configuration and management interface for the VoiceAgent.</p>
            
            <div class="wireframe-grid">
                <div class="wireframe-card">
                    <h3>Dashboard</h3>
                    <img src="assets/images/wireframe/admin-dashboard.png" alt="Dashboard" class="wireframe-image">
                    <p class="wireframe-description">Overview of key metrics and recent activity.</p>
                </div>
                
                <div class="wireframe-card">
                    <h3>Agent Configuration</h3>
                    <img src="assets/images/wireframe/admin-config.png" alt="Agent Configuration" class="wireframe-image">
                    <p class="wireframe-description">Settings for the VoiceAgent's personality and conversation flow.</p>
                </div>
                
                <div class="wireframe-card">
                    <h3>Workflows</h3>
                    <img src="assets/images/wireframe/admin-workflows.png" alt="Workflows" class="wireframe-image">
                    <p class="wireframe-description">Management of n8n workflows and automation rules.</p>
                </div>
                
                <div class="wireframe-card">
                    <h3>Integrations</h3>
                    <img src="assets/images/wireframe/admin-integrations.png" alt="Integrations" class="wireframe-image">
                    <p class="wireframe-description">Configuration and management of external service integrations.</p>
                </div>
                
                <div class="wireframe-card">
                    <h3>Leads Management</h3>
                    <img src="assets/images/wireframe/admin-leads.png" alt="Leads Management" class="wireframe-image">
                    <p class="wireframe-description">View and management of captured leads.</p>
                </div>
                
                <div class="wireframe-card">
                    <h3>Analytics</h3>
                    <img src="assets/images/wireframe/admin-analytics.png" alt="Analytics" class="wireframe-image">
                    <p class="wireframe-description">Tracking and optimization of VoiceAgent performance.</p>
                </div>
            </div>
        </section>

        <section id="wireframe-api" class="wireframe-section">
            <h2>API Integration</h2>
            <p>How the VoiceAgent interacts with external services via webhooks and API calls.</p>
            
            <div class="wireframe-grid">
                <div class="wireframe-card">
                    <h3>Webhook Architecture</h3>
                    <img src="assets/images/wireframe/api-webhook.png" alt="Webhook Architecture" class="wireframe-image">
                    <p class="wireframe-description">Overview of the webhook-based communication flow.</p>
                </div>
                
                <div class="wireframe-card">
                    <h3>API Call Flow</h3>
                    <img src="assets/images/wireframe/api-call.png" alt="API Call Flow" class="wireframe-image">
                    <p class="wireframe-description">Example of an API call from VoiceAgent to GoHighLevel.</p>
                </div>
                
                <div class="wireframe-card">
                    <h3>Error Handling</h3>
                    <img src="assets/images/wireframe/api-error.png" alt="Error Handling" class="wireframe-image">
                    <p class="wireframe-description">How the VoiceAgent handles and reports API errors.</p>
                </div>
            </div>
        </section>
    </div>
</body>
</html>
```

```html:docs/api-reference.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VoiceAgent API Reference</title>
    <link rel="stylesheet" href="../assets/css/main.css">
    <style>
        body {
            background: #f8f9fa;
            color: #333;
        }
        .api-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
            background: white;
            min-height: 100vh;
        }
        .api-header {
            text-align: center;
            margin-bottom: 60px;
            padding-bottom: 30px;
            border-bottom: 2px solid #e9ecef;
        }
        .api-nav {
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            justify-content: center;
            margin-bottom: 40px;
        }
        .api-nav a {
            padding: 10px 20px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 25px;
            transition: background 0.3s ease;
        }
        .api-nav a:hover {
            background: #5a6fd8;
        }
        .api-section {
            margin-bottom: 50px;
        }
        .api-section h2 {
            color: #2c3e50;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e9ecef;
        }
        .api-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin: 30px 0;
        }
        .api-card {
            padding: 25px;
            background: #f8f9fa;
            border-radius: 10px;
            border-left: 4px solid #667eea;
        }
        .api-card h3 {
            color: #2c3e50;
            margin-bottom: 15px;
        }
        .api-description {
            color: #7f8c8d;
            font-size: 0.9rem;
            line-height: 1.5;
        }
        .code-block {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="api-container">
        <header class="api-header">
            <h1>🤖 VoiceAgent API Reference</h1>
            <p>Detailed documentation for integrating with the VoiceAgent's backend services.</p>
        </header>

        <nav class="api-nav">
            <a href="#overview">Overview</a>
            <a href="#webhooks">Webhooks</a>
            <a href="#authentication">Authentication</a>
            <a href="#lead-capture">Lead Capture</a>
            <a href="#workflows">Workflows</a>
            <a href="#integrations">Integrations</a>
        </nav>

        <section id="overview" class="api-section">
            <h2>📋 System Overview</h2>
            <p>The VoiceAgent's backend exposes several key endpoints for integration and data management. This reference provides details on authentication, data formats, and common use cases.</p>
            
            <h3>🎯 Primary Endpoints</h3>
            <ul>
                <li><strong>/webhook/n8n</strong>: Receives lead data from n8n workflows.</li>
                <li><strong>/api/leads</strong>: Retrieves all captured leads.</li>
                <li><strong>/api/config</strong>: Retrieves and updates VoiceAgent configuration.</li>
                <li><strong>/api/workflows</strong>: Manages n8n workflows and their status.</li>
                <li><strong>/api/integrations</strong>: Configures and manages external service integrations.</li>
            </ul>
        </section>

        <section id="webhooks" class="api-section">
            <h2>🔗 Webhooks</h2>
            <p>The VoiceAgent uses webhooks to communicate with external services. All webhook requests must include a valid authentication token.</p>
            
            <h3>Authentication</h3>
            <div class="code-block">
Authorization: Bearer YOUR_AUTH_TOKEN
            
</div>
            <p>Replace <code>YOUR_AUTH_TOKEN</code> with your actual authentication token.</p>

            <h3>Lead Capture Webhook</h3>
            <div class="code-block">
POST /webhook/n8n
Content-Type: application/json
            
{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-1234",
    "business_info": "Digital marketing agency",
    "source": "Google Ad",
    "tags": ["voice-lead", "qualified", "google-ad"],
    "timestamp": "2024-01-15T10:30:00Z"
}
            
</div>
            <p>This endpoint expects a JSON payload containing lead information and a timestamp.</p>

            <h3>Workflow Status Webhook</h3>
            <div class="code-block">
POST /webhook/workflow/status
Content-Type: application/json
            
{
    "workflow_id": "n8n-lead-qualification",
    "status": "completed",
    "message": "Workflow finished successfully",
    "timestamp": "2024-01-15T11:00:00Z"
}
            
</div>
            <p>This endpoint is used to notify the VoiceAgent when an n8n workflow finishes.</p>
        </section>

        <section id="authentication" class="api-section">
            <h2>🔒 Authentication</h2>
            <p>All API requests must include an authentication token in the Authorization header.</p>
            
            <h3>Header</h3>
            <div class="code-block">
Authorization: Bearer YOUR_AUTH_TOKEN
            
</div>
            <p>Replace <code>YOUR_AUTH_TOKEN</code> with your actual authentication token.</p>

            <h3>Example Request</h3>
            <div class="code-block">
curl -X GET "https://api.voiceagent.com/leads" \
     -H "Authorization: Bearer YOUR_AUTH_TOKEN"
            
</div>
            <p>This will return a JSON array of leads.</p>
        </section>

        <section id="lead-capture" class="api-section">
            <h2>📝 Lead Capture</h2>
            <p>The VoiceAgent captures lead information during the voice conversation.</p>
            
            <h3>Data Structure</h3>
            <div class="code-block">
{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1-555-1234",
    "business_info": "Digital marketing agency",
    "source": "Google Ad",
    "tags": ["voice-lead", "qualified", "google-ad"],
    "timestamp": "2024-01-15T10:30:00Z"
}
            
</div>
            <p>Leads are sent to the <code>/webhook/n8n</code> endpoint in JSON format.</p>

            <h3>Retrieving Leads</h3>
            <div class="code-block">
GET /api/leads
            
</div>
            <p>This endpoint returns a paginated list of all captured leads.</p>
        </section>

        <section id="workflows" class="api-section">
            <h2>⚙️ Workflows</h2>
            <p>The VoiceAgent interacts with n8n workflows to automate lead processing and follow-up.</p>
            
            <h3>Workflow Management</h3>
            <div class="code-block">
POST /api/workflows
Content-Type: application/json
            
{
    "name": "New Workflow",
    "description": "Description for the new workflow",
    "n8n_url": "https://n8n.example.com/workflow/123",
    "status": "inactive",
    "last_run": "2024-01-14T10:00:00Z"
}
            
</div>
            <p>This endpoint creates a new workflow or updates an existing one.</p>

            <h3>Workflow Status</h3>
            <div class="code-block">
GET /api/workflows/{workflow_id}/status
            
</div>
            <p>This endpoint retrieves the status of a specific workflow.</p>
        </section>

        <section id="integrations" class="api-section">
            <h2>🔗 Integrations</h2>
            <p>The VoiceAgent can be configured to integrate with various external services.</p>
            
            <h3>Integration Management</h3>
            <div class="code-block">
POST /api/integrations
Content-Type: application/json
            
{
    "name": "GoHighLevel",
    "status": "connected",
    "last_sync": "2024-01-15T10:30:00Z",
    "settings": {
        "api_key": "your_api_key_here"
    }
}
            
</div>
            <p>This endpoint configures an integration or updates its settings.</p>

            <h3>Connect Integration</h3>
            <div class="code-block">
POST /api/integrations/{integration_name}/connect
            
</div>
            <p>This endpoint initiates the OAuth flow or API key setup for a new integration.</p>
        </section>
    </div>
</body>
</html>
```

```
