import React, { useState, useCallback, useEffect } from 'react';
import { AppState, CoachingPlan, Message, UserData, Feedback, RoleplayScenario, SessionMetrics, AudioMetrics, Drill, SessionMaterial } from './types';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Session from './components/Session';
import FeedbackView from './components/FeedbackView';
import Header from './components/Header';
import Footer from './components/Footer';
import RoleplaySelection from './components/RoleplaySelection';
import RoleplaySession from './components/RoleplaySession';
import SessionHistory from './components/SessionHistory';
import DrillSelection from './components/DrillSelection';
import DrillSession from './components/DrillSession';
import StructuringStudio from './components/StructuringStudio';
import AudienceSetup from './components/AudienceSetup';
import MaterialUpload from './components/MaterialUpload';
// FIX: Removed unused ErrorBoundary import. The component is already wrapped in `index.tsx`.
import { generateCoachingPlan, generateSessionFeedback } from './services/geminiService';
import { useTranslations } from './contexts/LanguageContext';
import { extractMetricsFromSession } from './utils/metricsExtractor';
import Login from './components/Login';
import Pricing from './components/Pricing';
import SignUp from './components/SignUp';
import LiveSession from './components/LiveSession';


// Key for storing the application's state in localStorage.
const APP_STORAGE_KEY = 'lidiaAiCoachSession';

/**
 * Retrieves the initial state of the application from localStorage.
 * If no saved state is found, it defaults to the login view.
 * This ensures the user's session is persisted across page reloads.
 */
const getInitialState = () => {
    try {
        const savedState = localStorage.getItem(APP_STORAGE_KEY);
        if (savedState) {
            const parsed = JSON.parse(savedState);
            // Basic validation to ensure the saved state is usable.
            if (parsed.currentView && Object.values(AppState).includes(parsed.currentView) && ![AppState.LOGIN, AppState.SIGNUP].includes(parsed.currentView)) {
                return {
                    ...parsed,
                    sessionVideoUrl: null, // Always reset video URL on load; it's not persisted.
                    progressHistory: parsed.progressHistory || [], // Ensure progress history exists
                };
            }
        }
    } catch (error) {
        console.error("Failed to parse state from localStorage", error);
    }
    // Default initial state if nothing is saved or parsing fails.
    return {
        currentView: AppState.LOGIN,
        userData: null,
        coachingPlan: null,
        feedback: null,
        sessionVideoUrl: null,
        progressHistory: [],
    };
};


/**
 * The main application component. It manages the overall application state,
 * navigation between different views (like a state machine), and data flow.
 */
