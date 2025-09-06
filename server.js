const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Hardcode your API credentials here.
// These are not exposed to the client's browser.
const CLIENT_ID = 'your-hardcoded-client-id';
const CLIENT_SECRET = 'your-hardcoded-client-secret-here';
const EXTERNAL_API_URL = 'https://api.agify.io';

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.post('/api/prompt', async (req, res) => {
    const promptText = req.body.prompt;
    console.log(`Received prompt from client: ${promptText}`);

    // Assuming the user's prompt is a name for the agify API
    const name = promptText;

    try {
        const url = new URL(EXTERNAL_API_URL);
        url.searchParams.append('name', name);

        // This is the outbound API call from the server to the external service.
        const response = await fetch(url.toString(), {
            method: 'GET', // The agify API uses a GET method
            headers: {
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
        res.json({ response: `API Response: ${JSON.stringify(data)}` });

    } catch (error) {
        console.error('Error during API call:', error);
        res.status(500).json({ response: 'An internal server error occurred.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
