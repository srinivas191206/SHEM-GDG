import axios from 'axios';

// Interfaces
interface AIConfig {
    openRouter?: string;
    groq?: string;
    gemini?: string;
    activeProvider: 'openRouter' | 'groq' | 'gemini';
}

const getAIConfig = (): AIConfig => {
    // Environment Variables (Secure)
    return {
        openRouter: import.meta.env.VITE_OPENROUTER_KEY || '',
        groq: import.meta.env.VITE_GROQ_KEY || '',
        gemini: import.meta.env.VITE_GEMINI_KEY || '',
        activeProvider: 'openRouter'
    };
};

export const generateAIResponse = async (prompt: string, contextData?: any) => {
    const config = getAIConfig();
    const systemPrompt = `You are SHEM-AI, a smart home energy assistant. 
    Current Energy Data: ${JSON.stringify(contextData || {})}
    User Question: ${prompt}
    Provide a concise, helpful response focusing on energy efficiency and cost savings. Keep it under 50 words unless asked for details.`;

    try {
        if (config.activeProvider === 'gemini' && config.gemini) {
            // Google Gemini API Call
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${config.gemini}`;
            const response = await axios.post(url, {
                contents: [{ parts: [{ text: systemPrompt }] }]
            });
            return response.data.candidates[0].content.parts[0].text;
        }

        else if (config.activeProvider === 'groq' && config.groq) {
            // Groq API Call
            const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                messages: [{ role: 'user', content: systemPrompt }],
                model: 'mixtral-8x7b-32768'
            }, {
                headers: {
                    'Authorization': `Bearer ${config.groq}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data.choices[0].message.content;
        }

        else if (config.activeProvider === 'openRouter' && config.openRouter) {
            // OpenRouter API Call
            const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
                messages: [{ role: 'user', content: systemPrompt }],
                model: 'openai/gpt-3.5-turbo' // Default cheap model
            }, {
                headers: {
                    'Authorization': `Bearer ${config.openRouter}`,
                }
            });
            return response.data.choices[0].message.content;
        }

        return "Please configure your AI API Keys in Settings to enable the assistant.";

    } catch (error) {
        console.error("AI Error:", error);
        return "Sorry, I encountered an error communicating with the AI service. Please check your API keys.";
    }
};