const App: React.FC = () => {
  // Initialize state from localStorage or defaults.
  const initialState = getInitialState();
  const { setLanguage, t } = useTranslations();
  
  // --- STATE MANAGEMENT ---
  const [currentView, setCurrentView] = useState<AppState>(initialState.currentView);
  const [userData, setUserData] = useState<UserData | null>(initialState.userData);
  const [coachingPlan, setCoachingPlan] = useState<CoachingPlan | null>(initialState.coachingPlan);
  const [sessionTranscript, setSessionTranscript] = useState<Message[]>([]);
  const [feedback, setFeedback] = useState<Feedback | null>(initialState.feedback);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionVideoUrl, setSessionVideoUrl] = useState<string | null>(initialState.sessionVideoUrl);
  const [selectedScenario, setSelectedScenario] = useState<RoleplayScenario | null>(null);
  const [selectedDrill, setSelectedDrill] = useState<Drill | null>(null);
  const [sessionAudience, setSessionAudience] = useState<string | null>(null);
  const [sessionMaterial, setSessionMaterial] = useState<SessionMaterial | null>(null);
  const [sessionCustomQuestions, setSessionCustomQuestions] = useState<string>('');
  const [progressHistory, setProgressHistory] = useState<SessionMetrics[]>(initialState.progressHistory);

  /**
   * Effect hook to initialize the language context when the app loads
   * with existing user data.
   */
  useEffect(() => {
    if (initialState.userData?.language) {
      setLanguage(initialState.userData.language);
    }
  }, []); // Empty dependency array ensures this runs only once on mount.

  /**
   * Effect hook to persist the application's state to localStorage whenever
   * a key piece of data changes. This enables session restoration.
   */
  useEffect(() => {
    try {
        // Do not save the session video URL, as it can be very large and exceed localStorage quota.
        // It's a transient piece of state only needed for the immediate feedback view.
        const stateToSave = {
            currentView,
            userData,
            coachingPlan,
            feedback,
            progressHistory,
        };
        // Avoid overwriting a valid session with an empty login/onboarding state on hard refresh.
        if (![AppState.LOGIN, AppState.SIGNUP, AppState.ONBOARDING, AppState.PRICING].includes(currentView) || userData) {
             localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(stateToSave));
        }
    } catch (error) {
        console.error("Failed to save state to localStorage", error);
    }
  }, [currentView, userData, coachingPlan, feedback, progressHistory]);


  // --- HANDLER FUNCTIONS ---
  
  /**
   * Handles successful login and navigates to the onboarding screen if needed, or dashboard.
   */
  const handleLoginSuccess = useCallback(() => {
    // In a real app, you'd fetch user data here.
    // If the user has a plan, go to dashboard, otherwise onboarding.
    if (coachingPlan) {
        setCurrentView(AppState.DASHBOARD);
    } else {
        setCurrentView(AppState.ONBOARDING);
    }
  }, [coachingPlan]);

  /**
   * Navigates to the sign-up screen.
   */
  const handleNavigateToSignUp = useCallback(() => {
    setCurrentView(AppState.SIGNUP);
  }, []);
  
  /**
   * Navigates back to the login screen.
   */
  const handleNavigateToLogin = useCallback(() => {
    setCurrentView(AppState.LOGIN);
  }, []);

  /**
   * Handles successful sign-up and moves to the onboarding flow.
   */
  const handleSignUpSuccess = useCallback(() => {
      // In a real app, this would set the new user's context.
      // For the mock flow, we just proceed to onboarding.
      setCurrentView(AppState.ONBOARDING);
  }, []);

  /**
   * Handles the completion of the onboarding process.
   * It saves user data, the generated coaching plan, and navigates to pricing.
   */
  const handleOnboardingComplete = useCallback((data: UserData, plan: CoachingPlan) => {
    setError(null);
    setUserData(data);
    setLanguage(data.language); // Set global language context
    
    // Add a start date to the plan for progress tracking.
    const planWithDate: CoachingPlan = { ...plan, startDate: new Date().toISOString() };
    setCoachingPlan(planWithDate);
    setCurrentView(AppState.PRICING); // Navigate to pricing page
  }, [setLanguage]);
  
  /**
   * Handles the selection of a pricing plan.
   * This is a mock-up; in a real app, this would handle payment processing.
   */
  const handlePricingSelection = useCallback((plan: string) => {
    // In a real app, this would handle payment processing and saving the plan choice.
    setCurrentView(AppState.DASHBOARD);
  }, []);

  /**
   * Navigates to the audience setup screen before a practice session.
   */
  const handleStartSession = useCallback(() => {
    setSessionTranscript([]);
    setFeedback(null);
    setSessionVideoUrl(null);
    setSessionAudience(null);
    setSessionMaterial(null);
    setSelectedScenario(null);
    setSessionCustomQuestions('');
    setCurrentView(AppState.AUDIENCE_SELECTION);
  }, []);

  /**
   * Handles completion of the audience setup and navigates to the material upload screen.
   */
  const handleAudienceSetupComplete = useCallback((audience: string) => {
      setSessionAudience(audience);
      setCurrentView(AppState.MATERIAL_UPLOAD);
  }, []);

  /**
   * Handles completion of the material upload and navigates to the appropriate session.
   */
  const handleMaterialUploadComplete = useCallback((data: { material: SessionMaterial | null, customQuestions: string }) => {
    setSessionMaterial(data.material);
    setSessionCustomQuestions(data.customQuestions);
    // If a scenario is selected, go to roleplay; otherwise, go to a standard session.
    if (selectedScenario) {
        setCurrentView(AppState.ROLEPLAY_SESSION);
    } else {
        setCurrentView(AppState.SESSION);
    }
  }, [selectedScenario]);
  
  /**
   * Navigates to the roleplay scenario selection view.
   */
  const handleStartRoleplaySelection = useCallback(() => {
    setSelectedScenario(null);
    setSessionMaterial(null);
    setSessionCustomQuestions('');
    setCurrentView(AppState.ROLEPLAY_SELECTION);
  }, []);

  /**
   * Handles the selection of a roleplay scenario and navigates to the material upload screen.
   */
  const handleScenarioSelected = useCallback((scenario: RoleplayScenario) => {
    setSelectedScenario(scenario);
    setSessionTranscript([]);
    setFeedback(null);
    setSessionVideoUrl(null);
    setCurrentView(AppState.MATERIAL_UPLOAD);
  }, []);

  /**
   * Navigates to the drill selection view.
   */
  const handleStartDrillSelection = useCallback(() => {
    setCurrentView(AppState.DRILL_SELECTION);
  }, []);
  
  /**
   * Handles the selection of a drill and navigates to the drill session.
   */
  const handleDrillSelected = useCallback((drill: Drill) => {
    setSelectedDrill(drill);
    setCurrentView(AppState.DRILL_SESSION);
  }, []);

  /**
   * Handles the selection of a dynamically generated drill.
   */
  const handleStartDynamicDrill = useCallback((drill: Drill) => {
    setSelectedDrill(drill);
    setCurrentView(AppState.DRILL_SESSION);
  }, []);
  
  /**
   * Navigates to the Structuring Studio view.
   */
  const handleStartStructuring = useCallback(() => {
      setCurrentView(AppState.STRUCTURING_STUDIO);
  }, []);
  
  /**
   * Navigates to the Live Conversation view.
   */
  const handleStartLiveSession = useCallback(() => {
      setCurrentView(AppState.LIVE_SESSION);
  }, []);


  /**
   * Handles the end of a session, generates feedback, and updates progress history.
   */
  const handleEndSession = useCallback(async (transcript: Message[], videoUrl: string | null, audioMetrics: AudioMetrics, videoFrames: { timestamp: number; frame: string }[], audience: string | null, material: SessionMaterial | null, sessionType: string, scenario?: RoleplayScenario | null) => {
    setIsLoading(true);
    setError(null);
    setSessionTranscript(transcript);
    setSessionVideoUrl(videoUrl);
    setCurrentView(AppState.FEEDBACK); // Go to feedback view immediately to show loading state
    try {
      if (userData) {
        const sessionFeedback = await generateSessionFeedback(transcript, userData.language, audioMetrics, videoFrames, audience || undefined, material || undefined, scenario || undefined);
        setFeedback(sessionFeedback);
        
        // Extract key metrics from the session and add to progress history.
        const metrics = extractMetricsFromSession(transcript, sessionFeedback, sessionType);
        setProgressHistory(prev => [...prev, metrics]);

      } else {
        throw new Error("User data not found");
      }
    } catch(e) {
      console.error(e);
      // Always use the translated, generic error message for a consistent user experience.
      setError(e instanceof Error ? e.message : t('app.error.feedback'));
      setFeedback(null); // Ensure no stale feedback is shown on error
    } finally {
      setIsLoading(false);
    }
  }, [userData, t]);

  /**
   * Resets the entire application state to the beginning (login screen).
   */
  const handleRestart = useCallback(() => {
    localStorage.removeItem(APP_STORAGE_KEY);
    setCurrentView(AppState.LOGIN);
    setUserData(null);
    setCoachingPlan(null);
    setSessionTranscript([]);
    setFeedback(null);
    setSessionVideoUrl(null);
    setSelectedScenario(null);
    setSelectedDrill(null);
    setSessionAudience(null);
    setSessionMaterial(null);
    setSessionCustomQuestions('');
    setProgressHistory([]);
    setError(null);
    setLanguage('en'); // Reset to default language
  }, [setLanguage]);
  
  /**
   * Navigates the user back to the main dashboard.
   */
  const handleBackToDashboard = useCallback(() => {
      setCurrentView(AppState.DASHBOARD);
  }, []);

  /**
   * Navigates the user back to the roleplay selection screen.
   */
  const handleBackToRoleplaySelection = useCallback(() => {
      setCurrentView(AppState.ROLEPLAY_SELECTION);
  }, []);
  
  /**
   * Navigates back to the audience selection screen from the material upload screen.
   */
  const handleBackToAudienceSelection = useCallback(() => {
    setCurrentView(AppState.AUDIENCE_SELECTION);
  }, []);

  /**
   * Navigates the user back to the drill selection screen.
   */
  const handleBackToDrillSelection = useCallback(() => {
      setCurrentView(AppState.DRILL_SELECTION);
  }, []);

  /**
   * Navigates to the session history view.
   */
  const handleViewHistory = useCallback(() => {
    setCurrentView(AppState.SESSION_HISTORY);
  }, []);


  /**
   * Renders the current view based on the application's state (currentView).
   * Acts as a simple router.
   */
  const renderContent = () => {
    // Main view router logic.
    switch (currentView) {
      case AppState.LOGIN:
        return <Login onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={handleNavigateToSignUp} />;
      case AppState.SIGNUP:
        return <SignUp onSignUpSuccess={handleSignUpSuccess} onNavigateToLogin={handleNavigateToLogin} />;
      case AppState.ONBOARDING:
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case AppState.PRICING:
        return <Pricing onSelectPlan={handlePricingSelection} />;
      case AppState.DASHBOARD:
        return coachingPlan && userData ? <Dashboard plan={coachingPlan} userName={userData.name} progressHistory={progressHistory} onStartSession={handleStartSession} onStartRoleplay={handleStartRoleplaySelection} onStartDrill={handleStartDrillSelection} onStartStructuring={handleStartStructuring} onStartLiveSession={handleStartLiveSession} onViewHistory={handleViewHistory} /> : <Login onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={handleNavigateToSignUp} />;
      case AppState.AUDIENCE_SELECTION:
        return <AudienceSetup onComplete={handleAudienceSetupComplete} onBackToDashboard={handleBackToDashboard} />;
      case AppState.MATERIAL_UPLOAD:
        // Determine the correct "back" navigation based on whether we're in a roleplay or standard session flow.
        const onBack = selectedScenario ? handleBackToRoleplaySelection : handleBackToAudienceSelection;
        return <MaterialUpload onComplete={handleMaterialUploadComplete} onBack={onBack} selectedScenario={selectedScenario} />;
      case AppState.SESSION:
        return userData ? <Session onEndSession={handleEndSession} language={userData.language} onBackToDashboard={handleBackToDashboard} audience={sessionAudience} sessionMaterial={sessionMaterial} /> : <Login onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={handleNavigateToSignUp} />;
      case AppState.ROLEPLAY_SELECTION:
        return <RoleplaySelection onScenarioSelected={handleScenarioSelected} onBackToDashboard={handleBackToDashboard} />;
      case AppState.ROLEPLAY_SESSION:
        return userData && selectedScenario ? <RoleplaySession onEndSession={handleEndSession} language={userData.language} scenario={selectedScenario} onBackToScenarios={handleBackToRoleplaySelection} sessionMaterial={sessionMaterial} customQuestions={sessionCustomQuestions}/> : <Login onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={handleNavigateToSignUp} />;
      case AppState.DRILL_SELECTION:
        return <DrillSelection onDrillSelected={handleDrillSelected} onBackToDashboard={handleBackToDashboard} />;
      case AppState.DRILL_SESSION:
        return userData && selectedDrill ? <DrillSession drill={selectedDrill} language={userData.language} onBackToDrills={handleBackToDrillSelection} /> : <Login onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={handleNavigateToSignUp} />;
      case AppState.FEEDBACK:
        return <FeedbackView feedback={feedback} isLoading={isLoading} onBackToDashboard={handleBackToDashboard} onStartDynamicDrill={handleStartDynamicDrill} sessionVideoUrl={sessionVideoUrl} language={userData?.language || 'en'} error={error} />;
       case AppState.SESSION_HISTORY:
        return <SessionHistory history={progressHistory} onBackToDashboard={handleBackToDashboard} />;
       case AppState.STRUCTURING_STUDIO:
        return userData ? <StructuringStudio language={userData.language} onBackToDashboard={handleBackToDashboard} onProceedToSession={handleStartSession} /> : <Login onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={handleNavigateToSignUp} />;
      case AppState.LIVE_SESSION:
        return userData ? <LiveSession language={userData.language} onBackToDashboard={handleBackToDashboard} /> : <Login onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={handleNavigateToSignUp} />;
      default:
        // Fallback to login if the state is invalid.
        return <Login onLoginSuccess={handleLoginSuccess} onNavigateToSignUp={handleNavigateToSignUp} />;
    }
  };

  return (
    // FIX: Removed redundant ErrorBoundary. The App component is already wrapped by an
    // ErrorBoundary in `index.tsx`, which is sufficient for catching all app-level errors.
    <div className="flex flex-col min-h-screen bg-off-white font-sans text-brand-dark">
      <Header onRestart={handleRestart} />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        {renderContent()}
      </main>
      <Footer />
    </div>
  );
};

export default App;