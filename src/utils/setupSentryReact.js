





import   * as Sentry                  from "@sentry/react";
import { useEffect                  } from "react";
import { createRoutesFromChildren,
         matchRoutes,
         useLocation,
         useNavigationType,
       }                              from "react-router-dom";



// set tracesSampleRate to 1.0 to capture 100% of transactions.
// set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
// Capture Replay for 10% of all sessions,
// plus for 100% of sessions with an error
Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  integrations: [
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    Sentry.replayIntegration(),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", /^https:\/\/skenestunts\.io\/api/],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

