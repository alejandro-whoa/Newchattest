// public/js/streaming-handler.js
class StreamingHandler {
    constructor(chatUI) {
        this.chatUI = chatUI;
        this.apiEndpoint = '/api/chat'; // Your backend API endpoint
        this.currentMessageId = 0;
    }

    async sendMessage(message, attachments = []) {
        this.currentMessageId++;
        const messageId = this.currentMessageId;

        this.chatUI.addMessage('user', message);
        this.chatUI.clearInput();

        // Add a placeholder message for the AI's response
        this.chatUI.addMessage('ai', '', true, messageId);

        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    attachments: attachments.map(file => ({
                        name: file.name,
                        type: file.type,
                        // For a real app, you'd upload files and send URLs/IDs
                        // For this example, we'll just send metadata
                    }))
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let result = '';
            let done = false;

            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    result += chunk;
                    this.chatUI.updateStreamingMessage(messageId, chunk);
                }
            }
            
            this.chatUI.finishStreamingMessage(messageId);
            
            // After streaming, if the response includes an image URL, add it.
            // This is a simplified example; a real API would send structured data for this.
            if (result.includes("IMAGE_PLACEHOLDER_URL:")) {
                const imageUrl = result.split("IMAGE_PLACEHOLDER_URL:")[1].trim();
                this.chatUI.addMessage('ai', '', false, null, imageUrl);
            }

        } catch (error) {
            console.error('Error during streaming:', error);
            this.chatUI.updateStreamingMessage(messageId, `Error: ${error.message}`);
            this.chatUI.finishStreamingMessage(messageId);
        }
    }
}