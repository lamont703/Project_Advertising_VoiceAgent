// Main page JavaScript functionality

let isListening = false;
let recognition = null;

// Initialize speech recognition if available
function initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = function() {
            isListening = true;
            updateButtonState();
        };
        
        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            handleUserSpeech(transcript);
        };
        
        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            isListening = false;
            updateButtonState();
        };
        
        recognition.onend = function() {
            isListening = false;
            updateButtonState();
        };
    } else {
        console.warn('Speech recognition not supported in this browser');
    }
}

// Start voice conversation
function startVoiceConversation() {
    // Immediately redirect to voice interface - agent will greet user there
    window.location.href = 'voice-interface.html';
}

// Simulate voice start for demo purposes
function simulateVoiceStart() {
    isListening = true;
    updateButtonState();
    
    // Simulate listening for 3 seconds
    setTimeout(() => {
        handleUserSpeech("I need help with digital marketing for my business");
    }, 3000);
}

// Handle user speech input
function handleUserSpeech(transcript) {
    console.log('User said:', transcript);
    
    // Store the initial input
    sessionStorage.setItem('initialUserInput', transcript);
    
    // Redirect to voice interface
    window.location.href = 'voice-interface.html';
}

// Update button state based on listening status
function updateButtonState() {
    const button = document.getElementById('talkButton');
    const statusText = document.getElementById('statusText');
    
    if (isListening) {
        button.classList.add('listening');
        button.querySelector('.button-text').textContent = 'Listening...';
        statusText.textContent = 'I\'m listening to you now...';
    } else {
        button.classList.remove('listening');
        button.querySelector('.button-text').textContent = 'Tap to Speak';
        statusText.textContent = 'Tap the button and start speaking';
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSpeechRecognition();
    
    // Add some interactive animations
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        feature.style.animationDelay = `${index * 0.2}s`;
        feature.classList.add('fade-in');
    });
});

// Add CSS animation class dynamically
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeInUp 0.6s ease forwards;
        opacity: 0;
        transform: translateY(20px);
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Handle browser back button
window.addEventListener('popstate', function(event) {
    // Clean up any ongoing speech recognition
    if (recognition && isListening) {
        recognition.stop();
    }
});

// Add touch feedback for mobile
document.addEventListener('touchstart', function() {}, {passive: true}); 