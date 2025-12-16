/**
 * Gemini AI Insights Service
 * Provides context-aware energy insights using Google's Gemini API
 */

const axios = require('axios');
const Conversation = require('../models/Conversation');
const RateLimit = require('../models/RateLimit');

// ============================================================================
// CONFIGURATION
// ============================================================================

const getGeminiKey = () => process.env.GEMINI_API_KEY;
const getGroqKey = () => process.env.GROQ_API_KEY;
const getOpenRouterKey = () => process.env.OPENROUTER_API_KEY;

// Rate limit: Max 10 questions per user per hour
const MAX_REQUESTS_PER_HOUR = 10;

// Language names and codes
const LANGUAGE_NAMES = {
    en: 'English',
    hi: 'Hindi (हिन्दी)',
    ta: 'Tamil (தமிழ்)',
    te: 'Telugu (తెలుగు)',
    mr: 'Marathi (मराठी)',
    bn: 'Bengali (বাংলা)',
    gu: 'Gujarati (ગુજરાતી)',
    kn: 'Kannada (ಕನ್ನಡ)',
    ml: 'Malayalam (മലയാളം)',
    pa: 'Punjabi (ਪੰਜਾਬੀ)'
};

// System Prompts by Language
const LANGUAGE_PROMPTS = {
    en: `You are SHEM, an AI energy advisor for Indian homes. You help users understand electricity consumption and save money.
    Guidelines:
    - Be conversational, friendly, and specific
    - Always give actionable advice with estimated savings
    - Use Indian context (₹ currency, Indian tariffs like ₹4-8/unit)
    - Keep responses under 200 words unless asked for detail
    - Format action items clearly`,

    hi: `आप SHEM हैं, भारतीय घरों के लिए एक AI ऊर्जा सलाहकार। आप बिजली की खपत को समझने और पैसे बचाने में मदद करते हैं।
    दिशानिर्देश:
    - बातचीत के लहजे में, मैत्रीपूर्ण और विशिष्ट रहें
    - हमेशा अनुमानित बचत के साथ व्यावहारिक सलाह दें
    - भारतीय संदर्भ का प्रयोग करें (₹ मुद्रा, ₹4-8/यूनिट दरें)
    - 200 शब्दों से कम में उत्तर दें`,

    ta: `நீங்கள் SHEM, இந்திய வீடுகளுக்கான AI ஆற்றல் ஆலோசகர். மின்சார பயன்பாட்டைப் புரிந்துகொள்ளவும் பணத்தைச் சேமிக்கவும் உதவுகிறீர்கள்.
    வழிகாட்டுதல்கள்:
    - நட்பு மற்றும் தெளிவாகப் பேசுங்கள்
    - மதிப்பிடப்பட்ட சேமிப்புடன் கூடிய நடைமுறை ஆலோசனைகளை எப்போதும் வழங்குங்கள்
    - இந்திய சூழலைப் பயன்படுத்தவும் (₹ நாணயம், யூனிட்டுக்கு ₹4-8)`,

    te: `మీరు SHEM, భారతీయ గృహాల కోసం AI శక్తి సలహాదారు. విద్యుత్ వినియోగాన్ని అర్థం చేసుకోవడానికి మరియు డబ్బు ఆదా చేయడానికి మీరు సహాయపడతారు.
    మార్గదర్శకాలు:
    - స్నేహపూర్వకంగా మరియు స్పష్టంగా మాట్లాడండి
    - ఎల్లప్పుడూ అంచనా వేయబడిన పొదుపులతో కూడిన ఆచరణాత్మక సలహాలను ఇవ్వండి
    - భారతీయ సందర్భాన్ని ఉపయోగించండి (₹ కరెన్సీ, యూనిట్‌కు ₹4-8)`,

    mr: `तुम्ही SHEM आहात, भारतीय घरांसाठी AI ऊर्जा सल्लागार. तुम्ही वापरकर्त्यांना वीज वापर समजून घेण्यास आणि पैसे वाचवण्यास मदत करता.
    मार्गदर्शक तत्त्वे:
    - संभाषणशील, मैत्रीपूर्ण आणि विशिष्ट राहा
    - नेहमी अंदाजित बचतीसह कृती करण्यायोग्य सल्ला द्या
    - भारतीय संदर्भ वापरा (₹ चलन, ₹4-8/युनिट दर)
    - 200 शब्दांपेक्षा कमी ठेवा`,

    bn: `আপনি SHEM, ভারতীয় পরিবারের জন্য একজন AI শক্তি উপদেষ্টা। আপনি ব্যবহারকারীদের বিদ্যুৎ খরচ বুঝতে এবং অর্থ সাশ্রয় করতে সহায়তা করেন।
    নির্দেশিকা:
    - কথোপকথনমূলক, বন্ধুত্বপূর্ণ এবং নির্দিষ্ট হন
    - সর্বদা আনুমানিক সঞ্চয়ের সাথে কার্যকর পরামর্শ দিন
    - ভারতীয় প্রসঙ্গ ব্যবহার করুন (₹ মুদ্রা, ₹4-8/ইউনিট)`,

    gu: `તમે SHEM છો, ભારતીય ઘરો માટે AI એનર્જી એડવાઈઝર. તમે વપરાશકર્તાઓને વીજળીનો વપરાશ સમજવામાં અને નાણાં બચાવવામાં મદદ કરો છો.
    માર્ગદર્શિકા:
    - વાતચીત, મૈત્રીપૂર્ણ અને ચોક્કસ રહો
    - હંમેશા અંદાજિત બચત સાથે પગલાં લેવા યોગ્ય સલાહ આપો
    - ભારતીય સંદર્ભનો ઉપયોગ કરો (₹ ચલણ, ₹4-8/યુનિટ)`,

    kn: `ನೀವು SHEM, ಭಾರತೀಯ ಮನೆಗಳಿಗೆ AI ಶಕ್ತಿ ಸಲಹೆಗಾರ. ವಿದ್ಯುತ್ ಬಳಕೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳಲು ಮತ್ತು ಹಣವನ್ನು ಉಳಿಸಲು ನೀವು ಬಳಕೆದಾರರಿಗೆ ಸಹಾಯ ಮಾಡುತ್ತೀರಿ.
    ಮಾರ್ಗಸೂಚಿಗಳು:
    - ಸಂಭಾಷಣಾತ್ಮಕ, ಸ್ನೇಹಪರ ಮತ್ತು ನಿರ್ದಿಷ್ಟವಾಗಿರಿ
    - ಯಾವಾಗಲೂ ಅಂದಾಜು ಉಳಿತಾಯದೊಂದಿಗೆ ಕ್ರಿಯಾಶೀಲ ಸಲಹೆಯನ್ನು ನೀಡಿ
    - ಭಾರತೀಯ ಸಂದರ್ಭವನ್ನು ಬಳಸಿ (₹ ಕರೆನ್ಸಿ, ₹4-8/ಯೂನಿಟ್)`,

    ml: `നിങ്ങൾ SHEM ആണ്, ഇന്ത്യൻ വീടുകൾക്കുള്ള AI എനർജി അഡൈ്വസർ. വൈദ്യുതി ഉപഭോഗം മനസ്സിലാക്കാനും പണം ലാഭിക്കാനും നിങ്ങൾ ഉപയോക്താക്കളെ സഹായിക്കുന്നു.
    മാർഗ്ഗനിർദ്ദേശങ്ങൾ:
    - സംഭാഷണപരവും സൗഹൃദപരവും നിർദ്ദിഷ്ടവുമായിരിക്കുക
    - കണക്കാക്കിയ സമ്പാദ്യത്തിനൊപ്പം എല്ലായ്പ്പോഴും പ്രവർത്തനക്ഷമമായ ഉപദേശം നൽകുക
    - ഇന്ത്യൻ സന്ദർഭം ഉപയോഗിക്കുക (₹ കറൻസി, ₹4-8/യൂണിറ്റ്)`,

    pa: `ਤੁਸੀਂ SHEM ਹੋ, ਭਾਰਤੀ ਘਰਾਂ ਲਈ ਇੱਕ AI ਊਰਜਾ ਸਲਾਹਕਾਰ। ਤੁਸੀਂ ਬਿਜਲੀ ਦੀ ਖਪਤ ਨੂੰ ਸਮਝਣ ਅਤੇ ਪੈਸੇ ਬਚਾਉਣ ਵਿੱਚ ਉਪਭੋਗਤਾਵਾਂ ਦੀ ਮਦਦ ਕਰਦੇ ਹੋ।
    ਦਿਸ਼ਾ-ਨਿਰਦੇਸ਼:
    - ਗੱਲਬਾਤ ਕਰਨ ਵਾਲੇ, ਦੋਸਤਾਨਾ ਅਤੇ ਖਾਸ ਬਣੋ
    - ਹਮੇਸ਼ਾਂ ਅਨੁਮਾਨਿਤ ਬੱਚਤਾਂ ਦੇ ਨਾਲ ਕਾਰਵਾਈਯੋਗ ਸਲਾਹ ਦਿਓ
    - ਭਾਰਤੀ ਸੰਦਰਭ ਦੀ ਵਰਤੋਂ ਕਰੋ (₹ ਮੁਦਰਾ, ₹4-8/ਯੂਨੀਟ)`,

    // Default fallback for others (can be expanded)
    default: `You are SHEM, an AI energy advisor. Please respond in the user's requested language using Indian context and currency (₹).`
};

