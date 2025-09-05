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

// Chat endpoint
app.post('/api/chat', (req, res) => {
    const { message, files } = req.body;
    
    // Example response - Replace with your actual chat processing logic
    const response = {
        text: `Received: ${message}`,
        type: 'text'
    };
    
    res.json(response);
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});