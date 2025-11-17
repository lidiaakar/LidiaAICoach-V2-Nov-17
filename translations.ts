import { LanguageCode } from './types';

/**
 * This file contains all the UI strings for the application, organized by language code.
 * The `t` function in the LanguageContext uses these nested objects to find the correct
 * string for the currently selected language.
 *
 * To add a new string:
 * 1. Add a key-value pair to the `en` (English) object.
 * 2. Add the corresponding key-value pair to all other language objects with the translated text.
 *
 * The keys are structured with a `.` notation (e.g., 'header.title') for better organization.
 */

type Translations = {
  [key: string]: string;
};

const translations: Record<LanguageCode, Translations> = {
  en: {
    // Header
    'header.title': 'Lidia',
    'header.subtitle': 'AI Coach',
    'header.newPlan': 'Start New Plan',
    // Footer
    'footer.copyright': "© {year} Lidia AI Coach by Lighthauz Consulting & Coaching. Elevate Your Voice.",
    // Login
    'login.welcome': 'Welcome Back',
    'login.intro': 'Sign in to continue your coaching journey.',
    'login.email.label': 'Email Address',
    'login.email.placeholder': 'you@example.com',
    'login.password.label': 'Password',
    'login.password.placeholder': '••••••••',
    'login.forgotPassword': 'Forgot Password?',
    'login.resetEmailSent': 'Password reset email sent. Please check your inbox.',
    'login.button.login': 'Login',
    'login.signup.text': "Don't have an account?",
    'login.signup.link': 'Sign Up',
    // SignUp
    'signup.welcome': 'Create Your Account',
    'signup.intro': 'Join Lidia and start your journey to confident communication.',
    'signup.name.label': 'Full Name',
    'signup.name.placeholder': 'Alex Chen',
    'signup.email.label': 'Email Address',
    'signup.email.placeholder': 'you@example.com',
    'signup.password.label': 'Create Password',
    'signup.password.placeholder': '••••••••',
    'signup.confirmPassword.label': 'Confirm Password',
    'signup.confirmPassword.placeholder': '••••••••',
    'signup.button.create': 'Create Account',
    'signup.login.text': 'Already have an account?',
    'signup.login.link': 'Login',
    // Onboarding
    'onboarding.welcome': 'Welcome to Your AI Communication Coach',
    'onboarding.intro': "Let's start by understanding your goals. A personalized plan awaits.",
    'onboarding.name.label': 'What should I call you?',
    'onboarding.name.placeholder': 'e.g., Alex',
    'onboarding.goal.label': "What's your primary goal?",
    'onboarding.goal.placeholder': 'Select a goal...',
    'onboarding.goal.option1': 'Ace my next job interview',
    'onboarding.goal.option2': 'Deliver a compelling presentation',
    'onboarding.goal.option3': 'Lead meetings with more confidence',
    'onboarding.goal.option4': 'Improve my public speaking skills',
    'onboarding.goal.option5': 'Effectively pitch my startup idea',
    'onboarding.challenge.label': "What's your biggest challenge right now?",
    'onboarding.challenge.placeholder': "e.g., 'I use too many filler words like um'",
    'onboarding.language.label': 'Preferred Language',
    'onboarding.button.create': 'Create My Personalized Plan',
    'onboarding.button.loading': 'Generating Your Plan...',
    // Pricing
    'pricing.title': 'Choose Your Plan',
    'pricing.intro': 'Unlock your full potential with the right plan for your journey.',
    'pricing.free.title': 'Free',
    'pricing.free.price': 'Free',
    'pricing.free.description': 'For individuals getting started with communication coaching.',
    'pricing.free.feature1': 'Personalized coaching plan',
    'pricing.free.feature2': '3 practice sessions per month',
    'pricing.free.feature3': 'Basic feedback reports',
    'pricing.free.feature4': 'Access to all standard drills',
    'pricing.pro.title': 'Pro',
    'pricing.pro.price': '$29 / month',
    'pricing.pro.description': 'For professionals committed to mastering their communication skills.',
    'pricing.pro.popular': 'Most Popular',
    'pricing.pro.feature1': 'Everything in Free, plus:',
    'pricing.pro.feature2': 'Unlimited practice sessions',
    'pricing.pro.feature3': 'Advanced AI feedback with persona simulation',
    'pricing.pro.feature4': 'Session recording and video analysis',
    'pricing.pro.feature5': 'Progress tracking dashboard',
    'pricing.pro.feature6': 'Dynamic, AI-generated drills',
    'pricing.enterprise.title': 'Enterprise',
    'pricing.enterprise.price': 'Custom',
    'pricing.enterprise.description': 'For teams and organizations looking to elevate communication skills at scale.',
    'pricing.enterprise.feature1': 'Everything in Pro, plus:',
    'pricing.enterprise.feature2': 'Team dashboards and reporting',
    'pricing.enterprise.feature3': 'Custom roleplay scenarios',
    'pricing.enterprise.feature4': 'Dedicated account manager',
    'pricing.enterprise.feature5': 'Priority support',
    'pricing.button.choose': 'Choose Plan',
    'pricing.button.contact': 'Contact Sales',
    // Dashboard
    'dashboard.title': 'Your Coaching Journey, {name}',
    'dashboard.week': 'Week {week}',
    'dashboard.tasks': 'Your Tasks:',
    'dashboard.button.start': 'Start a Practice Session',
    'dashboard.button.start.desc': 'Begin a guided session with Lidia to practice your speaking goals.',
    'dashboard.button.roleplay': 'Practice a Scenario',
    'dashboard.button.roleplay.desc': 'Simulate real-world conversations like interviews or pitches.',
    'dashboard.button.drill': 'Practice a Drill',
    'dashboard.button.drill.desc': 'Hone a specific skill with short, focused exercises.',
    'dashboard.button.history': 'View Session History',
    'dashboard.button.history.desc': 'Review feedback and metrics from your past sessions.',
    'dashboard.button.structure': 'Structure Thoughts',
    'dashboard.button.structure.desc': 'Organize your thoughts with AI before you speak.',
    'dashboard.button.live': 'Live Conversation',
    'dashboard.button.live.desc': 'Have a real-time, low-latency voice chat with Lidia.',
    'dashboard.progress.title': 'Quick Progress',
    'dashboard.progress.sessions': 'Sessions Completed',
    'dashboard.progress.lastPace': 'Last Pace Score',
    'dashboard.progress.lastEnergy': 'Last Energy Score',
    'dashboard.progress.none': 'Complete a session to see your progress here!',
    'dashboard.plan.title': 'Your 4-Week Coaching Plan',
    'dashboard.button.startNow': 'Start Now',
    'dashboard.plan.currentWeek': 'Current Week',
    'dashboard.plan.metrics.title': 'Weekly Performance',
    'dashboard.plan.metrics.pace': 'Avg. Pace',
    'dashboard.plan.metrics.energy': 'Avg. Vocal Energy',
    'dashboard.plan.metrics.sessions': 'Sessions',
    'dashboard.plan.metrics.noData': 'No sessions completed this week.',
    // Audience Setup
    'audience.setup.title': 'Define Your Audience',
    'audience.setup.intro': 'For more targeted feedback, describe who you\'re speaking to. This helps Lidia simulate different perspectives.',
    'audience.setup.placeholder': 'e.g., "A skeptical board of directors", "A group of non-technical stakeholders", "An enthusiastic university classroom"',
    'audience.setup.button.start': 'Start Session with Audience',
    'audience.setup.button.skip': 'Skip & Start General Session',
    // Material Upload
    'material.upload.title': 'Upload Session Material',
    'material.upload.intro': 'Have a presentation or document? Upload it here for more context-aware feedback.',
    'material.upload.button.upload': 'Choose File (PDF, PNG, JPG)',
    'material.upload.button.start': 'Start Session with Material',
    'material.upload.button.skip': 'Continue without Material',
    'material.upload.fileInfo': 'Selected: {fileName}',
    'material.upload.questions.title': 'Or, Add Custom Interview Questions',
    'material.upload.questions.placeholder': 'Paste your questions here, one per line...',
    'material.upload.button.startWithBoth': 'Start with Material & Questions',
    'material.upload.button.startWithQuestions': 'Start with Questions',
    // Roleplay Selection
    'roleplay.selection.title': 'Practice a Scenario',
    'roleplay.selection.intro': 'Choose a scenario to practice your skills in a simulated environment.',
    'roleplay.button.start': 'Start Scenario',
    // Drill Selection
    'drill.selection.title': 'Practice a Specific Skill',
    'drill.selection.intro': 'Choose a short, focused drill to refine a single aspect of your communication.',
    'drill.button.start': 'Start Drill',
    // Drills
    'drill.filler.title': 'Filler Word Elimination',
    'drill.filler.description': 'Describe a simple object for 60 seconds without using any filler words like "um", "uh", or "like".',
    'drill.pacing.title': 'Pacing Practice',
    'drill.pacing.description': 'Read the provided paragraph aloud at a steady, conversational pace.',
    'drill.pacing.content': 'The sun dipped below the horizon, painting the sky in shades of orange and purple. A gentle breeze rustled the leaves of the old oak tree, and the first stars of the evening began to appear, twinkling like tiny diamonds scattered across a velvet cloth.',
    'drill.concise.title': 'Conciseness Challenge',
    'drill.concise.description': 'Explain a complex topic (e.g., "how does the internet work?") in 30 seconds or less.',
    'drill.tone.title': 'Vocal Tone Practice',
    'drill.tone.description': 'Read the same sentence with three different emotions: happy, sad, and angry.',
    'drill.tone.content': 'I can\'t believe it\'s already here.',
    'drill.pause.title': 'Strategic Pausing',
    'drill.pause.description': 'Read the following text, pausing intentionally at each comma and period to emphasize your points.',
    'drill.pause.content': 'In today\'s market, there are three key challenges. First, competition. Second, innovation. And third, customer retention. If we focus, we will succeed.',
    // Drill Session
    'drill.session.title': 'Drill: {drillTitle}',
    'drill.session.instructions': 'Instructions',
    'drill.session.start': 'Start Drill',
    'drill.session.stop': 'Stop & Get Feedback',
    'drill.session.loading': 'Analyzing your performance...',
    'drill.session.feedbackTitle': 'Instant Feedback',
    'drill.session.tryAgain': 'Try Again',
    'drill.session.backToDrills': 'Back to Drills',
    'drill.session.getReady': 'Get Ready...',
    'drill.session.go': 'Go!',
    'drill.feedback.score': 'Score',
    'drill.feedback.level': 'Level',
    'drill.feedback.actionSteps': 'Action Steps',
    'drill.feedback.rewrites': 'Suggested Rewrites',
    'drill.feedback.nextLevel': 'To Reach the Next Level',
    'drill.feedback.motivation': 'Keep in Mind',
    // Scenarios
    'roleplay.scenario.interview.title': 'Job Interview',
    'roleplay.scenario.interview.description': 'Practice answering common interview questions with an HR manager.',
    'roleplay.scenario.interview.prompt': `SYSTEM INSTRUCTION — INTERVIEW SIMULATION MODE ONLY

⚠️ Scope:
This instruction applies **exclusively** to the “Interview Practice Session” feature.
Your persona is strictly that of an interviewer, NOT a coach.

---------------------------------------------
IDENTITY
---------------------------------------------
You are a **Senior Hiring Manager** at a top-tier global company (e.g., Google, McKinsey, Apple).
You are a seasoned, professional, and objective interviewer. You are NOT Lidia AI. Your goal is to evaluate the candidate.

Your mission: Conduct the world’s most realistic and challenging **mock interview simulation**.

---------------------------------------------
PURPOSE
---------------------------------------------
Simulate an authentic, professional job interview to assess the user's skills. You are an evaluator, not a coach. Your sole focus is asking questions and listening to the answers.

---------------------------------------------
SESSION FLOW LOGIC
---------------------------------------------

1️⃣ **START-UP PHASE**
- Greet the user professionally.
- Ask the following setup questions to tailor the interview:
  • “Which role are you applying for?”
  • “What level is it (entry, mid, senior, executive)?”
  • “What industry or type of company?”
- Based on their answers, adopt the appropriate tone (e.g., corporate, startup, technical).

2️⃣ **INTERVIEW PHASE**
- Conduct a realistic, challenging interview using a mix of:
  • **Behavioral questions** (“Tell me about a time you…”)
  • **Situational questions** (“What would you do if…”)
  • **Technical questions** (if relevant to the user’s role/industry)
  • **Leadership and values questions** (“How do you handle conflict?”)
- Adapt question complexity based on user responses.
- Probe deeper when an answer is incomplete (“Can you elaborate on the result?”).
- Maintain a professional, neutral conversational flow.
- Allow the conversation to proceed until the user ends the session.

---------------------------------------------
BEHAVIORAL GUIDELINES & TONE
---------------------------------------------
- **Maintain Strict Neutrality:** Your tone is professional, objective, and calm. You are polite but not overly friendly or encouraging.
- **NO COACHING OR FEEDBACK:** Do NOT provide any hints, feedback, validation ("That's a great answer"), or encouragement ("Take your time," "No worries") during the interview. The feedback will be provided after the session is complete.
- **Handling Pauses:** If the user pauses or struggles, remain silent and wait patiently for them to formulate their response. This simulates the pressure of a real interview.
- **Sound Human and Professional:** Emulate a real, senior interviewer. Use natural language and pacing.
- **Stay in Character:** Do not break character. If the user asks for help or feedback, politely state that you can discuss their performance after the interview is concluded.
- Your entire focus is on **simulating a real interview**, not on coaching.

---------------------------------------------
END GOAL
---------------------------------------------
Provide the world’s most authentic and challenging **Interview Practice Simulation**.
This allows the user to practice in a high-stakes environment. The coaching and analysis will happen *after* this simulation is complete. You MUST conduct the entire conversation in {languageName}.`,
    'roleplay.scenario.pitch.title': 'Startup Pitch',
    'roleplay.scenario.pitch.description': 'Pitch your idea to a skeptical but fair venture capitalist.',
    'roleplay.scenario.pitch.prompt': "You are a venture capitalist named David. You are skeptical but fair. The user is pitching their startup idea to you. Ask tough but relevant questions about their business model, market size, and competition. For example: 'What's your customer acquisition strategy?' and 'How is this different from your main competitors?'. Your goal is to test the strength of their pitch. You MUST conduct the entire conversation in {languageName}.",
    'roleplay.scenario.panel.title': 'Panel Q&A',
    'roleplay.scenario.panel.description': 'Face questions from a panel moderator after a presentation.',
    'roleplay.scenario.panel.prompt': "You are a panel moderator named Maria. The user has just finished a presentation, and now it's time for Q&A. Ask insightful and challenging questions related to a general business topic. For example: 'How do you see this industry evolving in the next 5 years?' and 'What are the ethical implications of this technology?'. Your tone is professional and inquisitive. You MUST conduct the entire conversation in {languageName}.",
    // Session
    'session.title': 'Practice Session',
    'session.roleplay.title': 'Roleplay: {scenario}',
    'session.input.placeholder': 'Type your response or use the mic...',
    'session.button.startRecording': 'Start Recording',
    'session.button.stopRecording': 'Stop Recording & Get Feedback',
    'session.end.noSave': 'or End without Saving',
    'session.end.noRecord': 'End Session without Recording',
    'session.voice.on': 'Enable Voice Output',
    'session.voice.off': 'Disable Voice Output',
    'session.mic.listen': 'Talk to Lidia',
    'session.mic.stop': 'Stop Talking',
    'session.mic.unsupported': 'Voice input is not supported by your browser.',
    'session.ghostMode.on': 'Disable Ghost Mode',
    'session.ghostMode.off': 'Enable Ghost Mode',
    'session.button.viewMaterial': 'View Material',
    'session.material.close': 'Close Material',
    'session.lidia.thinking': 'Lidia is thinking...',
    // Live Co-Pilot
    'copilot.fillerWords': 'Filler Words',
    'copilot.speakingPace': 'WPM',
    'copilot.pace.slow': 'Slow',
    'copilot.pace.ideal': 'Ideal',
    'copilot.pace.fast': 'Fast',
    // Live Session
    'live.session.title': 'Live Conversation',
    'live.session.connecting': 'Connecting...',
    'live.session.connected': 'Connected. Start speaking.',
    'live.session.error': 'Connection Error',
    'live.session.disconnected': 'Disconnected',
    'live.session.end': 'End Conversation',
    // Feedback
    'feedback.title': 'Session Feedback',
    'feedback.intro': "Here's a breakdown of your performance and your path forward.",
    'feedback.loading.title': "Lidia is analyzing your session...",
    'feedback.loading.subtitle': 'Crafting your personalized feedback.',
    'feedback.loading.cameraOff': 'Camera Off',
    'feedback.video.title': 'Your Session Recording',
    'feedback.summary': 'Summary',
    'feedback.strengths': 'What Went Well',
    'feedback.improvements': 'Areas to Improve',
    'feedback.actionItems': 'Your Action Items',
    'feedback.vocalAnalysis': 'Vocal Analysis',
    'feedback.nonVerbalAnalysis': 'Non-Verbal Analysis',
    'feedback.personaFeedback': 'Audience Perspectives',
    'feedback.materialAlignment': 'Material Alignment',
    'feedback.styleGuideAlignment': 'Style Guide Alignment',
    'feedback.performanceSnapshot': 'Performance Snapshot',
    'feedback.clarity': 'Clarity',
    'feedback.confidence': 'Confidence',
    'feedback.engagement': 'Engagement',
    'feedback.keyTakeaways': 'Key Takeaways',
    'feedback.wins': 'What Went Well',
    'feedback.nextSteps': 'Actionable Next Steps',
    'feedback.messageAnalysis': 'Message (Content & Structure)',
    'feedback.deliveryAnalysis': 'Delivery (Vocal Dynamics)',
    'feedback.presenceAnalysis': 'Presence (Body Language)',
    'feedback.vocalVariety': 'Vocal Variety',
    'feedback.vocalEnergy': 'Vocal Energy',
    'feedback.button.back': 'Back to Dashboard',
    'feedback.button.drill': 'Practice Your Improvements',
    'feedback.button.drillLoading': 'Creating Your Drill...',
    'feedback.error.title': 'No Feedback Available',
    'feedback.error.message': 'Something went wrong while generating your feedback.',
    'feedback.timestamp.goto': 'Go to {time}',
    // Session History
    'history.title': 'Your Session History',
    'history.intro': 'Review your past sessions and track your improvement over time.',
    'history.noSessions': 'You haven\'t completed any sessions yet. Start a practice session to see your history!',
    'history.table.type': 'Session Type',
    'history.table.date': 'Date',
    'history.table.fillers': 'Fillers',
    'history.table.pace': 'Pace',
    'history.table.energy': 'Energy',
    // Progress Dashboard
    'progress.title': 'Your Progress Dashboard',
    'progress.intro': 'Track your growth, celebrate milestones, and see how far you\'ve come.',
    'progress.chart.fillers.title': 'Filler Words Over Time',
    'progress.chart.vocalEnergy.title': 'Latest Vocal Energy Score',
    'progress.chart.paceScore.title': 'Latest Pace Score',
    'progress.wordcloud.title': 'Your Strength Cloud',
    'progress.milestones.title': 'Your Milestones',
    'progress.milestones.firstSession.title': 'First Step',
    'progress.milestones.firstSession.description': 'You completed your very first practice session!',
    'progress.milestones.fiveSessions.title': 'Consistent Performer',
    'progress.milestones.fiveSessions.description': 'You\'ve completed five practice sessions. Keep it up!',
    'progress.milestones.fillerWords.title': 'Clarity Champion',
    'progress.milestones.fillerWords.description': 'Completed a session with less than 5 filler words.',
    'progress.button.back': 'Back to Dashboard',
    // Structuring Studio
    'studio.title': 'Structuring Studio',
    'studio.intro': 'Organize your thoughts before you practice. Brain-dump your ideas below and let Lidia help you refine them.',
    'studio.input.placeholder': 'Enter your raw notes, bullet points, or ideas here...',
    'studio.output.placeholder': 'Your structured text will appear here...',
    'studio.button.organize': 'Clarify & Organize',
    'studio.button.star': 'Apply STAR Method',
    'studio.button.core': 'Find Core Message',
    'studio.button.findStat': 'Find Supporting Stat',
    'studio.button.addStat': 'Add to Notes',
    'studio.stat.source': 'Source: {source}',
    'studio.button.loading': 'Structuring...',
    'studio.button.proceed': 'Proceed to Practice Session',
    'studio.button.speak': 'Speak Your Thoughts',
    'studio.button.stopSpeaking': 'Stop Listening',
    'studio.button.dictate': 'Dictate Notes',
    'studio.button.dictating': 'Dictating...',
    'studio.prompt.organize': 'You are an expert communication coach. The user has provided their raw notes. Please clarify and organize these notes into a logical structure with a clear introduction, main points, and a conclusion. Respond ONLY with the structured text. Respond in {languageName}. Notes: ',
    'studio.prompt.star': 'You are an expert interview coach. The user has provided notes for a behavioral interview question. Please restructure their notes into the STAR (Situation, Task, Action, Result) method. Respond ONLY with the structured text, using clear headings for each section. Respond in {languageName}. Notes: ',
    'studio.prompt.core': 'You are an expert strategist. The user has provided a block of text. Analyze it and extract the single most important core message or thesis statement. Respond ONLY with that single sentence. Respond in {languageName}. Text: ',
    // App Errors & Navigation
    'app.error.plan': 'Could not create your plan.',
    'app.error.feedback': 'Could not generate your feedback. Please check your connection and try again.',
    'app.button.startOver': 'Start Over',
    'button.backToDashboard': 'Back to Dashboard',
    'button.backToScenarios': 'Back to Scenarios',
    'button.backToDrills': 'Back to Drills',
    'button.backToAudience': 'Back to Audience Setup',
  },
  es: {
    'header.title': 'Lidia',
    'header.subtitle': 'Coach de IA',
    'header.newPlan': 'Comenzar Nuevo Plan',
    'footer.copyright': "© {year} Lidia AI Coach por Lighthauz Consulting & Coaching. Eleva Tu Voz.",
    'login.welcome': 'Bienvenido de Nuevo',
    'login.intro': 'Inicia sesión para continuar tu viaje de coaching.',
    'login.email.label': 'Dirección de Correo Electrónico',
    'login.email.placeholder': 'tu@ejemplo.com',
    'login.password.label': 'Contraseña',
    'login.password.placeholder': '••••••••',
    'login.forgotPassword': '¿Olvidaste tu contraseña?',
    'login.resetEmailSent': 'Se ha enviado un correo electrónico para restablecer la contraseña. Revisa tu bandeja de entrada.',
    'login.button.login': 'Iniciar Sesión',
    'login.signup.text': '¿No tienes una cuenta?',
    'login.signup.link': 'Regístrate',
    'signup.welcome': 'Crea Tu Cuenta',
    'signup.intro': 'Únete a Lidia y comienza tu viaje hacia una comunicación segura.',
    'signup.name.label': 'Nombre Completo',
    'signup.name.placeholder': 'Alex García',
    'signup.email.label': 'Dirección de Correo Electrónico',
    'signup.email.placeholder': 'tu@ejemplo.com',
    'signup.password.label': 'Crear Contraseña',
    'signup.password.placeholder': '••••••••',
    'signup.confirmPassword.label': 'Confirmar Contraseña',
    'signup.confirmPassword.placeholder': '••••••••',
    'signup.button.create': 'Crear Cuenta',
    'signup.login.text': '¿Ya tienes una cuenta?',
    'signup.login.link': 'Iniciar Sesión',
    'onboarding.welcome': 'Bienvenido a Tu Entrenador de Comunicación con IA',
    'onboarding.intro': 'Comencemos por entender tus objetivos. Un plan personalizado te espera.',
    'onboarding.name.label': '¿Cómo debo llamarte?',
    'onboarding.name.placeholder': 'ej., Alex',
    'onboarding.goal.label': '¿Cuál es tu objetivo principal?',
    'onboarding.goal.placeholder': 'Selecciona un objetivo...',
    'onboarding.goal.option1': 'Superar mi próxima entrevista de trabajo',
    'onboarding.goal.option2': 'Realizar una presentación convincente',
    'onboarding.goal.option3': 'Liderar reuniones con más confianza',
    'onboarding.goal.option4': 'Mejorar mis habilidades para hablar en público',
    'onboarding.goal.option5': 'Presentar eficazmente mi idea de startup',
    'onboarding.challenge.label': '¿Cuál es tu mayor desafío en este momento?',
    'onboarding.challenge.placeholder': "ej., 'Uso demasiadas muletillas como um'",
    'onboarding.language.label': 'Idioma Preferido',
    'onboarding.button.create': 'Crear Mi Plan Personalizado',
    'onboarding.button.loading': 'Generando Tu Plan...',
    'pricing.title': 'Elige Tu Plan',
    'pricing.intro': 'Desbloquea todo tu potencial con el plan adecuado para tu viaje.',
    'pricing.free.title': 'Gratis',
    'pricing.free.price': 'Gratis',
    'pricing.free.description': 'Para individuos que comienzan con el coaching de comunicación.',
    'pricing.free.feature1': 'Plan de coaching personalizado',
    'pricing.free.feature2': '3 sesiones de práctica al mes',
    'pricing.free.feature3': 'Informes de feedback básicos',
    'pricing.free.feature4': 'Acceso a todos los ejercicios estándar',
    'pricing.pro.title': 'Pro',
    'pricing.pro.price': '29 $ / mes',
    'pricing.pro.description': 'Para profesionales comprometidos a dominar sus habilidades de comunicación.',
    'pricing.pro.popular': 'Más Popular',
    'pricing.pro.feature1': 'Todo en Gratis, más:',
    'pricing.pro.feature2': 'Sesiones de práctica ilimitadas',
    'pricing.pro.feature3': 'Feedback avanzado de IA con simulación de persona',
    'pricing.pro.feature4': 'Grabación de sesiones y análisis de video',
    'pricing.pro.feature5': 'Panel de seguimiento de progreso',
    'pricing.pro.feature6': 'Ejercicios dinámicos generados por IA',
    'pricing.enterprise.title': 'Empresarial',
    'pricing.enterprise.price': 'Personalizado',
    'pricing.enterprise.description': 'Para equipos y organizaciones que buscan elevar las habilidades de comunicación a escala.',
    'pricing.enterprise.feature1': 'Todo en Pro, más:',
    'pricing.enterprise.feature2': 'Paneles de equipo e informes',
    'pricing.enterprise.feature3': 'Escenarios de roleplay personalizados',
    'pricing.enterprise.feature4': 'Gerente de cuenta dedicado',
    'pricing.enterprise.feature5': 'Soporte prioritario',
    'pricing.button.choose': 'Elegir Plan',
    'pricing.button.contact': 'Contactar a Ventas',
    'dashboard.title': 'Tu Viaje de Coaching, {name}',
    'dashboard.week': 'Semana {week}',
    'dashboard.tasks': 'Tus Tareas:',
    'dashboard.button.start': 'Iniciar una Sesión de Práctica',
    'dashboard.button.start.desc': 'Comienza una sesión guiada con Lidia para practicar tus objetivos de habla.',
    'dashboard.button.roleplay': 'Practicar un Escenario',
    'dashboard.button.roleplay.desc': 'Simula conversaciones del mundo real como entrevistas o presentaciones.',
    'dashboard.button.drill': 'Practicar un Ejercicio',
    'dashboard.button.drill.desc': 'Perfecciona una habilidad específica con ejercicios cortos y enfocados.',
    'dashboard.button.history': 'Ver Historial de Sesiones',
    'dashboard.button.history.desc': 'Revisa el feedback y las métricas de tus sesiones pasadas.',
    'dashboard.button.structure': 'Estructurar Ideas',
    'dashboard.button.structure.desc': 'Organiza tus pensamientos con IA antes de hablar.',
    'dashboard.button.live': 'Conversación en Vivo',
    'dashboard.button.live.desc': 'Ten una conversación de voz en tiempo real y de baja latencia con Lidia.',
    'dashboard.progress.title': 'Progreso Rápido',
    'dashboard.progress.sessions': 'Sesiones Completadas',
    'dashboard.progress.lastPace': 'Última Puntuación de Ritmo',
    'dashboard.progress.lastEnergy': 'Última Puntuación de Energía',
    'dashboard.progress.none': '¡Completa una sesión para ver tu progreso aquí!',
    'dashboard.plan.title': 'Tu Plan de Coaching de 4 Semanas',
    'dashboard.button.startNow': 'Comenzar Ahora',
    'dashboard.plan.currentWeek': 'Semana Actual',
    'dashboard.plan.metrics.title': 'Rendimiento Semanal',
    'dashboard.plan.metrics.pace': 'Ritmo Prom.',
    'dashboard.plan.metrics.energy': 'Energía Vocal Prom.',
    'dashboard.plan.metrics.sessions': 'Sesiones',
    'dashboard.plan.metrics.noData': 'No hay sesiones completadas esta semana.',
    'audience.setup.title': 'Define Tu Audiencia',
    'audience.setup.intro': 'Para un feedback más específico, describe a quién te diriges. Esto ayuda a Lidia a simular diferentes perspectivas.',
    'audience.setup.placeholder': 'ej., "Un consejo de administración escéptico", "Un grupo de interesados no técnicos", "Un aula universitaria entusiasta"',
    'audience.setup.button.start': 'Iniciar Sesión con Audiencia',
    'audience.setup.button.skip': 'Omitir e Iniciar Sesión General',
    'material.upload.title': 'Subir Material de la Sesión',
    'material.upload.intro': '¿Tienes una presentación o un documento? Súbelo aquí para un feedback más contextualizado.',
    'material.upload.button.upload': 'Elegir Archivo (PDF, PNG, JPG)',
    'material.upload.button.start': 'Iniciar Sesión con Material',
    'material.upload.button.skip': 'Continuar sin Material',
    'material.upload.fileInfo': 'Seleccionado: {fileName}',
    'material.upload.questions.title': 'O, Agregue Preguntas de Entrevista Personalizadas',
    'material.upload.questions.placeholder': 'Pegue sus preguntas aquí, una por línea...',
    'material.upload.button.startWithBoth': 'Comenzar con Material y Preguntas',
    'material.upload.button.startWithQuestions': 'Comenzar con Preguntas',
    'roleplay.selection.title': 'Practicar un Escenario',
    'roleplay.selection.intro': 'Elige un escenario para practicar tus habilidades en un entorno simulado.',
    'roleplay.button.start': 'Iniciar Escenario',
    'drill.selection.title': 'Practicar una Habilidad Específica',
    'drill.selection.intro': 'Elige un ejercicio corto y enfocado para perfeccionar un solo aspecto de tu comunicación.',
    'drill.button.start': 'Iniciar Ejercicio',
    'drill.filler.title': 'Eliminación de Muletillas',
    'drill.filler.description': 'Describe un objeto simple durante 60 segundos sin usar muletillas como "um", "eh", o "o sea".',
    'drill.pacing.title': 'Práctica de Ritmo',
    'drill.pacing.description': 'Lee el párrafo proporcionado en voz alta a un ritmo constante y conversacional.',
    'drill.pacing.content': 'El sol se hundió bajo el horizonte, pintando el cielo con tonos de naranja y púrpura. Una suave brisa agitó las hojas del viejo roble, y las primeras estrellas de la noche comenzaron a aparecer, titilando como pequeños diamantes esparcidos sobre un paño de terciopelo.',
    'drill.concise.title': 'Desafío de Concisión',
    'drill.concise.description': 'Explica un tema complejo (por ejemplo, "¿cómo funciona internet?") en 30 segundos o menos.',
    'drill.tone.title': 'Práctica de Tono Vocal',
    'drill.tone.description': 'Lee la misma frase con tres emociones diferentes: feliz, triste y enojado.',
    'drill.tone.content': 'No puedo creer que ya esté aquí.',
    'drill.pause.title': 'Pausa Estratégica',
    'drill.pause.description': 'Lee el siguiente texto, haciendo pausas intencionales en cada coma y punto para enfatizar tus puntos.',
    'drill.pause.content': 'En el mercado actual, hay tres desafíos clave. Primero, la competencia. Segundo, la innovación. Y tercero, la retención de clientes. Si nos enfocamos, tendremos éxito.',
    'drill.session.title': 'Ejercicio: {drillTitle}',
    'drill.session.instructions': 'Instrucciones',
    'drill.session.start': 'Iniciar Ejercicio',
    'drill.session.stop': 'Detener y Obtener Feedback',
    'drill.session.loading': 'Analizando tu rendimiento...',
    'drill.session.feedbackTitle': 'Feedback Instantáneo',
    'drill.session.tryAgain': 'Intentar de Nuevo',
    'drill.session.backToDrills': 'Volver a Ejercicios',
    'drill.session.getReady': 'Prepárate...',
    'drill.session.go': '¡Adelante!',
    'drill.feedback.score': 'Puntuación',
    'drill.feedback.level': 'Nivel',
    'drill.feedback.actionSteps': 'Pasos a Seguir',
    'drill.feedback.rewrites': 'Reescrituras Sugeridas',
    'drill.feedback.nextLevel': 'Para Alcanzar el Siguiente Nivel',
    'drill.feedback.motivation': 'Ten en Mente',
    'roleplay.scenario.interview.title': 'Entrevista de Trabajo',
    'roleplay.scenario.interview.description': 'Practica responder preguntas comunes de entrevista con un gerente de RRHH.',
    'roleplay.scenario.interview.prompt': `SYSTEM INSTRUCTION — INTERVIEW SIMULATION MODE ONLY

⚠️ Scope:
This instruction applies **exclusively** to the “Interview Practice Session” feature.
Your persona is strictly that of an interviewer, NOT a coach.

---------------------------------------------
IDENTITY
---------------------------------------------
You are a **Senior Hiring Manager** at a top-tier global company (e.g., Google, McKinsey, Apple).
You are a seasoned, professional, and objective interviewer. You are NOT Lidia AI. Your goal is to evaluate the candidate.

Your mission: Conduct the world’s most realistic and challenging **mock interview simulation**.

---------------------------------------------
PURPOSE
---------------------------------------------
Simulate an authentic, professional job interview to assess the user's skills. You are an evaluator, not a coach. Your sole focus is asking questions and listening to the answers.

---------------------------------------------
SESSION FLOW LOGIC
---------------------------------------------

1️⃣ **START-UP PHASE**
- Greet the user professionally.
- Ask the following setup questions to tailor the interview:
  • “Which role are you applying for?”
  • “What level is it (entry, mid, senior, executive)?”
  • “What industry or type of company?”
- Based on their answers, adopt the appropriate tone (e.g., corporate, startup, technical).

2️⃣ **INTERVIEW PHASE**
- Conduct a realistic, challenging interview using a mix of:
  • **Behavioral questions** (“Tell me about a time you…”)
  • **Situational questions** (“What would you do if…”)
  • **Technical questions** (if relevant to the user’s role/industry)
  • **Leadership and values questions** (“How do you handle conflict?”)
- Adapt question complexity based on user responses.
- Probe deeper when an answer is incomplete (“Can you elaborate on the result?”).
- Maintain a professional, neutral conversational flow.
- Allow the conversation to proceed until the user ends the session.

---------------------------------------------
BEHAVIORAL GUIDELINES & TONE
---------------------------------------------
- **Maintain Strict Neutrality:** Your tone is professional, objective, and calm. You are polite but not overly friendly or encouraging.
- **NO COACHING OR FEEDBACK:** Do NOT provide any hints, feedback, validation ("That's a great answer"), or encouragement ("Take your time," "No worries") during the interview. The feedback will be provided after the session is complete.
- **Handling Pauses:** If the user pauses or struggles, remain silent and wait patiently for them to formulate their response. This simulates the pressure of a real interview.
- **Sound Human and Professional:** Emulate a real, senior interviewer. Use natural language and pacing.
- **Stay in Character:** Do not break character. If the user asks for help or feedback, politely state that you can discuss their performance after the interview is concluded.
- Your entire focus is on **simulating a real interview**, not on coaching.

---------------------------------------------
END GOAL
---------------------------------------------
Provide the world’s most authentic and challenging **Interview Practice Simulation**.
This allows the user to practice in a high-stakes environment. The coaching and analysis will happen *after* this simulation is complete. You MUST conduct the entire conversation in {languageName}.`,
    'roleplay.scenario.pitch.title': 'Pitch de Startup',
    'roleplay.scenario.pitch.description': 'Presenta tu idea a un capitalista de riesgo escéptico pero justo.',
    'roleplay.scenario.pitch.prompt': "Eres un capitalista de riesgo llamado David. Eres escéptico pero justo. El usuario te está presentando su idea de startup. Haz preguntas difíciles pero relevantes sobre su modelo de negocio, tamaño de mercado y competencia. Por ejemplo: '¿Cuál es tu estrategia de adquisición de clientes?' y '¿En qué se diferencia esto de tus principales competidores?'. Tu objetivo es probar la solidez de su pitch. DEBES conducir toda la conversación en {languageName}.",
    'roleplay.scenario.panel.title': 'Preguntas y Respuestas del Panel',
    'roleplay.scenario.panel.description': 'Enfrenta las preguntas de un moderador de panel después de una presentación.',
    'roleplay.scenario.panel.prompt': "Eres una moderadora de panel llamada María. El usuario acaba de terminar una presentación y ahora es el momento de preguntas y respuestas. Haz preguntas perspicaces y desafiantes relacionadas con un tema de negocios general. Por ejemplo: '¿Cómo ves la evolución de esta industria en los próximos 5 años?' y '¿Cuáles son las implicaciones éticas de esta tecnología?'. Tu tono es profesional e inquisitivo. DEBES conducir toda la conversación en {languageName}.",
    'session.title': 'Sesión de Práctica',
    'session.roleplay.title': 'Roleplay: {scenario}',
    'session.input.placeholder': 'Escribe tu respuesta o usa el micrófono...',
    'session.button.startRecording': 'Empezar a Grabar',
    'session.button.stopRecording': 'Detener Grabación y Obtener Feedback',
    'session.end.noSave': 'o Terminar sin Guardar',
    'session.end.noRecord': 'Terminar Sesión sin Grabar',
    'session.voice.on': 'Activar Salida de Voz',
    'session.voice.off': 'Desactivar Salida de Voz',
    'session.mic.listen': 'Hablar con Lidia',
    'session.mic.stop': 'Dejar de Hablar',
    'session.mic.unsupported': 'La entrada de voz no es compatible con tu navegador.',
    'session.ghostMode.on': 'Desactivar Modo Fantasma',
    'session.ghostMode.off': 'Activar Modo Fantasma',
    'session.button.viewMaterial': 'Ver Material',
    'session.material.close': 'Cerrar Material',
    'session.lidia.thinking': 'Lidia está pensando...',
    'copilot.fillerWords': 'Muletillas',
    'copilot.speakingPace': 'PPM',
    'copilot.pace.slow': 'Lento',
    'copilot.pace.ideal': 'Ideal',
    'copilot.pace.fast': 'Rápido',
    'live.session.title': 'Conversación en Vivo',
    'live.session.connecting': 'Conectando...',
    'live.session.connected': 'Conectado. Empieza a hablar.',
    'live.session.error': 'Error de Conexión',
    'live.session.disconnected': 'Desconectado',
    'live.session.end': 'Finalizar Conversación',
    'feedback.title': 'Feedback de la Sesión',
    'feedback.intro': 'Aquí tienes un desglose de tu rendimiento y tu camino a seguir.',
    'feedback.loading.title': "Lidia está analizando tu sesión...",
    'feedback.loading.subtitle': 'Creando tu feedback personalizado.',
    'feedback.loading.cameraOff': 'Cámara Apagada',
    'feedback.video.title': 'Grabación de Tu Sesión',
    'feedback.summary': 'Resumen',
    'feedback.strengths': 'Qué Salió Bien',
    'feedback.improvements': 'Áreas a Mejorar',
    'feedback.actionItems': 'Tus Puntos de Acción',
    'feedback.vocalAnalysis': 'Análisis Vocal',
    'feedback.nonVerbalAnalysis': 'Análisis No Verbal',
    'feedback.personaFeedback': 'Perspectivas de la Audiencia',
    'feedback.materialAlignment': 'Alineación con Material',
    'feedback.styleGuideAlignment': 'Alineación con Guía de Estilo',
    'feedback.performanceSnapshot': 'Resumen de Rendimiento',
    'feedback.clarity': 'Claridad',
    'feedback.confidence': 'Confianza',
    'feedback.engagement': 'Compromiso',
    'feedback.keyTakeaways': 'Puntos Clave',
    'feedback.wins': 'Qué Salió Bien',
    'feedback.nextSteps': 'Próximos Pasos Accionables',
    'feedback.messageAnalysis': 'Mensaje (Contenido y Estructura)',
    'feedback.deliveryAnalysis': 'Entrega (Dinámica Vocal)',
    'feedback.presenceAnalysis': 'Presencia (Lenguaje Corporal)',
    'feedback.vocalVariety': 'Variedad Vocal',
    'feedback.vocalEnergy': 'Energía Vocal',
    'feedback.button.back': 'Volver al Panel',
    'feedback.button.drill': 'Practicar Tus Mejoras',
    'feedback.button.drillLoading': 'Creando Tu Ejercicio...',
    'feedback.error.title': 'No Hay Feedback Disponible',
    'feedback.error.message': 'Algo salió mal al generar tu feedback.',
    'feedback.timestamp.goto': 'Ir a {time}',
    'history.title': 'Tu Historial de Sesiones',
    'history.intro': 'Revisa tus sesiones pasadas y sigue tu mejora a lo largo del tiempo.',
    'history.noSessions': 'Aún no has completado ninguna sesión. ¡Inicia una sesión de práctica para ver tu historial!',
    'history.table.type': 'Tipo de Sesión',
    'history.table.date': 'Fecha',
    'history.table.fillers': 'Muletillas',
    'history.table.pace': 'Ritmo',
    'history.table.energy': 'Energía',
    'progress.title': 'Tu Panel de Progreso',
    'progress.intro': 'Sigue tu crecimiento, celebra hitos y mira lo lejos que has llegado.',
    'progress.chart.fillers.title': 'Muletillas a lo Largo del Tiempo',
    'progress.chart.vocalEnergy.title': 'Última Puntuación de Energía Vocal',
    'progress.chart.paceScore.title': 'Última Puntuación de Ritmo',
    'progress.wordcloud.title': 'Tu Nube de Fortalezas',
    'progress.milestones.title': 'Tus Hitos',
    'progress.milestones.firstSession.title': 'Primer Paso',
    'progress.milestones.firstSession.description': '¡Completaste tu primera sesión de práctica!',
    'progress.milestones.fiveSessions.title': 'Practicante Constante',
    'progress.milestones.fiveSessions.description': 'Has completado cinco sesiones de práctica. ¡Sigue así!',
    'progress.milestones.fillerWords.title': 'Campeón de la Claridad',
    'progress.milestones.fillerWords.description': 'Completaste una sesión con menos de 5 muletillas.',
    'progress.button.back': 'Volver al Panel',
    'studio.title': 'Estudio de Estructuración',
    'studio.intro': 'Organiza tus pensamientos antes de practicar. Vuelca tus ideas a continuación y deja que Lidia te ayude a refinarlas.',
    'studio.input.placeholder': 'Ingresa tus notas, viñetas o ideas aquí...',
    'studio.output.placeholder': 'Tu texto estructurado aparecerá aquí...',
    'studio.button.organize': 'Aclarar y Organizar',
    'studio.button.star': 'Aplicar Método STAR',
    'studio.button.core': 'Encontrar Mensaje Central',
    'studio.button.findStat': 'Buscar Dato de Apoyo',
    'studio.button.addStat': 'Agregar a las Notas',
    'studio.stat.source': 'Fuente: {source}',
    'studio.button.loading': 'Estructurando...',
    'studio.button.proceed': 'Continuar a la Sesión de Práctica',
    'studio.button.speak': 'Habla Tus Pensamientos',
    'studio.button.stopSpeaking': 'Dejar de Escuchar',
    'studio.button.dictate': 'Dictar Notas',
    'studio.button.dictating': 'Dictando...',
    'studio.prompt.organize': 'Eres un experto coach de comunicación. El usuario ha proporcionado sus notas en bruto. Por favor, aclara y organiza estas notas en una estructura lógica con una introducción clara, puntos principales y una conclusión. Responde ÚNICAMENTE con el texto estructurado. Responde en {languageName}. Notas: ',
    'studio.prompt.star': 'Eres un experto coach de entrevistas. El usuario ha proporcionado notas para una pregunta de entrevista conductual. Por favor, reestructura sus notas en el método STAR (Situación, Tarea, Acción, Resultado). Responde ÚNICAMENTE con el texto estructurado, usando encabezados claros para cada sección. Responde en {languageName}. Notas: ',
    'studio.prompt.core': 'Eres un experto estratega. El usuario ha proporcionado un bloque de texto. Analízalo y extrae el mensaje central o la tesis más importante. Responde ÚNICAMENTE con esa única oración. Responde en {languageName}. Texto: ',
    'app.error.plan': 'No se pudo crear tu plan.',
    'app.error.feedback': 'No se pudo generar tu feedback. Por favor, revisa tu conexión e inténtalo de nuevo.',
    'app.button.startOver': 'Empezar de Nuevo',
    'button.backToDashboard': 'Volver al Panel',
    'button.backToScenarios': 'Volver a Escenarios',
    'button.backToDrills': 'Volver a Ejercicios',
    'button.backToAudience': 'Volver a Configuración de Audiencia',
  },
  tr: {},
  ur: {},
  hi: {},
  pa: {},
  fr: {},
  zh: {},
};

export default translations;
