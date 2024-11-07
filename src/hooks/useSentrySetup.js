






import   * as Sentry      from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";  
import { Replay         } from "@sentry/replay";  


// variable to check if Sentry has already been initialized
let isSentryInitialized = false;

// this hook initializes Sentry with the provided DSN and sets up the integrations.
export function useSentrySetup() {

  // ensure Sentry is initialized only once
  if (isSentryInitialized) return;

  console.log('\ninitializing sentry\n')

  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [
      new BrowserTracing(),  
      new Replay(),          
    ],
    tracesSampleRate:         1.0,
    tracePropagationTargets: ["localhost", /^https:\/\/skenestunts\.io\/api/],
    replaysSessionSampleRate: 0.1,  // adjust sampling rates as needed
    replaysOnErrorSampleRate: 1.0,
  });

  // set flag to true after initialization
  isSentryInitialized = true;

}
