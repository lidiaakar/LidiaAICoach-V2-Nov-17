import React, { useState, useEffect } from 'react';

interface GhostModeProps {
  prompt: string;
}

/**
 * The GhostMode component displays subtle, real-time coaching prompts over the video feed.
 * It appears when a new prompt is received and fades out automatically.
 * @param {GhostModeProps} props - The component props.
 * @param {string} props.prompt - The text of the prompt to display.
 */
const GhostMode: React.FC<GhostModeProps> = ({ prompt }) => {
  const [visible, setVisible] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('');

  useEffect(() => {
    let timer: number;
    if (prompt) {
      setCurrentPrompt(prompt);
      setVisible(true);
      // Set a timer to hide the prompt after 7 seconds
      timer = window.setTimeout(() => {
        setVisible(false);
      }, 7000);
    } else {
      setVisible(false);
    }

    return () => clearTimeout(timer);
  }, [prompt]);

  return (
    <div 
      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 bg-black/70 backdrop-blur-md text-white rounded-lg transition-opacity duration-500 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={{ pointerEvents: 'none' }} // Make it non-interactive so it doesn't block video controls
      aria-live="assertive" // Announce changes to screen readers
      aria-atomic="true"
    >
        <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p className="text-lg font-semibold tracking-wide text-center">{currentPrompt}</p>
        </div>
    </div>
  );
};

export default GhostMode;
