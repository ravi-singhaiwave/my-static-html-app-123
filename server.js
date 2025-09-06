const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Hardcode your API credentials here.
// These are not exposed to the client's browser.
const CLIENT_ID = 'your-hardcoded-client-id';
const CLIENT_SECRET = 'your-hardcoded-client-secret';

// Use CORS middleware to allow cross-origin requests.
app.use(cors());

// Use express.json middleware to parse JSON bodies from incoming requests.
app.use(express.json());

// Serve the static HTML file from the 'public' directory.
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to handle the chatbot prompt.
app.post('/api/prompt', async (req, res) => {
    const promptText = req.body.prompt;
    console.log(`Received prompt from client: ${promptText}`);

    try {
        // This is the outbound API call to the external service.
        const response = await fetch('https://api.example.com/v1/prompt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'client-id': CLIENT_ID,
                'client-secret': CLIENT_SECRET
            },
            body: JSON.stringify({ prompt: promptText })
        });

        if (!response.ok) {
            console.error('API call failed with status:', response.status);
            return res.status(response.status).json({ response: 'An error occurred with the external API.' });
        }

        const data = await response.json();
        console.log('Received response from API:', data);
        res.json(data);

    } catch (error) {
        console.error('Error during API call:', error);
        res.status(500).json({ response: 'An internal server error occurred.' });
    }
});

// Start the server.
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