// Tariff Context (Shared)
const TARIFF_CONTEXT = `
Tariff Context (typical Indian rates):
- Off-peak (11 PM - 6 AM): ₹4/unit
- Normal (6 AM - 6 PM): ₹6/unit  
- Peak (6 PM - 11 PM): ₹8/unit
- Free units (subsidy): Usually 100-200 units/month depending on state
`;

// Common appliance consumption (Indian homes)
const APPLIANCE_CONTEXT = `
Common appliance consumption:
- AC (1 ton): 1.2 kW/hour
- Refrigerator: 100-150W average (runs 24/7)
- Water Heater/Geyser: 1.5-2 kW (typically 30-60 min/day)
- Washing Machine: 0.5-1.5 kW per cycle
- Ceiling Fan: 70-80W
- LED TV: 80-150W
- Lights (LED): 9-15W each
`;

// ============================================================================
// API CALL FUNCTIONS
// ============================================================================

/**
 * Call Gemini API
 */
const callGemini = async (prompt) => {
    const key = getGeminiKey();
    if (!key) throw new Error("Gemini Key Missing");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
    const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
        }
    });
    return response.data.candidates[0].content.parts[0].text;
};

/**
 * Call Groq API (fallback)
 */
const callGroq = async (prompt, systemPrompt) => {
    const key = getGroqKey();
    if (!key) throw new Error("Groq Key Missing");

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
        ],
        model: 'llama3-70b-8192',
        max_tokens: 500
    }, {
        headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
        }
    });
    return response.data.choices[0].message.content;
};

