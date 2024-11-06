





const   Sentry                     = require("@sentry/node");
const { nodeProfilingIntegration } = require("@sentry/profiling-node");



// invoke initialize() before your other middleware,
function initialize( app ) {

  Sentry.init({
    dsn: process.env.SENTRY_DSN || "https://c26207e99c0af8b12bcfe0070a7dcacb@o4506515558629376.ingest.us.sentry.io/4507862829957120",
    integrations: [
      nodeProfilingIntegration(),
      new Sentry.Integrations.Http({ tracing: true }), // enable tracing for HTTP requests
    ],
    tracesSampleRate:   1.0,
    profilesSampleRate: 1.0,
  });

  // Attach Sentry handlers
  app.use(Sentry.Handlers.requestHandler()); // to handle requests as first middleware
  app.use(Sentry.Handlers.tracingHandler()); // for tracing

  // and  add errorHandler as the last middleware in server.js
}

const errorHandler = Sentry.Handlers.errorHandler();

module.exports = { initialize, errorHandler };
