import React from "react";
import ReactDOM from "react-dom/client";
import "@/index.css";
import App from "@/App";

// Suppress PostHog's PerformanceServerTiming error (known third-party bug)
// This error is from PostHog analytics, not our application code
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('PerformanceServerTiming') || 
     args[0].includes('postMessage') ||
     args[0].includes('DataCloneError'))
  ) {
    // Suppress PostHog's known error
    return;
  }
  originalError.apply(console, args);
};

// Also suppress in window error handler
window.addEventListener('error', (event) => {
  if (
    event.message?.includes('PerformanceServerTiming') ||
    event.message?.includes('DataCloneError') ||
    event.filename?.includes('posthog')
  ) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
});

// Suppress unhandled promise rejections from third-party scripts
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason?.message?.includes('PerformanceServerTiming') ||
    event.reason?.message?.includes('DataCloneError') ||
    event.reason?.stack?.includes('posthog')
  ) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
