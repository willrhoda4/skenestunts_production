





const   Sentry                     = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");


console.log('\ninitializing Sentry for the server...\n');


// ensure to call this before requiring any other modules!
// add Tracing by setting tracesSampleRate, Sentyr recommends adjusting this value in production
// set sampling rate for profiling
// this is relative to tracesSampleRate
Sentry.init( {
  dsn: process.env.SENTRY_DSN,
  integrations: [ nodeProfilingIntegration() ],
  tracesSampleRate:   1.0,
  profilesSampleRate: 1.0,
} );

