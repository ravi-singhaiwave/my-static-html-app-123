const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));

app.post('/api/prompt', (req, res) => {
    const userPrompt = req.body.prompt;
    const clientId = req.headers['clientid1234'];
    const clientSecret = req.headers['clientsecret1234'];
     const content-type = req.headers['application/json'];
    console.log(`Received prompt: ${userPrompt}`);
      console.log(`Client ID: ${clientId}`);
    console.log(`Client Secret: ${clientSecret}`);
    console.log(`Client Secret: ${content-type}`);

    const mockResponse = {
        response: `This is a mock response to your prompt: "${userPrompt}".`
    };

    res.json(mockResponse);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
