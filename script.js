const chatDisplay = document.getElementById('chat-display');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const startListeningButton = document.getElementById('start-listening-button');
const clearButton = document.getElementById('clear-button');

// Create a conversation history array to store messages
const conversationHistory = [];

sendButton.addEventListener('click', sendMessage);
startListeningButton.addEventListener('click', startListening);
clearButton.addEventListener('click', clearConversation);

function sendMessage() {
    const userMessage = userInput.value;
    displayMessage('You', userMessage);
    sendToBackend(userMessage);
    userInput.value = '';
}

function startListening() {
    recognition = new webkitSpeechRecognition() || SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onstart = function() {
    startListeningButton.disabled = true;
    startListeningButton.innerText = 'Listening...';
    };
}

function displayMessage(sender, message) {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatDisplay.appendChild(messageElement);

    // Add the message to the conversation history array
    conversationHistory.push(`${sender}: ${message}`);
    // Scroll to the bottom of the chat display
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

async function sendToBackend(message) {
    try {
        const response = await fetch('http://localhost:5000/chatbot', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_message: message }),
        });

        if (!response.ok) {
            console.error('Failed to send request to backend');
            return;
        }

        const data = await response.json();
        displayMessage('Chatbot', data.chatbot_response);
        
        // Add the chatbot's response to the conversation history
        conversationHistory.push(`Chatbot: ${data.chatbot_response}`);

        // Scroll to the bottom of the chat display
        chatDisplay.scrollTop = chatDisplay.scrollHeight;
    } catch (error) {
        console.error('Error sending request:', error);
    }
}

function clearConversation() {
    chatDisplay.innerHTML = '';
    
    // Clear the conversation history array
    conversationHistory.length = 0;
}
