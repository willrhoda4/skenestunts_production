





                      // configure your environment variables
                      require('dotenv'      ).config();


// import handlers                    
const db            = require('./handlers/database.js'  );
const email         = require('./handlers/email.js'     ); 
const auth          = require('./handlers/auth.js'      );
const images        = require('./handlers/images.js'    );
const posters       = require('./handlers/posters.js'   );


// import libraries
const path          = require('path');
const express       = require('express'     );
const cors          = require('cors'        );
const bodyParser    = require('body-parser' );
const multer        = require('multer'      );
const compression   = require('compression' );
const rateLimit     = require('express-rate-limit');

                      







// brace yourself for file uploads
const storage       = multer.diskStorage(
                                            { destination:  (req, file, cb) => { cb(null, 'server/uploads')   },
                                                 filename:  (req, file, cb) => { cb(null, file.originalname)  }
                                            }
                                        )
const upload        = multer({ storage });


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

// ... rest of your code


 
app.use(limiter);

// test route
app.get('/check',                (req, res) => res.send('checkitout!')  );

// database handlers
app.post('/getData',             db.getData                             );
app.post('/deleteData',          db.deleteData                          );
app.post('/reRankData',          db.reRankData                          );
app.post('/addData',             db.addData                             );
app.put( '/updateData',          db.updateData                          );

// auth handlers
app.post('/newPerformer',        auth.newPerformer                      );
app.post('/checkPassword',       auth.checkPassword                     );
app.post('/resetPassword',       auth.resetPassword                     );
app.post('/newPasswordLogin',    auth.newPasswordLogin                  );
app.post('/registerReset',       auth.registerReset                     );

// poster handlers
app.post('/getPostersByLetter',  posters.getPostersByLetter             );
app.post('/getDoublesPosters',   posters.getDoublesPosters              );
app.get( '/getPosterList',       posters.getPosterList                  );
app.post('/newPoster',           posters.newPoster                      );
app.post('/newPosters',          posters.newPosters                     );


// email handler
app.post('/email',                  email.emailHandler,                 );

// image handlers
app.post('/teamPhoto',              upload.single('imageUpload'), 
                                    images.teamshot                     );

app.post('/background',             upload.single('imageUpload'),                         
                                    images.background                   );   

app.post('/performerPhotos',        upload.fields([
                                                    {name:'headshot'},
                                                    {name:'bodyshot'}
                                                  ]), 
                                    images.headshot, 
                                    images.bodyshot                     );


// catch-all route to serve the index.html file for all routes
app.get('/*',  (req, res) => { res.sendFile(path.join(__dirname, '../build', 'index.html')); });






const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});










