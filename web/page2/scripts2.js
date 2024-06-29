// Function to redirect to home page
function redirectToHome() {
    window.location.href = '../../index.html';
}

// Function to append messages to the chatbox
function appendMessage(text, className) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${className}`;
    messageElement.innerText = text;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Function to send messages to the Rasa server
async function sendMessage() {
    const userInput = document.getElementById('user-input');
    const message = userInput.value.trim();
    if (message === "") return;

    appendMessage(message, 'user-message');
    userInput.value = "";

    try {
        const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sender: 'user', message: message })
        });

        if (!response.ok) {
            appendMessage("Error: Could not connect to the server.", 'bot-message');
            return;
        }

        const data = await response.json();
        data.forEach(msg => {
            appendMessage(msg.text, 'bot-message');
        });
    } catch (error) {
        appendMessage("Error: Could not connect to the server.", 'bot-message');
    }
}

// Event listener for Enter key to send messages
document.getElementById('user-input').addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});
