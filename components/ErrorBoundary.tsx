import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  onReset: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * A React Error Boundary component. It catches JavaScript errors anywhere in its
 * child component tree, logs those errors, and displays a fallback UI instead of
 * the component tree that crashed.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // FIX: Use a constructor to initialize state. The class property syntax can cause issues
  // in some build environments, leading to `this.props` being unrecognized. A constructor
  // is a more robust way to ensure the component is initialized correctly.
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * This lifecycle method is triggered after an error has been thrown by a descendant component.
   * It receives the error that was thrown and should return a value to update state.
   */
  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  /**
   * This lifecycle method is also triggered after an error has been thrown by a descendant component.
   * It is used for side effects, like logging the error to an external service.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service here
    console.error("Uncaught error:", error, errorInfo);
  }
  
  // FIX: Added a reset handler to clear the error boundary's state. The original implementation
  // would not have cleared the error screen, as it only reset the parent component's state.
  // This handler now resets both the app and the error boundary.
  handleReset = () => {
    this.props.onReset();
    this.setState({ hasError: false });
  };


  /**
   * Renders the children as is if there's no error. If an error is caught,
   * it renders a user-friendly fallback UI.
   */
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-off-white p-4">
            <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h1 className="text-3xl font-bold text-brand-dark mb-2">Oops! Something went wrong.</h1>
                <p className="text-gray-600 mb-6">We've encountered an unexpected error. Please try restarting the application.</p>
                <button
                    onClick={this.handleReset}
                    className="bg-brand-gold text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-gold-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-gold-light transition-transform hover:scale-105"
                >
                    Start Over
                </button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
