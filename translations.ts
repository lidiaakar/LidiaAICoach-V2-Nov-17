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
    'pricing.b2b.toggle.individual': 'For Individuals',
    'pricing.b2b.toggle.b2b': 'For Teams & B2B',
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
    'pricing.enterprise.title': 'Individual Enterprise',
    'pricing.enterprise.price': 'Custom',
    'pricing.enterprise.description': 'For professionals, coaches, and consultants with advanced needs.',
    'pricing.enterprise.feature1': 'Everything in Pro, plus:',
    'pricing.enterprise.feature2': 'Team dashboards and reporting',
    'pricing.enterprise.feature3': 'Custom roleplay scenarios',
    'pricing.enterprise.feature4': 'Dedicated account manager',
    'pricing.enterprise.feature5': 'Priority support',
    'pricing.button.choose': 'Choose Plan',
    'pricing.button.contact': 'Contact Sales',
    'pricing.teams.title': 'Teams',
    'pricing.teams.price': '$49 / seat / month',
    'pricing.teams.description': 'For small teams and departments ready to improve communication.',
    'pricing.teams.feature1': 'Everything in Pro',
    'pricing.teams.feature2': 'Team dashboard & reporting',
    'pricing.teams.feature3': 'Centralized user management',
    'pricing.teams.feature4': 'Up to 25 users',
    'pricing.business.title': 'Business',
    'pricing.business.price': '$79 / seat / month',
    'pricing.business.description': 'The complete solution for organizations to scale communication excellence.',
    'pricing.business.feature1': 'Everything in Teams',
    'pricing.business.feature2': 'SSO Integration (SAML, Okta)',
    'pricing.business.feature3': 'Custom roleplay scenarios',
    'pricing.business.feature4': 'Advanced analytics',
    'pricing.business.feature5': 'Priority email & chat support',
    'pricing.enterprise.b2b.title': 'Enterprise',
    'pricing.enterprise.b2b.description': 'For large-scale deployments with custom security and support needs.',
    'pricing.enterprise.b2b.feature1': 'Everything in Business',
    'pricing.enterprise.b2b.feature2': 'Dedicated Account Manager & Onboarding',
    'pricing.enterprise.b2b.feature3': 'API Access & Integrations',
    'pricing.enterprise.b2b.feature4': 'Custom security & compliance reviews',
    'pricing.enterprise.b2b.feature5': 'Volume discounts',
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
    'feedback.keyTakeaways': 'Key Takeaways',
    'feedback.performanceSnapshot': 'Performance Snapshot',
    'feedback.clarity': 'Clarity',
    'feedback.confidence': 'Confidence',
    'feedback.engagement': 'Engagement',
    'feedback.messageAnalysis': 'Message Analysis',
    'feedback.deliveryAnalysis': 'Delivery Analysis',
    'feedback.presenceAnalysis': 'Presence Analysis',
    'feedback.wins': 'What Went Well',
    'feedback.nextSteps': 'Actionable Next Steps',
    'feedback.personaFeedback': 'Audience Persona Feedback',
    'feedback.materialAlignment': 'Material Alignment',
    'feedback.timestamp.goto': 'Go to {time}',
    'feedback.button.drill': 'Practice a Weakness',
    'feedback.button.drillLoading': 'Creating Drill...',
    'feedback.button.back': 'Back to Dashboard',
    'feedback.error.title': 'Feedback Generation Failed',
    'feedback.error.message': 'Sorry, we couldn\'t analyze your session right now. Please try returning to the dashboard.',
    // Progress / History
    'progress.title': 'Your Progress Dashboard',
    'progress.intro': 'Track your growth and celebrate your milestones.',
    'progress.chart.fillers.title': 'Filler Words per Session',
    'progress.chart.vocalEnergy.title': 'Latest Vocal Energy Score',
    'progress.chart.paceScore.title': 'Latest Pacing Score',
    'progress.wordcloud.title': 'Your Strengths',
    'progress.milestones.title': 'Your Milestones',
    'progress.milestones.firstSession.title': 'First Step Taken',
    'progress.milestones.firstSession.description': 'You completed your first practice session!',
    'progress.milestones.fiveSessions.title': 'Consistent Practice',
    'progress.milestones.fiveSessions.description': 'You\'ve completed five sessions. Keep up the momentum!',
    'progress.milestones.fillerWords.title': 'Conscious Communicator',
    'progress.milestones.fillerWords.description': 'Completed a session with less than 5 filler words.',
    'progress.button.back': 'Back to Dashboard',
    'history.title': 'Session History',
    'history.noSessions': 'You haven\'t completed any sessions yet. Start a practice session to see your history here!',
    // Structuring Studio
    'studio.title': 'Structuring Studio',
    'studio.intro': 'Brain-dump your raw thoughts here. Lidia will help you organize them before you practice.',
    'studio.input.placeholder': 'Type or dictate your raw notes here...\n\nFor example: "My main point is that our Q3 growth was strong. I need to mention the new marketing campaign. Also, the team worked hard. The data shows a 20% increase in leads. I should probably end with a thank you."',
    'studio.output.placeholder': 'Your structured thoughts will appear here...',
    'studio.button.dictate': 'Dictate Notes',
    'studio.button.dictating': 'Listening...',
    'studio.button.organize': 'Organize Ideas',
    'studio.button.star': 'Use STAR Method',
    'studio.button.core': 'Find Core Message',
    'studio.button.findStat': 'Find Supporting Stat',
    'studio.button.addStat': 'Add to Notes',
    'studio.button.loading': 'Structuring...',
    'studio.button.proceed': 'Proceed to Practice Session',
    'studio.stat.source': 'Source: {source}',
    'studio.prompt.organize': "You are an expert communication assistant. Your task is to take the user's raw text and organize it into a clear, logical structure with a title, an introduction, 2-3 main points with bullet points, and a conclusion. Your entire response must be in {languageName}.",
    'studio.prompt.star': "You are an expert interview coach. Your task is to take the user's raw text and structure it into the STAR format (Situation, Task, Action, Result). Use clear headings for each section. If the text is missing a section, note that it should be added. Your entire response must be in {languageName}.",
    'studio.prompt.core': 'You are an expert messaging strategist. Your task is to analyze the user\'s raw text and distill it into a single, powerful "core message." The core message should be a concise, memorable sentence that captures the most important takeaway. Your entire response must be in {languageName} and should only contain the core message itself.',
    // Global Buttons
    'button.backToDashboard': 'Back to Dashboard',
    'button.backToScenarios': 'Back to Scenarios',
    // Global Errors
    'app.error.plan': 'Plan Generation Failed',
    'app.error.feedback': 'Feedback Generation Failed',
  },
  es: {
    // Header
    'header.title': 'Lidia',
    'header.subtitle': 'AI Coach',
    'header.newPlan': 'Iniciar Nuevo Plan',
    // Footer
    'footer.copyright': "© {year} Lidia AI Coach por Lighthauz Consulting & Coaching. Eleva Tu Voz.",
    // Login
    'login.welcome': 'Bienvenido de Nuevo',
    'login.intro': 'Inicia sesión para continuar tu viaje de coaching.',
    'login.email.label': 'Dirección de Correo Electrónico',
    'login.email.placeholder': 'tu@ejemplo.com',
    'login.password.label': 'Contraseña',
    'login.password.placeholder': '••••••••',
    'login.forgotPassword': '¿Olvidaste la Contraseña?',
    'login.resetEmailSent': 'Correo de restablecimiento de contraseña enviado. Por favor, revisa tu bandeja de entrada.',
    'login.button.login': 'Iniciar Sesión',
    'login.signup.text': '¿No tienes una cuenta?',
    'login.signup.link': 'Regístrate',
    // SignUp
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
    // Onboarding
    'onboarding.welcome': 'Bienvenido a Tu Coach de Comunicación con IA',
    'onboarding.intro': 'Comencemos por entender tus metas. Un plan personalizado te espera.',
    'onboarding.name.label': '¿Cómo debo llamarte?',
    'onboarding.name.placeholder': 'p. ej., Alex',
    'onboarding.goal.label': '¿Cuál es tu objetivo principal?',
    'onboarding.goal.placeholder': 'Selecciona un objetivo...',
    'onboarding.goal.option1': 'Tener éxito en mi próxima entrevista de trabajo',
    'onboarding.goal.option2': 'Realizar una presentación convincente',
    'onboarding.goal.option3': 'Liderar reuniones con más confianza',
    'onboarding.goal.option4': 'Mejorar mis habilidades para hablar en público',
    'onboarding.goal.option5': 'Presentar eficazmente mi idea de startup',
    'onboarding.challenge.label': '¿Cuál es tu mayor desafío en este momento?',
    'onboarding.challenge.placeholder': 'p. ej., "Uso demasiadas muletillas como \'eh\'"',
    'onboarding.language.label': 'Idioma Preferido',
    'onboarding.button.create': 'Crear Mi Plan Personalizado',
    'onboarding.button.loading': 'Generando Tu Plan...',
    // Pricing
    'pricing.title': 'Elige Tu Plan',
    'pricing.intro': 'Desbloquea todo tu potencial con el plan adecuado para tu viaje.',
    'pricing.b2b.toggle.individual': 'Para Individuos',
    'pricing.b2b.toggle.b2b': 'Para Equipos y B2B',
    'pricing.free.title': 'Gratis',
    'pricing.free.price': 'Gratis',
    'pricing.free.description': 'Para personas que se inician en el coaching de comunicación.',
    'pricing.free.feature1': 'Plan de coaching personalizado',
    'pricing.free.feature2': '3 sesiones de práctica al mes',
    'pricing.free.feature3': 'Informes de feedback básicos',
    'pricing.free.feature4': 'Acceso a todos los ejercicios estándar',
    'pricing.pro.title': 'Pro',
    'pricing.pro.price': '$29 / mes',
    'pricing.pro.description': 'Para profesionales comprometidos en dominar sus habilidades de comunicación.',
    'pricing.pro.popular': 'Más Popular',
    'pricing.pro.feature1': 'Todo en Gratis, además:',
    'pricing.pro.feature2': 'Sesiones de práctica ilimitadas',
    'pricing.pro.feature3': 'Feedback avanzado de IA con simulación de personas',
    'pricing.pro.feature4': 'Grabación de sesiones y análisis de video',
    'pricing.pro.feature5': 'Panel de seguimiento de progreso',
    'pricing.pro.feature6': 'Ejercicios dinámicos generados por IA',
    'pricing.enterprise.title': 'Empresarial Individual',
    'pricing.enterprise.price': 'Personalizado',
    'pricing.enterprise.description': 'Para profesionales, coaches y consultores con necesidades avanzadas.',
    'pricing.enterprise.feature1': 'Todo en Pro, además:',
    'pricing.enterprise.feature2': 'Paneles de equipo e informes',
    'pricing.enterprise.feature3': 'Escenarios de roleplay personalizados',
    'pricing.enterprise.feature4': 'Gerente de cuenta dedicado',
    'pricing.enterprise.feature5': 'Soporte prioritario',
    'pricing.button.choose': 'Elegir Plan',
    'pricing.button.contact': 'Contactar a Ventas',
    'pricing.teams.title': 'Equipos',
    'pricing.teams.price': '$49 / asiento / mes',
    'pricing.teams.description': 'Para equipos pequeños y departamentos listos para mejorar la comunicación.',
    'pricing.teams.feature1': 'Todo en Pro',
    'pricing.teams.feature2': 'Panel de equipo e informes',
    'pricing.teams.feature3': 'Gestión centralizada de usuarios',
    'pricing.teams.feature4': 'Hasta 25 usuarios',
    'pricing.business.title': 'Business',
    'pricing.business.price': '$79 / asiento / mes',
    'pricing.business.description': 'La solución completa para que las organizaciones escalen la excelencia en la comunicación.',
    'pricing.business.feature1': 'Todo en Equipos',
    'pricing.business.feature2': 'Integración SSO (SAML, Okta)',
    'pricing.business.feature3': 'Escenarios de roleplay personalizados',
    'pricing.business.feature4': 'Análisis avanzados',
    'pricing.business.feature5': 'Soporte prioritario por correo y chat',
    'pricing.enterprise.b2b.title': 'Enterprise',
    'pricing.enterprise.b2b.description': 'Para implementaciones a gran escala con necesidades de seguridad y soporte personalizadas.',
    'pricing.enterprise.b2b.feature1': 'Todo en Business',
    'pricing.enterprise.b2b.feature2': 'Gerente de Cuenta Dedicado y Onboarding',
    'pricing.enterprise.b2b.feature3': 'Acceso a API e Integraciones',
    'pricing.enterprise.b2b.feature4': 'Revisiones de seguridad y cumplimiento personalizadas',
    'pricing.enterprise.b2b.feature5': 'Descuentos por volumen',
    // Dashboard
    'dashboard.title': 'Tu Viaje de Coaching, {name}',
    'dashboard.week': 'Semana {week}',
    'dashboard.tasks': 'Tus Tareas:',
    'dashboard.button.start': 'Iniciar Sesión de Práctica',
    'dashboard.button.start.desc': 'Comienza una sesión guiada con Lidia para practicar tus objetivos de habla.',
    'dashboard.button.roleplay': 'Practicar un Escenario',
    'dashboard.button.roleplay.desc': 'Simula conversaciones del mundo real como entrevistas o presentaciones.',
    'dashboard.button.drill': 'Practicar un Ejercicio',
    'dashboard.button.drill.desc': 'Perfecciona una habilidad específica con ejercicios cortos y enfocados.',
    'dashboard.button.history': 'Ver Historial de Sesiones',
    'dashboard.button.history.desc': 'Revisa el feedback y las métricas de tus sesiones pasadas.',
    'dashboard.button.structure': 'Estructurar Ideas',
    'dashboard.button.structure.desc': 'Organiza tus ideas con IA antes de hablar.',
    'dashboard.button.live': 'Conversación en Vivo',
    'dashboard.button.live.desc': 'Ten una conversación de voz en tiempo real y de baja latencia con Lidia.',
    'dashboard.progress.title': 'Progreso Rápido',
    'dashboard.progress.sessions': 'Sesiones Completadas',
    'dashboard.progress.lastPace': 'Última Puntuación de Ritmo',
    'dashboard.progress.lastEnergy': 'Última Puntuación de Energía',
    'dashboard.progress.none': '¡Completa una sesión para ver tu progreso aquí!',
    'dashboard.plan.title': 'Tu Plan de Coaching de 4 Semanas',
    'dashboard.button.startNow': 'Empezar Ahora',
    'dashboard.plan.currentWeek': 'Semana Actual',
    'dashboard.plan.metrics.title': 'Rendimiento Semanal',
    'dashboard.plan.metrics.pace': 'Ritmo Prom.',
    'dashboard.plan.metrics.energy': 'Energía Vocal Prom.',
    'dashboard.plan.metrics.sessions': 'Sesiones',
    'dashboard.plan.metrics.noData': 'No se completaron sesiones esta semana.',
  },
  fr: {},
  zh: {},
  tr: {},
  ur: {},
  hi: {},
  pa: {},
};

export default translations;
