// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    const chatUI = new ChatUI();
    const streamingHandler = new StreamingHandler(chatUI);

    let attachedFiles = [];

    chatUI.sendButton.addEventListener('click', () => {
        const message = chatUI.chatInput.value.trim();
        if (message || attachedFiles.length > 0) {
            streamingHandler.sendMessage(message, attachedFiles);
            attachedFiles = []; // Clear attached files after sending
        }
    });

    chatUI.chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            chatUI.sendButton.click();
        }
    });

    chatUI.attachButton.addEventListener('click', () => {
        chatUI.fileUploadInput.click();
    });

    chatUI.fileUploadInput.addEventListener('change', (event) => {
        const files = Array.from(event.target.files);
        files.forEach(file => {
            attachedFiles.push(file);
            chatUI.addFilePreview(file.name, file.type);
        });
        // You might want to display these attached files in the UI before sending
        // and allow users to remove them.
    });

    // Initial scroll to bottom
    chatUI.scrollToBottom();
    
    // Add some visual feedback for typing
    let typingTimer;
    chatUI.chatInput.addEventListener('input', () => {
        // Clear previous timer
        clearTimeout(typingTimer);
        
        // Add subtle visual feedback that user is typing
        chatUI.chatInput.style.borderColor = '#60a5fa'; // blue-400
        
        // Reset border color after user stops typing
        typingTimer = setTimeout(() => {
            chatUI.chatInput.style.borderColor = '';
        }, 1000);
    });
    
    // Focus on input field when page loads
    chatUI.chatInput.focus();
});