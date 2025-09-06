const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Hardcoded username and password for Basic Authentication
const USERNAME = 'admin';
const PASSWORD = 'password123';

// Hardcode your API credentials here.
// Note: The agify.io API does not require credentials, but this shows how you would handle them.
const CLIENT_ID = 'your-hardcoded-client-id';
const CLIENT_SECRET = 'your-hardcoded-client-secret-here';
const EXTERNAL_API_URL = 'https://api.agify.io';

// Use CORS middleware to allow cross-origin requests.
app.use(cors());

// Use express.json middleware to parse JSON bodies from incoming requests.
app.use(express.json());

// Serve the static HTML file from the 'public' directory.
// This is done BEFORE applying authentication to allow the page to load.
app.use(express.static('public'));

// Middleware for Basic Authentication
const basicAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        res.setHeader('WWW-Authenticate', 'Basic realm="Protected"');
        return res.status(401).send('Authentication required');
    }

    const [type, credentials] = authHeader.split(' ');
    if (type.toLowerCase() !== 'basic') {
        return res.status(401).send('Invalid authentication type');
    }

    const decoded = Buffer.from(credentials, 'base64').toString();
    const [username, password] = decoded.split(':');

    if (username === USERNAME && password === PASSWORD) {
        next();
    } else {
        res.setHeader('WWW-Authenticate', 'Basic realm="Protected"');
        return res.status(401).send('Invalid credentials');
    }
};

// Apply basic authentication only to the API routes
app.use('/api', basicAuth);

// API endpoint to handle the chatbot prompt.
app.post('/api/prompt', async (req, res) => {
    const promptText = req.body.prompt;
    console.log(`Received prompt from client: ${promptText}`);
    
    // Construct the URL with the prompt as a query parameter
    const apiUrlWithQuery = `${EXTERNAL_API_URL}/?name=${encodeURIComponent(promptText)}`;

    try {
        // This is the outbound API call from the server to the external service.
        const response = await fetch(apiUrlWithQuery, {
            method: 'GET', // The agify API uses a GET method
            headers: {
                'Content-Type': 'application/json',
                'client-id': CLIENT_ID,
                'client-secret': CLIENT_SECRET
            }
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
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
