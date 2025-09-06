const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('public'));

app.post('/api/prompt', (req, res) => {
    const userPrompt = req.body.prompt;
    console.log(`Received prompt: ${userPrompt}`);

    const mockResponse = {
        response: `This is a mock response to your prompt: "${userPrompt}".`
    };

    res.json(mockResponse);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