/**
 * Call OpenRouter API (fallback)
 */
const callOpenRouter = async (prompt, systemPrompt) => {
    const key = getOpenRouterKey();
    if (!key) throw new Error("OpenRouter Key Missing");

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: prompt }
        ],
        model: 'openai/gpt-3.5-turbo',
        max_tokens: 500
    }, {
        headers: {
            'Authorization': `Bearer ${key}`,
        }
    });
    return response.data.choices[0].message.content;
};

// ============================================================================
// CONTEXT PREPARATION
// ============================================================================

/**
 * Prepare consumption context for AI
 */
const prepareContext = (contextData) => {
    if (!contextData) return 'No energy data available.';

    const context = {
        currentPower: contextData.power || contextData.currentConsumption || 'N/A',
        voltage: contextData.voltage || 'N/A',
        current: contextData.current || 'N/A',
        todayConsumption: contextData.todayConsumption || contextData.hourlyConsumption || 'N/A',
        monthlyConsumption: contextData.monthlyConsumption || contextData.totalMonthlyConsumption || 'N/A',
        monthlyBudget: contextData.monthlyBudget || 2000,
        topAppliances: contextData.topAppliances || ['AC', 'Refrigerator', 'Water Heater'],
        peakHours: contextData.peakHours || '6 PM - 11 PM',
        offPeakRate: contextData.offPeakRate || '₹4/unit',
        peakRate: contextData.peakRate || '₹8/unit',
        recentAnomalies: contextData.recentAnomalies || 0,
        temperature: contextData.temperature || '28°C',
        dayOfWeek: new Date().toLocaleDateString('en-IN', { weekday: 'long' }),
        timeOfDay: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    return `
Current Energy Status:
- Power Draw: ${context.currentPower}W
- Voltage: ${context.voltage}V
- Current: ${context.current}A
- Today's Usage: ${context.todayConsumption} kWh
- This Month: ${context.monthlyConsumption} kWh (Budget: ${context.monthlyBudget} kWh)
- Top Appliances: ${context.topAppliances.join(', ')}
- Peak Hours: ${context.peakHours} (Rate: ${context.peakRate})
- Off-Peak Rate: ${context.offPeakRate}
- Recent Anomalies: ${context.recentAnomalies}
- Outside Temperature: ${context.temperature}
- Day/Time: ${context.dayOfWeek}, ${context.timeOfDay}
    `.trim();
};

// ============================================================================
// RESPONSE PARSING
// ============================================================================

/**
 * Parse AI response to extract action items and savings
 */
const parseResponse = (response) => {
    const result = {
        answer: response,
        actionItems: [],
        estimatedSavings: null,
        followUpQuestion: null
    };

    // Extract action items (numbered list or bulleted list)
    const actionPattern = /(?:^|\n)\s*(?:\d+[\.\)]\s*|[-•]\s*)(.+?)(?=\n|$)/gm;
    const matches = response.matchAll(actionPattern);
    for (const match of matches) {
        const item = match[1].trim();
        if (item.length > 10 && item.length < 200) {
            result.actionItems.push(item);
        }
    }

    // Extract savings estimates (₹ followed by numbers)
    const savingsPattern = /(?:save|savings?|reduce)\s*(?:of\s*)?(?:about\s*)?(?:around\s*)?(₹\s*[\d,]+(?:-[\d,]+)?(?:\/month|\/year|per month|per year)?)/gi;
    const savingsMatch = response.match(savingsPattern);
    if (savingsMatch) {
        result.estimatedSavings = savingsMatch[0].replace(/save|savings?|reduce|of|about|around/gi, '').trim();
    }

    // Extract follow-up question (sentence ending with ?)
    const questionPattern = /(?:would you|do you|shall I|want me to|interested in)[^?]*\?/gi;
    const questionMatch = response.match(questionPattern);
    if (questionMatch) {
        result.followUpQuestion = questionMatch[questionMatch.length - 1].trim();
    }

    return result;
};

