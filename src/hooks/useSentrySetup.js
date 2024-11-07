



  
  
  
  
  import   * as Sentry      from "@sentry/react";
  import { BrowserTracing } from "@sentry/browser";  
  import { Replay         } from "@sentry/react";  
  import { useState,
           useEffect      } from 'react';
  


// this hook initializes Sentry with the provided DSN and sets up the integrations.
export function useSentrySetup() {
  
  const [ isSentryInitialized, setIsSentryInitialized ] = useState(false);

  useEffect(() => {

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
    setIsSentryInitialized(true);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])  

}
