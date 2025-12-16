const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const {
    askQuestion,
    getHistory,
    getConversation
} = require('../services/geminiAIInsightsService');

// @route   POST /api/chat/ask
// @desc    Ask a question with context-aware AI response
// @access  Public
router.post('/ask', async (req, res) => {
    try {
        const { userId, question, contextData, sessionId, language, voiceInput } = req.body;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }
        if (!question || typeof question !== 'string') {
            return res.status(400).json({ error: 'Missing or invalid question' });
        }

        // Generate session ID if not provided
        const session = sessionId || uuidv4();

        // Pass language and voice flag
        const response = await askQuestion(userId, session, question, contextData, language || 'en', voiceInput);

        if (response.error === 'rate_limited') {
            return res.status(429).json(response);
        }

        res.json(response);
    } catch (error) {
        console.error('Chat Ask Error:', error);
        res.status(500).json({
            error: 'Failed to get AI response',
            message: error.message
        });
    }
});

// @route   POST /api/chat (legacy endpoint - forwards to /ask)
// @desc    Legacy chat endpoint for backwards compatibility
// @access  Public
router.post('/', async (req, res) => {
    try {
        const { message, contextData, userId = 'anonymous' } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Missing message' });
        }

        const sessionId = uuidv4();
        const response = await askQuestion(userId, sessionId, message, contextData);

        if (response.error === 'rate_limited') {
            return res.status(429).json({ error: response.message });
        }

        // Return in legacy format
        res.json({ response: response.answer });
    } catch (error) {
        console.error('Chat Error:', error);
        res.status(500).json({
            error: 'Sorry, I encountered an error communicating with the AI service.'
        });
    }
});

// @route   GET /api/chat/history
// @desc    Get conversation history for a user
// @access  Public
router.get('/history', async (req, res) => {
    try {
        const { userId, limit = 10 } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        const history = await getHistory(userId, parseInt(limit));
        res.json({ conversations: history });
    } catch (error) {
        console.error('Chat History Error:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// @route   GET /api/chat/conversation/:sessionId
// @desc    Get specific conversation by session ID
// @access  Public
router.get('/conversation/:sessionId', async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        const conversation = await getConversation(userId, sessionId);

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.json(conversation);
    } catch (error) {
        console.error('Get Conversation Error:', error);
        res.status(500).json({ error: 'Failed to fetch conversation' });
    }
});

module.exports = router;