// ============================================================================
// RATE LIMITING
// ============================================================================

/**
 * Check and update rate limit
 */
const checkRateLimit = async (userId) => {
    const hourStart = new Date();
    hourStart.setMinutes(0, 0, 0);

    let rateLimit = await RateLimit.findOne({ userId, endpoint: 'chat', hourStart });

    if (!rateLimit) {
        rateLimit = new RateLimit({
            userId, endpoint: 'chat', hourStart, requests: [{ timestamp: new Date() }]
        });
        await rateLimit.save();
        return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - 1 };
    }

    if (rateLimit.requests.length >= MAX_REQUESTS_PER_HOUR) {
        return {
            allowed: false, remaining: 0, resetAt: new Date(hourStart.getTime() + 60 * 60 * 1000)
        };
    }

    rateLimit.requests.push({ timestamp: new Date() });
    await rateLimit.save();
    return { allowed: true, remaining: MAX_REQUESTS_PER_HOUR - rateLimit.requests.length };
};

// ============================================================================
// CONVERSATION MANAGEMENT
// ============================================================================

/**
 * Get or create conversation session
 */
const getOrCreateSession = async (userId, sessionId, contextData) => {
    let conversation = await Conversation.findOne({ userId, sessionId });

    if (!conversation) {
        conversation = new Conversation({
            userId, sessionId, messages: [],
            contextSnapshot: {
                currentConsumption: contextData?.currentConsumption || 0,
                monthlyConsumption: contextData?.monthlyConsumption || 0,
                monthlyBudget: contextData?.monthlyBudget || 2000,
                topAppliances: contextData?.topAppliances || [],
                peakHours: contextData?.peakHours || '6 PM - 11 PM',
                temperature: contextData?.temperature || '28°C'
            }
        });
        await conversation.save();
    }

    return conversation;
};

/**
 * Get conversation history for context
 */
const getConversationHistory = (conversation, limit = 5) => {
    const recentMessages = conversation.messages.slice(-limit);
    if (recentMessages.length === 0) return '';
    return recentMessages.map(msg =>
        `${msg.role === 'user' ? 'User' : 'SHEM'}: ${msg.content}`
    ).join('\n');
};

/**
 * Add message to conversation
 */
const addMessage = async (conversation, role, content, parsedData = {}) => {
    conversation.messages.push({ role, content, ...parsedData });
    conversation.updatedAt = new Date();
    await conversation.save();
};

// ============================================================================
// MAIN FUNCTION
// ============================================================================

/**
 * Process user question and get AI response
 * @param {string} userId - User ID
 * @param {string} sessionId - Session ID
 * @param {string} question - User's question
 * @param {object} contextData - Energy context data
 * @param {string} language - Language code (en, hi, ta, te, etc.)
 * @param {boolean} voiceInput - Whether input came from voice
 */
