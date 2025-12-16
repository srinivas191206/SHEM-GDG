/**
 * Voice Service using FREE Web Speech API
 * 100% browser-based, no external API keys needed
 * Supports speech recognition (STT) and synthesis (TTS) in 9 Indian languages + English
 */

// Language mapping for Speech Recognition and Synthesis
export const LANGUAGE_CODES = {
    en: 'en-US',
    hi: 'hi-IN',
    ta: 'ta-IN',
    te: 'te-IN',
    mr: 'mr-IN',
    bn: 'bn-IN',
    gu: 'gu-IN',
    kn: 'kn-IN',
    ml: 'ml-IN',
    pa: 'pa-IN'
};

/**
 * Check if Web Speech API is supported in the browser
 */
export const isVoiceSupported = () => {
    const hasSpeechRecognition = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
    const hasSpeechSynthesis = 'speechSynthesis' in window;

    return {
        recognition: hasSpeechRecognition,
        synthesis: hasSpeechSynthesis,
        full: hasSpeechRecognition && hasSpeechSynthesis
    };
};

/**
 * Speech Recognition Service (User speaks → Text)
 * Uses browser's built-in SpeechRecognition API
 */
export class VoiceSpeechRecognition {
    constructor(language = 'en') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            throw new Error('Speech Recognition not supported in this browser');
        }

        this.recognition = new SpeechRecognition();
        this.language = language;
        this.isListening = false;

        // Configure recognition
        this.recognition.continuous = true; // Keep listening until stopped
        this.recognition.interimResults = true; // Show interim results as user speaks
        this.recognition.maxAlternatives = 1;
        this.recognition.lang = LANGUAGE_CODES[language] || 'en-US';

        // Event handlers (to be set by caller)
        this.onTranscriptUpdate = null; // Called with interim transcript
        this.onFinalTranscript = null; // Called with final transcript
        this.onStart = null;
        this.onEnd = null;
        this.onError = null;

        this._setupEventHandlers();
    }

    _setupEventHandlers() {
        this.recognition.onstart = () => {
            this.isListening = true;
            console.log('[Voice] Speech recognition started');
            if (this.onStart) this.onStart();
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript + ' ';
                } else {
                    interimTranscript += transcript;
                }
            }

            // Update interim transcript (shown as user speaks)
            if (interimTranscript && this.onTranscriptUpdate) {
                this.onTranscriptUpdate(interimTranscript);
            }

            // Final transcript (user finished speaking a phrase)
            if (finalTranscript && this.onFinalTranscript) {
                this.onFinalTranscript(finalTranscript.trim());
            }
        };

        this.recognition.onerror = (event) => {
            console.error('[Voice] Recognition error:', event.error);
            this.isListening = false;

            if (this.onError) {
                const errorMessage = this._getErrorMessage(event.error);
                this.onError(errorMessage);
            }
        };

        this.recognition.onend = () => {
            this.isListening = false;
            console.log('[Voice] Speech recognition ended');
            if (this.onEnd) this.onEnd();
        };
    }

    _getErrorMessage(error) {
        const errorMessages = {
            'no-speech': 'No speech detected. Please try again.',
            'audio-capture': 'No microphone found. Please check your device.',
            'not-allowed': 'Microphone permission denied.',
            'network': 'Network error occurred.',
            'aborted': 'Speech recognition aborted.',
            'service-not-allowed': 'Speech recognition service not allowed.'
        };

        return errorMessages[error] || `Speech recognition error: ${error}`;
    }

    /**
     * Start listening for speech
     */
    start() {
        if (this.isListening) {
            console.warn('[Voice] Already listening');
            return;
        }

        try {
            this.recognition.start();
        } catch (error) {
            console.error('[Voice] Failed to start recognition:', error);
            if (this.onError) {
                this.onError('Failed to start speech recognition. Please try again.');
            }
        }
    }

    /**
     * Stop listening
     */
    stop() {
        if (!this.isListening) return;

        try {
            this.recognition.stop();
        } catch (error) {
            console.error('[Voice] Failed to stop recognition:', error);
        }
    }

    /**
     * Change language
     */
    setLanguage(language) {
        this.language = language;
        this.recognition.lang = LANGUAGE_CODES[language] || 'en-US';
        console.log(`[Voice] Language changed to: ${this.recognition.lang}`);
    }

    /**
     * Cleanup
     */
    destroy() {
        this.stop();
        this.recognition = null;
    }
}

/**
 * Speech Synthesis Service (Text → Speech)
 * Uses browser's built-in SpeechSynthesis API
 */
export class VoiceSpeechSynthesis {
    constructor(language = 'en') {
        if (!('speechSynthesis' in window)) {
            throw new Error('Speech Synthesis not supported in this browser');
        }

        this.synthesis = window.speechSynthesis;
        this.language = language;
        this.isSpeaking = false;
        this.currentUtterance = null;

        // Event handlers
        this.onStart = null;
        this.onEnd = null;
        this.onError = null;
    }

