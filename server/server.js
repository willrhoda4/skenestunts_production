





                      // configure your environment variables
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });


// // import handlers
// const db            = require('./handlers/database.js'  );
// const email         = require('./handlers/email.js'     );
// const auth          = require('./handlers/auth.js'      );
// const images        = require('./handlers/images.js'    );
// const posters       = require('./handlers/posters.js'   );
// const cloudinary    = require('./handlers/cloudinary.js');

// import routers
const publicRouter    = require('./routers/public'    );
const performerRouter = require('./routers/performer' );
const teamRouter      = require('./routers/team'      );
const boardRouter     = require('./routers/board'     );
const adminRouter     = require('./routers/admin'     );

// import libraries
// const path          = require('path');
const express       = require('express'     );
const cors          = require('cors'        );
const bodyParser    = require('body-parser' );
const compression   = require('compression' );
const rateLimit     = require('express-rate-limit');








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
      'https://skenestunts.com'
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




// ladies and gentlemen, start your app and initiate your middleware
const app = express();


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

      // Set up security headers
      app.use((req, res, next) => {

        res.setHeader( 'X-Content-Type-Options',  'nosniff'            );
        res.setHeader( 'X-Frame-Options',         'DENY'               );
        res.setHeader( 'Content-Security-Policy', "default-src 'self'" );

        next();
      });



// apply the rate limiter to all requests
// app.use(limiter);



// Routes that do not require authorization
app.use('/public',                                   publicRouter     );

// Routes that require authorization with specific roles
app.use('/performer', authorizeToken( 'performer' ), performerRouter  );
app.use('/team',      authorizeToken( 'team'      ), teamRouter       );
app.use('/board',     authorizeToken( 'board'     ), boardRouter      );
app.use('/admin',     authorizeToken( 'admin'     ), adminRouter      );


// catch-all route to serve the index.html file for all routes
app.get('/*',  (req, res) => { res.sendFile(path.join(__dirname, '../build', 'index.html')); });






const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});










