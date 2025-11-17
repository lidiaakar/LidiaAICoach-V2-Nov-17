/**
 * Defines the possible views or states of the application, acting as a simple router.
 */
export enum AppState {
  LOGIN = 'LOGIN',
  SIGNUP = 'SIGNUP',
  ONBOARDING = 'ONBOARDING',
  PRICING = 'PRICING',
  DASHBOARD = 'DASHBOARD',
  AUDIENCE_SELECTION = 'AUDIENCE_SELECTION',
  MATERIAL_UPLOAD = 'MATERIAL_UPLOAD',
  SESSION = 'SESSION',
  FEEDBACK = 'FEEDBACK',
  ROLEPLAY_SELECTION = 'ROLEPLAY_SELECTION',
  ROLEPLAY_SESSION = 'ROLEPLAY_SESSION',
  SESSION_HISTORY = 'SESSION_HISTORY',
  DRILL_SELECTION = 'DRILL_SELECTION',
  DRILL_SESSION = 'DRILL_SESSION',
  STRUCTURING_STUDIO = 'STRUCTURING_STUDIO',
  LIVE_SESSION = 'LIVE_SESSION',
}

/**
 * A map of supported language codes to their full names for UI display.
 */
export const supportedLanguages = {
  en: 'English',
  tr: 'Türkçe',
  ur: 'اردو',
  hi: 'हिन्दी',
  pa: 'ਪੰਜਾਬੀ',
  es: 'Español',
  fr: 'Français',
  zh: '中文',
};

/**
 * A type representing the valid language codes, derived from the keys of supportedLanguages.
 */
export type LanguageCode = keyof typeof supportedLanguages;

/**
 * Represents the data collected from the user during the onboarding process.
 */
export interface UserData {
  name: string;
  goal: string;
  challenge: string;
  language: LanguageCode;
}

/**
 * Represents a single week within the personalized coaching plan.
 */
export interface CoachingPlanWeek {
  week: number;
  title: string;
  focus: string;
  tasks: string[];
}

/**
 * Represents the entire 4-week coaching plan generated for the user.
 */
export interface CoachingPlan {
  title: string;
  weeks: CoachingPlanWeek[];
  startDate?: string; // ISO string format
}

/**
 * Represents a single message in the chat transcript, from either the user or the AI assistant.
 */
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Represents a single piece of feedback, which can optionally be linked to a specific
 * timestamp in the session recording.
 */
export interface FeedbackItem {
  text: string;
  timestamp?: number;
}

/**
 * Represents a single piece of feedback from a simulated audience persona.
 */
export interface PersonaFeedbackItem {
  persona: string;
  feedback: string;
  timestamp?: number;
}

/**
 * Represents the complete feedback report generated after a session.
 * This new structure is built around three core pillars: Message, Delivery, and Presence.
 */
export interface Feedback {
  summary: string;
  keyTakeaways: FeedbackItem[];
  wins: FeedbackItem[];
  nextSteps: FeedbackItem[];
  messageAnalysis: FeedbackItem[];
  deliveryAnalysis: FeedbackItem[];
  presenceAnalysis: FeedbackItem[];
  performanceScores: {
      clarity: number;
      confidence: number;
      engagement: number;
  };
  personaFeedback?: PersonaFeedbackItem[];
  materialAlignment?: FeedbackItem[];
}


/**
 * Represents a roleplay scenario that the user can choose to practice.
 * The strings are keys for the translation file to support multiple languages.
 */
export interface RoleplayScenario {
  id: string;
  titleKey: string;
  descriptionKey: string;
  systemPromptKey: string;
}

/**
 * Represents the aggregated metrics extracted from a single practice session,
 * used for tracking progress over time.
 */
export interface SessionMetrics {
  sessionId: string;
  date: string;
  sessionType: string;
  fillerWordCount: number;
  paceScore: number; // A score from 0-100 representing speaking pace.
  vocalEnergyScore: number; // A score from 0-100 representing vocal energy and tone.
  strengths: string[];
}

/**
 * Represents the quantifiable audio metrics calculated from the user's voice
 * during a recorded session.
 */
export interface AudioMetrics {
  pitchVariation: number; // Standard deviation of pitch, indicating vocal dynamism.
  volumeVariation: number; // Standard deviation of volume, indicating vocal energy.
}

/**
 * Represents a short, focused micro-practice drill.
 * Can be either a static drill (with translation keys) or a dynamic one (with direct content).
 */
export interface Drill {
    id: string;
    // For static, translatable drills
    titleKey?: string;
    descriptionKey?: string;
    promptKey?: string;
    contentKey?: string;
    // For dynamically generated drills
    title?: string;
    description?: string;
    feedbackPrompt?: string;
    // Universal property for timed drills
    duration?: number; // duration in seconds
}

/**
 * Represents a file (e.g., presentation, document) uploaded by the user for a session.
 * The content is stored as a Base64 encoded string.
 */
export interface SessionMaterial {
    name: string;
    type: string; // MIME type
    content: string; // Base64 encoded content
}