import React, { useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import ErrorBoundary from './components/ErrorBoundary';

// Find the root element in the HTML to mount the React app.
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Create a React root for concurrent mode.
const root = ReactDOM.createRoot(rootElement);

/**
 * A wrapper component that integrates the ErrorBoundary with the main App.
 * It uses a `key` state to force a re-mount of the App component when the
 * user decides to reset after an error, effectively restarting the app state.
 */
const AppWithErrorBoundary: React.FC = () => {
    // A key to force re-rendering the App component on reset.
    const [key, setKey] = React.useState(0);

    /**
     * Handles the reset logic passed to the ErrorBoundary.
     * It clears the saved session from localStorage and increments the key
     * to trigger a re-mount of the App component.
     */
    const handleReset = useCallback(() => {
        localStorage.removeItem('lidiaAiCoachSession');
        setKey(prevKey => prevKey + 1);
    }, []);
    
    return (
        <ErrorBoundary onReset={handleReset}>
            <App key={key} />
        </ErrorBoundary>
    )
}

// Render the main application.
root.render(
  // StrictMode helps with identifying potential problems in an application.
  <React.StrictMode>
    {/* LanguageProvider makes internationalization available to the entire app. */}
    <LanguageProvider>
      {/* AppWithErrorBoundary provides a global safety net for any rendering errors. */}
      <AppWithErrorBoundary />
    </LanguageProvider>
  </React.StrictMode>
);