    /**
     * Get available voices for the current language
     */
    getVoices() {
        const voices = this.synthesis.getVoices();
        const languageCode = LANGUAGE_CODES[this.language] || 'en-US';

        // Filter voices for the selected language
        const matchingVoices = voices.filter(voice =>
            voice.lang.startsWith(languageCode.split('-')[0])
        );

        return matchingVoices.length > 0 ? matchingVoices : voices;
    }

    /**
     * Speak the given text
     * @param {string} text - Text to speak
     * @param {object} options - Optional configuration
     */
    speak(text, options = {}) {
        // Stop any ongoing speech
        this.stop();

        if (!text || text.trim().length === 0) {
            console.warn('[Voice] No text to speak');
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        this.currentUtterance = utterance;

        // Configuration
        utterance.lang = LANGUAGE_CODES[this.language] || 'en-US';
        utterance.rate = options.rate || 0.9; // Slightly slower for clarity
        utterance.pitch = options.pitch || 1.0;
        utterance.volume = options.volume || 1.0;

        // Try to use a native voice for the language
        const voices = this.getVoices();
        if (voices.length > 0) {
            // Prefer female voices, or first available
            const femaleVoice = voices.find(v => v.name.toLowerCase().includes('female'));
            utterance.voice = femaleVoice || voices[0];
            console.log(`[Voice] Using voice: ${utterance.voice.name}`);
        }

        // Event handlers
        utterance.onstart = () => {
            this.isSpeaking = true;
            console.log('[Voice] Started speaking');
            if (this.onStart) this.onStart();
        };

        utterance.onend = () => {
            this.isSpeaking = false;
            this.currentUtterance = null;
            console.log('[Voice] Finished speaking');
            if (this.onEnd) this.onEnd();
        };

        utterance.onerror = (event) => {
            this.isSpeaking = false;
            this.currentUtterance = null;
            console.error('[Voice] Synthesis error:', event.error);
            if (this.onError) {
                this.onError(`Speech synthesis error: ${event.error}`);
            }
        };

        // Speak
        try {
            this.synthesis.speak(utterance);
        } catch (error) {
            console.error('[Voice] Failed to speak:', error);
            if (this.onError) {
                this.onError('Failed to speak text. Please try again.');
            }
        }
    }

    /**
     * Stop speaking
     */
    stop() {
        if (this.synthesis.speaking) {
            this.synthesis.cancel();
            this.isSpeaking = false;
            this.currentUtterance = null;
            console.log('[Voice] Stopped speaking');
        }
    }

    /**
     * Pause speaking
     */
    pause() {
        if (this.synthesis.speaking && !this.synthesis.paused) {
            this.synthesis.pause();
            console.log('[Voice] Paused speaking');
        }
    }

    /**
     * Resume speaking
     */
    resume() {
        if (this.synthesis.paused) {
            this.synthesis.resume();
            console.log('[Voice] Resumed speaking');
        }
    }

    /**
     * Change language
     */
    setLanguage(language) {
        this.language = language;
        console.log(`[Voice] Synthesis language changed to: ${LANGUAGE_CODES[language]}`);
    }

    /**
     * Cleanup
     */
    destroy() {
        this.stop();
    }
}

/**
 * Complete Voice Service (combines Recognition + Synthesis)
 * Convenience wrapper for full voice interaction
 */
export class VoiceService {
    constructor(language = 'en') {
        this.language = language;
        this.recognition = null;
        this.synthesis = null;

        const support = isVoiceSupported();

        if (support.recognition) {
            this.recognition = new VoiceSpeechRecognition(language);
        }

        if (support.synthesis) {
            this.synthesis = new VoiceSpeechSynthesis(language);
        }

        if (!support.full) {
            console.warn('[Voice] Some speech features may not be available');
        }
    }

    /**
     * Start listening for voice input
     */
    startListening(callbacks = {}) {
        if (!this.recognition) {
            throw new Error('Speech recognition not supported');
        }

        this.recognition.onStart = callbacks.onStart;
        this.recognition.onTranscriptUpdate = callbacks.onTranscriptUpdate;
        this.recognition.onFinalTranscript = callbacks.onFinalTranscript;
        this.recognition.onEnd = callbacks.onEnd;
        this.recognition.onError = callbacks.onError;

        this.recognition.start();
    }

    /**
     * Stop listening
     */
    stopListening() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    /**
     * Speak text
     */
    speak(text, options = {}) {
        if (!this.synthesis) {
            throw new Error('Speech synthesis not supported');
        }

        this.synthesis.speak(text, options);
    }

    /**
     * Stop speaking
     */
    stopSpeaking() {
        if (this.synthesis) {
            this.synthesis.stop();
        }
    }

    /**
     * Change language for both recognition and synthesis
     */
    setLanguage(language) {
        this.language = language;

        if (this.recognition) {
            this.recognition.setLanguage(language);
        }

        if (this.synthesis) {
            this.synthesis.setLanguage(language);
        }
    }

    /**
     * Check if service is currently active
     */
    get isActive() {
        return {
            listening: this.recognition?.isListening || false,
            speaking: this.synthesis?.isSpeaking || false
        };
    }

    /**
     * Cleanup
     */
    destroy() {
        if (this.recognition) {
            this.recognition.destroy();
        }
        if (this.synthesis) {
            this.synthesis.destroy();
        }
    }
}

export default VoiceService;
