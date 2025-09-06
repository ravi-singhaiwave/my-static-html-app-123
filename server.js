const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;
const CLIENT_ID = 'your-hardcoded-client-id';
const CLIENT_SECRET = 'your-hardcoded-client-secret';
app.use(express.json());
app.use(express.static('public'));

app.post('https://api.agify.io/?name=ravi', async (req, res) => {
    const promptText = req.body.prompt;
    console.log(`Received prompt from client: ${promptText}`);

    try {
        // This is the outbound API call to the external service.
        const response = await fetch('https://api.agify.io/?name=ravi', {
            method: 'GET',
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

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
