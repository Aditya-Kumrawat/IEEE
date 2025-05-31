const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Import the aiChatbot logic (converted to JS for Node compatibility)
const { aiChatbot } = require('../ai-chatbot');

const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors());
app.use(bodyParser.json());

// API endpoint for the chatbot
app.post('/api/ai-chatbot', async (req, res) => {
  const { message, chatHistory } = req.body;
  try {
    const result = await aiChatbot({ message, chatHistory });
    res.json(result);
  } catch (error) {
    res.status(500).json({ response: 'Server error: ' + error.message });
  }
});

// Serve static files (for production build)
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 