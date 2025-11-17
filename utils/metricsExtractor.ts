import { Message, Feedback, SessionMetrics } from '../types';

// A basic list of English filler words. For a multi-language app, this would need to be expanded
// and dynamically selected based on the user's language.
const FILLER_WORDS_EN = ['um', 'uh', 'ah', 'er', 'like', 'you know', 'so', 'actually', 'basically', 'literally', 'i mean'];

/**
 * Scores a vocal attribute (like energy or pace) on a scale of 0-100 based on keywords
 * found in the AI's feedback text.
 * @param feedbackItems The array of feedback items to analyze.
 * @returns A score between 0 and 100.
 */
const scoreVocalAttribute = (feedbackItems: { text: string }[]): number => {
    if (!feedbackItems || feedbackItems.length === 0) return 50; // Return a neutral score if no relevant feedback exists.

    let score = 50; // Start with a neutral score.
    const positiveKeywords = ['energetic', 'dynamic', 'engaging', 'confident', 'clear', 'varied', 'steady', 'strong'];
    const negativeKeywords = ['monotonous', 'hesitant', 'rushed', 'slow', 'flat', 'passive', 'unclear'];
    
    // Combine all feedback text into a single string for analysis.
    const feedbackText = feedbackItems.map(item => item.text.toLowerCase()).join(' ');

    // Adjust score based on positive keywords.
    positiveKeywords.forEach(word => {
        if (feedbackText.includes(word)) {
            score += 15;
        }
    });

    // Adjust score based on negative keywords.
    negativeKeywords.forEach(word => {
        if (feedbackText.includes(word)) {
            score -= 15;
        }
    });

    return Math.max(0, Math.min(100, score)); // Clamp the score to be within 0 and 100.
};

/**
 * Extracts and calculates key performance metrics from a completed session's transcript
 * and feedback report. This data is used for the Progress Dashboard.
 * @param transcript The session's chat transcript.
 * @param feedback The AI-generated feedback for the session.
 * @param sessionType A string describing the type of session (e.g., 'Job Interview').
 * @returns A SessionMetrics object containing the calculated data.
 */
export const extractMetricsFromSession = (transcript: Message[], feedback: Feedback, sessionType: string): SessionMetrics => {
    // Combine all user messages into a single string.
    const userTranscript = transcript
        .filter(m => m.role === 'user')
        .map(m => m.content)
        .join(' ');

    // Count filler words.
    const words = userTranscript.toLowerCase().split(/\s+/);
    const fillerWordCount = words.filter(word => FILLER_WORDS_EN.includes(word.replace(/[,.]/g, ''))).length;

    // Generate scores for pacing and vocal energy based on the AI's delivery analysis.
    const paceScore = scoreVocalAttribute(feedback.deliveryAnalysis.filter(item => item.text.toLowerCase().includes('pace') || item.text.toLowerCase().includes('slow') || item.text.toLowerCase().includes('rushed')));
    const vocalEnergyScore = scoreVocalAttribute(feedback.deliveryAnalysis.filter(item => item.text.toLowerCase().includes('energy') || item.text.toLowerCase().includes('tone') || item.text.toLowerCase().includes('pitch')));

    return {
        sessionId: new Date().toISOString(), // Use ISO string as a unique ID.
        date: new Date().toLocaleDateString(),
        sessionType: sessionType,
        fillerWordCount,
        paceScore,
        vocalEnergyScore,
        strengths: feedback.wins.map(s => s.text), // Extract the text of wins for the word cloud.
    };
};