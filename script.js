// Daily Philosophical Debate - Main JavaScript

class PhilosophicalDebateApp {
    constructor() {
        this.chatMessages = [];
        this.currentDate = new Date();
        this.init();
    }

    init() {
        this.displayCurrentDate();
        this.displayDailyQuote();
        this.setupChatFunctionality();
        this.loadStoredMessages();
        this.setupCharacterCounter();
    }

    displayCurrentDate() {
        const dateDisplay = document.getElementById('dateDisplay');
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date().toLocaleDateString('en-US', options);
        dateDisplay.textContent = today;
    }

    // Generate a consistent daily quote based on the current date
    displayDailyQuote() {
        const today = new Date();
        const dayOfYear = this.getDayOfYear(today);
        
        // Use day of year as seed for consistent daily selection
        const quoteIndex = dayOfYear % philosophicalQuotes.length;
        const todaysQuote = philosophicalQuotes[quoteIndex];

        // Display the quote
        document.getElementById('dailyQuote').textContent = todaysQuote.quote;
        document.getElementById('quoteAuthor').textContent = todaysQuote.author;
        document.getElementById('quoteContext').innerHTML = `
            <strong>Background:</strong> ${todaysQuote.context}
            <br><br><strong>Topic:</strong> ${todaysQuote.topic}
        `;
    }

    // Calculate day of year (1-365/366)
    getDayOfYear(date) {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date - start;
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    // Setup chat functionality
    setupChatFunctionality() {
        const chatInput = document.getElementById('chatInput');
        const sendButton = document.getElementById('sendButton');

        // Send message on button click
        sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        // Send message on Enter key press
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    // Send a new message
    sendMessage() {
        const chatInput = document.getElementById('chatInput');
        const messageText = chatInput.value.trim();

        if (messageText === '') {
            return;
        }

        // Create message object
        const message = {
            id: Date.now(),
            author: this.getRandomName(),
            content: messageText,
            timestamp: new Date()
        };

        // Add to messages array
        this.chatMessages.push(message);

        // Display the message
        this.displayMessage(message);

        // Clear input
        chatInput.value = '';

        // Store messages in localStorage
        this.storeMessages();

        // Scroll to bottom
        this.scrollToBottom();
    }

    // Display a message in the chat
    displayMessage(message) {
        const chatMessages = document.getElementById('chatMessages');
        
        const messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerHTML = `
            <div class="avatar">${this.getRandomEmoji()}</div>
            <div class="message-bubble">
                <div class="message-author">${message.author}</div>
                <div class="message-content">${this.escapeHtml(message.content)}</div>
                <div class="message-time">${this.formatTime(message.timestamp)}</div>
            </div>
        `;

        chatMessages.appendChild(messageElement);
    }

    // Get random emoji for avatar
    getRandomEmoji() {
        const emojis = ['🤔', '🧠', '💭', '🤓', '🎭', '📚', '✨', '🔍', '💡', '🎨', '🌟', '🦉'];
        return emojis[Math.floor(Math.random() * emojis.length)];
    }

    // Generate a random name for demonstration (in real app, users would log in)
    getRandomName() {
        const names = [
            'wondering_soul', 'deep_thinker42', 'question_everything', 'socrates_fan',
            'mind_wanderer', 'curious_cat', 'philosophy_nerd', 'seeker_of_truth',
            'random_thoughts', 'brain_storms', 'wise_owl', 'thinking_cap'
        ];
        return names[Math.floor(Math.random() * names.length)];
    }

    // Setup character counter
    setupCharacterCounter() {
        const chatInput = document.getElementById('chatInput');
        const charCount = document.getElementById('charCount');
        
        chatInput.addEventListener('input', () => {
            const currentLength = chatInput.value.length;
            charCount.textContent = `${currentLength}/500`;
            
            if (currentLength > 450) {
                charCount.style.color = '#f56565';
            } else if (currentLength > 400) {
                charCount.style.color = '#ed8936';
            } else {
                charCount.style.color = '#a0aec0';
            }
        });
    }

    // Format timestamp
    formatTime(timestamp) {
        return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Scroll chat to bottom
    scrollToBottom() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Store messages in localStorage (per day)
    storeMessages() {
        const today = new Date().toDateString();
        const messagesKey = `philosophical_debate_${today}`;
        localStorage.setItem(messagesKey, JSON.stringify(this.chatMessages));
    }

    // Load stored messages for today
    loadStoredMessages() {
        const today = new Date().toDateString();
        const messagesKey = `philosophical_debate_${today}`;
        const storedMessages = localStorage.getItem(messagesKey);

        if (storedMessages) {
            this.chatMessages = JSON.parse(storedMessages);
            
            // Display stored messages
            this.chatMessages.forEach(message => {
                message.timestamp = new Date(message.timestamp);
                this.displayMessage(message);
            });

            this.scrollToBottom();
        }

        // Clean up old stored messages (keep only last 7 days)
        this.cleanupOldMessages();
    }

    // Clean up messages older than 7 days
    cleanupOldMessages() {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('philosophical_debate_')) {
                const dateStr = key.replace('philosophical_debate_', '');
                const messageDate = new Date(dateStr);
                
                if (messageDate < sevenDaysAgo) {
                    localStorage.removeItem(key);
                    i--; // Adjust index since we removed an item
                }
            }
        }
    }

    // Add some demo messages on first visit
    addDemoMessages() {
        if (this.chatMessages.length === 0) {
            const demoMessages = [
                {
                    id: 1,
                    author: 'deep_thinker42',
                    content: 'wow this really hits different... makes me question everything I thought I knew about living authentically',
                    timestamp: new Date(Date.now() - 420000) // 7 minutes ago
                },
                {
                    id: 2,
                    author: 'question_everything',
                    content: 'but how do we even know what counts as "examining" our lives? are we just examining our thoughts about our lives?? 🤯',
                    timestamp: new Date(Date.now() - 180000) // 3 minutes ago
                }
            ];

            demoMessages.forEach(message => {
                this.chatMessages.push(message);
                this.displayMessage(message);
            });

            this.storeMessages();
            this.scrollToBottom();
        }
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const app = new PhilosophicalDebateApp();
    
    // Add demo messages after a short delay on first visit today
    setTimeout(() => {
        app.addDemoMessages();
    }, 2000);
});

// Add some interactive features
document.addEventListener('DOMContentLoaded', () => {
    // Add a subtle animation to the quote when it loads
    setTimeout(() => {
        const quoteElement = document.getElementById('dailyQuote');
        if (quoteElement) {
            quoteElement.style.opacity = '0';
            quoteElement.style.transform = 'translateY(20px)';
            quoteElement.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            setTimeout(() => {
                quoteElement.style.opacity = '1';
                quoteElement.style.transform = 'translateY(0)';
            }, 100);
        }
    }, 500);
});
