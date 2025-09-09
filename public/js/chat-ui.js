// public/js/chat-ui.js
class ChatUI {
    constructor() {
        this.chatMessagesDiv = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        this.attachButton = document.getElementById('attach-button');
        this.fileUploadInput = document.getElementById('file-upload');
    }

    addMessage(sender, text, isStreaming = false, messageId = null, imageUrl = null) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('flex', 'items-start', 'mb-4');

        const avatarDiv = document.createElement('div');
        avatarDiv.classList.add('flex-shrink-0', 'mr-3');
        avatarDiv.innerHTML = `<div class="h-8 w-8 rounded-full ${sender === 'user' ? 'bg-green-500' : 'bg-blue-500'} flex items-center justify-center text-sm font-bold">${sender === 'user' ? 'You' : 'AI'}</div>`;
        messageDiv.appendChild(avatarDiv);

        const contentDiv = document.createElement('div');
        contentDiv.classList.add('p-3', 'rounded-lg', 'max-w-xs', 'md:max-w-md', sender === 'user' ? 'bg-green-600' : 'bg-gray-700');

        if (text) {
            const p = document.createElement('p');
            p.textContent = text;
            contentDiv.appendChild(p);
        }

        if (imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.classList.add('max-w-full', 'h-auto', 'rounded-md', 'mt-2');
            contentDiv.appendChild(img);
        }

        messageDiv.appendChild(contentDiv);
        this.chatMessagesDiv.appendChild(messageDiv);

        if (isStreaming) {
            messageDiv.id = `streaming-message-${messageId}`;
            // Add a temporary loading indicator or cursor
            const loadingSpan = document.createElement('span');
            loadingSpan.classList.add('blink'); // You'll need CSS for this
            loadingSpan.textContent = '|'; // Simple cursor
            const p = contentDiv.querySelector('p') || document.createElement('p');
            if (!contentDiv.querySelector('p')) {
                contentDiv.appendChild(p);
            }
            p.appendChild(loadingSpan);
        }

        this.scrollToBottom();
        return messageDiv; // Return the message div for streaming updates
    }

    updateStreamingMessage(messageId, chunk) {
        const messageDiv = document.getElementById(`streaming-message-${messageId}`);
        if (messageDiv) {
            const p = messageDiv.querySelector('p');
            if (p) {
                // Remove existing blinking cursor
                const loadingSpan = p.querySelector('.blink');
                if (loadingSpan) {
                    loadingSpan.remove();
                }
                
                // Add chunk to existing text (preserve existing content)
                const existingText = p.textContent || '';
                p.textContent = existingText + chunk;
                
                // Add cursor back if not finished
                const newLoadingSpan = document.createElement('span');
                newLoadingSpan.classList.add('blink');
                newLoadingSpan.textContent = '|';
                p.appendChild(newLoadingSpan);
            }
        }
        this.scrollToBottom();
    }

    finishStreamingMessage(messageId) {
        const messageDiv = document.getElementById(`streaming-message-${messageId}`);
        if (messageDiv) {
            const p = messageDiv.querySelector('p');
            if (p) {
                const loadingSpan = p.querySelector('.blink');
                if (loadingSpan) {
                    loadingSpan.remove();
                }
            }
        }
        this.scrollToBottom();
    }

    // Example function to add a visual file preview (you'd expand this)
    addFilePreview(fileName, fileType) {
        const previewDiv = document.createElement('div');
        previewDiv.classList.add('bg-gray-600', 'p-2', 'rounded-md', 'text-sm', 'mb-2', 'flex', 'items-center', 'text-gray-300');
        previewDiv.innerHTML = `
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0014.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
            <span>${fileName} (${fileType})</span>
        `;
        this.chatMessagesDiv.appendChild(previewDiv);
        this.scrollToBottom();
    }

    clearInput() {
        this.chatInput.value = '';
    }

    scrollToBottom() {
        this.chatMessagesDiv.scrollTop = this.chatMessagesDiv.scrollHeight;
    }
}