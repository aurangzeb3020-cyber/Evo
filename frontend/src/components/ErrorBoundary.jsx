import React from "react";

/**
 * Catches React render errors and shows a fallback UI instead of crashing.
 */
export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (typeof console !== "undefined" && console.error) {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const fallback = this.props.fallback;
      if (typeof fallback === "function") {
        return fallback({ error: this.state.error, retry: this.handleRetry });
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mx-auto mb-4">
              !
            </div>
            <h1 className="font-display font-semibold text-slate-800 text-lg mb-2">
              Something went wrong
            </h1>
            <p className="text-slate-600 text-sm mb-4">
              The app hit an error. You can try again or refresh the page.
            </p>
            <button
              type="button"
              onClick={this.handleRetry}
              className="px-4 py-2 rounded-lg bg-evocative-primary text-white font-medium hover:bg-evocative-dark focus:outline-none focus:ring-2 focus:ring-evocative-accent"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
