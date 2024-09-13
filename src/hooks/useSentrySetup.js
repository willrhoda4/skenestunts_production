import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";  // Correct import for BrowserTracing
import { Replay } from "@sentry/replay";           // Correct import for Replay

// Variable to check if Sentry has already been initialized
let isSentryInitialized = false;

// This hook initializes Sentry with the provided DSN and sets up the integrations.
export function useSentrySetup() {
  if (!isSentryInitialized) {
    // Ensure Sentry is initialized only once
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      integrations: [
        new BrowserTracing(),  // Correct usage for BrowserTracing
        new Replay(),          // Correct usage for Replay
      ],
      tracesSampleRate: 1.0,
      tracePropagationTargets: ["localhost", /^https:\/\/skenestunts\.io\/api/],
      replaysSessionSampleRate: 0.1,  // Adjust sampling rates
      replaysOnErrorSampleRate: 1.0,
    });

    // Set flag to true after initialization
    isSentryInitialized = true;
  }
}