const askQuestion = async (userId, sessionId, question, contextData, language = 'en', voiceInput = false) => {
    // Check rate limit
    const rateLimitStatus = await checkRateLimit(userId);
    if (!rateLimitStatus.allowed) {
        return {
            error: 'rate_limited',
            message: `You've reached the maximum of ${MAX_REQUESTS_PER_HOUR} questions per hour. Please try again later.`,
            resetAt: rateLimitStatus.resetAt
        };
    }

    // Get or create conversation
    const conversation = await getOrCreateSession(userId, sessionId, contextData);

    // Prepare context
    const energyContext = prepareContext(contextData);
    const conversationHistory = getConversationHistory(conversation);

    // Build language instruction
    const languageName = LANGUAGE_NAMES[language] || 'English';
    let basePrompt = LANGUAGE_PROMPTS[language] || LANGUAGE_PROMPTS['default'];

    // Add voice specific instruction
    if (voiceInput) {
        basePrompt += `\n\nVOICE MODE: Keep response SHORT (under 30 seconds speech). Use simple, conversational language. Avoid complex formatting like markdown tables or long lists. Respond in ${languageName}.`;
    } else if (language !== 'en') {
        basePrompt += `\n\nIMPORTANT: Respond ENTIRELY in ${languageName}. Use ${languageName} script and vocabulary.`;
    }

    // Build full prompt
    const fullPrompt = `
${basePrompt}
${TARIFF_CONTEXT}
${APPLIANCE_CONTEXT}

--- CURRENT ENERGY DATA ---
${energyContext}

${conversationHistory ? `--- RECENT CONVERSATION ---\n${conversationHistory}\n` : ''}
--- USER QUESTION ---
${question}

Please provide a helpful response${language !== 'en' ? ` in ${languageName}` : ''}.
    `.trim();

    // Call AI APIs with fallback
    let response = null;
    let provider = null;

    try {
        console.log(`Attempting Gemini (Lang: ${language}, Voice: ${voiceInput})...`);
        response = await callGemini(fullPrompt);
        provider = 'gemini';
    } catch (error) {
        console.error('Gemini failed:', error.message);
        try {
            console.log('Attempting Groq...');
            response = await callGroq(fullPrompt, basePrompt);
            provider = 'groq';
        } catch (error2) {
            console.error('Groq failed:', error2.message);
            try {
                console.log('Attempting OpenRouter...');
                response = await callOpenRouter(fullPrompt, basePrompt);
                provider = 'openrouter';
            } catch (error3) {
                console.error('OpenRouter failed:', error3.message);
                throw new Error('All AI providers failed');
            }
        }
    }

    // Parse response
    const parsedResponse = parseResponse(response);

    // Save to conversation
    await addMessage(conversation, 'user', question);
    await addMessage(conversation, 'assistant', response, {
        actionItems: parsedResponse.actionItems,
        estimatedSavings: parsedResponse.estimatedSavings,
        followUpQuestion: parsedResponse.followUpQuestion
    });

    return {
        ...parsedResponse,
        provider,
        rateLimitRemaining: rateLimitStatus.remaining,
        sessionId
    };
};

/**
 * Get conversation history for user
 */
const getHistory = async (userId, limit = 10) => {
    const conversations = await Conversation.find({ userId })
        .sort({ updatedAt: -1 })
        .limit(limit)
        .select('sessionId messages createdAt updatedAt');

    return conversations.map(conv => ({
        sessionId: conv.sessionId,
        messageCount: conv.messages.length,
        lastMessage: conv.messages[conv.messages.length - 1]?.content.substring(0, 100) + '...',
        createdAt: conv.createdAt,
        updatedAt: conv.updatedAt
    }));
};

/**
 * Get specific conversation
 */
const getConversation = async (userId, sessionId) => {
    const conversation = await Conversation.findOne({ userId, sessionId });
    if (!conversation) return null;

    return {
        sessionId,
        messages: conversation.messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp,
            actionItems: msg.actionItems,
            estimatedSavings: msg.estimatedSavings
        })),
        contextSnapshot: conversation.contextSnapshot,
        createdAt: conversation.createdAt
    };
};

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
    askQuestion,
    getHistory,
    getConversation,
    prepareContext,
    parseResponse,
    checkRateLimit
};
