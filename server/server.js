




// configure your environment variables
const   path                       = require('path');
                                     require('dotenv').config({ path: path.resolve(__dirname, '.env') });


// import Sentry
                                     require('./middleware/sentryInstrument');
const Sentry                       = require('@sentry/node');


// import handlers
const   db                         = require('./handlers/database');
const   auth                       = require('./handlers/auth');
const   team                       = require('./handlers/team');
const   email                      = require('./handlers/email');
const   github                     = require('./handlers/github');
const   cloudinary                 = require('./handlers/cloudinary');
const   performer                  = require('./handlers/performers');
const   posters                    = require('./handlers/posters');
const   instagram                  = require('./handlers/instagram');
         
         
// import middleware         
const  authorizeToken              = require('./middleware/authorizeToken');
const  authorizeGitHub             = require('./middleware/authorizeGitHub');
const  checkTable                  = require('./middleware/checkTable');
         
         
         
         
// import libraries        
const express                      = require('express'     );
const cors                         = require('cors'        );
const bodyParser                   = require('body-parser' );
const compression                  = require('compression' );
const rateLimit                    = require('express-rate-limit');
const cookieParser                 = require('cookie-parser');







// configure cors
const corsOptions = {

  methods:             'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders:     ['Content-Type', 'Authorization'],
  credentials:          true,
  optionsSuccessStatus: 204,
  origin: function (origin, callback) {

    const allowedOrigins = [
      'http://www.skenestunts.com',
      'https://www.skenestunts.com',
      'http://www.skenestunts.ca',
      'https://www.skenestunts.ca',
      'http://skenestunts.ca',
      'https://skenestunts.ca',
      'http://skenestunts.com',
      'https://skenestunts.com',
      'http://localhost:3000',
    ];

    if (  !origin                          ||
           allowedOrigins.includes(origin) ||
           origin.includes('localhost')    ){ callback(null, true);                       }

    else                                    { callback(new Error('Not allowed by CORS')); }
  },

};


// Set up rate limiter
const limiter = rateLimit({

  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100                  // limit each IP to 100 requests per windowMs.

});




// ladies and gentlemen, start your app...
const app = express();

      // ... and initiate your middleware
      // app.use(Sentry.Handlers.requestHandler());  // should be the first middleware

      // app.use(Sentry.Handlers.tracingHandler());  // for performance monitoring

      app.use(cookieParser());

      app.use(cors(corsOptions));

      app.use(compression());     // sets up gzip

      app.use(bodyParser.json());


      app.use(express.static(path.resolve(__dirname, "../build")));   //  <== sets up a static file server

      app.use((req, res, next) => {  //  vvv sets up cache control headers for static assets

        const staticAssetExtensions = ['.js', '.css', '.jpg', '.png', '.gif', '.jpeg'];

        if (staticAssetExtensions.some(ext => req.url.endsWith(ext))) {
          res.set('Cache-Control', 'public, max-age=86400'); // Cache for one day
        }

        next();
      });

      // set up security headers
      app.use((req, res, next) => {
        // Basic security headers
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');

        // minimal yet effective Content-Security-Policy
        res.setHeader(
          'Content-Security-Policy',
          `
            default-src 'self';
            style-src   'self' 'unsafe-inline';
            script-src  'self' 'unsafe-inline' 'unsafe-eval'      https://connect.facebook.net        https://www.googletagmanager.com;
            connect-src 'self'  https://www.google-analytics.com  https://graph.instagram.com         https://api.cloudinary.com          htts://www.skenestunts.com;
            img-src     'self'  data: https://m.media-amazon.com  https://scontent.cdninstagram.com   https://res.cloudinary.com;
            frame-src   'self'  https://player.vimeo.com          https://www.facebook.com;
          `.replace(/\s+/g, ' ').trim() // Minimize whitespace for better performance
        );

        next();
      });




// apply the rate limiter to all requests
// app.use(limiter);



// ===================== PUBLIC ROUTES =====================

// test route
app.get( '/check', (req, res) => res.send('checkitout!'));



// database routes
app.post('/getData',             checkTable,
                                 db.getData                     );

// auth routes
app.post('/newPerformer',        performer.newPerformer         );
app.post('/checkPassword',       auth.login                     );
app.post('/resetPassword',       auth.resetPassword             );
app.post('/registerReset',       auth.registerReset             );


// email route    
app.post('/email',               email.emailHandler             );


// image routes   
app.post('/signature',           cloudinary.getSignature        );
app.post('/fetchImage',          cloudinary.fetchImage          );
app.put( '/updateIGToken',       instagram.updateToken          );


// ===================== GITHUB ROUTES =====================

app.get( '/wrangleImdbIds',      authorizeGitHub, 
                                 github.wrangleImdbIds          );

app.post('/updateCredits',       authorizeGitHub,
                                 github.updateCredits           ); 



// ===================== PERFORMER ROUTES =====================

// performer routes
app.put( '/updatePerformer',     authorizeToken('performer'),
                                 performer.updatePerformer      );
app.get( '/loginPerformer',      authorizeToken('performer'),
                                 performer.autoLoginPerformer   );

// ===================== TEAM ROUTES =====================

// database routes
app.post('/getAdminData',        authorizeToken('team'),
                                 checkTable,
                                 db.getData                     );

app.get( '/loginTeam',           authorizeToken('team'),
                                 team.autoLogin                 );

// poster routes
app.post('/getDoublesPosters',   posters.getDoublesPosters      );  // this route is public, but stored here for organization

app.post('/getPostersByLetter',  authorizeToken('team'),
                                 posters.getPostersByLetter     );
app.get('/getPosterList',        authorizeToken('team'),
                                 posters.getPosterList          );
// app.post('/newPoster',           authorizeToken('team'),
//                                  posters.newPoster              );
// app.post('/newPosters',          authorizeToken('team'),
//                                  posters.newPosters             );


// ===================== BOARD ROUTES =====================

// database routes
app.put( '/updateData',          authorizeToken('board'),
                                 db.updateData                  );


// ===================== ADMIN ROUTES =====================

// database routes
app.post('/deleteData',          authorizeToken('admin'),
                                 db.deleteData                 );
app.post('/reRankData',          authorizeToken('admin'),
                                 db.reRankData                 );
app.post('/addData',             authorizeToken('admin'),
                                 db.addData                    );


// Routes that require authorization with specific roles
// app.use('/performer', authorizeToken( 'performer' ), performerRouter  );
// app.use('/team',      authorizeToken( 'team'      ), teamRouter       );
// app.use('/board',     authorizeToken( 'board'     ), boardRouter      );
// app.use('/admin',     authorizeToken( 'admin'     ), adminRouter      );


// catch-all route to serve the index.html file for all routes
app.get('/*',  (req, res) => { res.sendFile(path.join(__dirname, '../build', 'index.html')); });


// Sentry.setupExpressErrorHandler(app);
// app.use(Sentry.Handlers.errorHandler()); // should be the last middleware


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});










