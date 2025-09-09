const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Chat endpoint with streaming support
app.post('/api/chat', async (req, res) => {
    res.setHeader('Content-Type', 'text/plain'); // Or 'text/event-stream' for SSE
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const { message, attachments } = req.body;
    console.log('Received message:', message);
    console.log('Received attachments:', attachments);

    // --- Simulate AI processing and streaming ---
    const fullResponse = `You said: "${message}". ${attachments && attachments.length > 0 ? `You also attached ${attachments.length} file(s) like ${attachments[0].name}. ` : ''}I am a modern, smooth, multimodal AI assistant. I can help with various tasks, from answering questions to generating creative content. This response is being streamed to you in chunks for a seamless experience. 
    
Here's a little extra content to show more streaming...

I can also generate images based on your prompts. For example, if you asked me to "Create a photorealistic image of an astronaut riding a horse on Mars," I would generate something like this: 

IMAGE_PLACEHOLDER_URL: https://example.com/astronaut-horse-mars.jpg

What else would you like to explore today?`;

    const chunks = fullResponse.match(/.{1,20}/g) || [fullResponse]; // Split into 20-char chunks

    for (const chunk of chunks) {
        await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 50)); // Simulate delay
        res.write(chunk);
    }

    res.end(); // Signal that the stream is complete
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});