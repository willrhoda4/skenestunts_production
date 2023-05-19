






                      require('dotenv'      ).config();

const path          = require('path');
const db            = require('./handlers/database.js'  );
const email         = require('./handlers/email.js'     ); 
const auth          = require('./handlers/auth.js'      );
const images        = require('./handlers/images.js'    );
const posters       = require('./handlers/posters.js'   );


const express       = require('express'     );
const cors          = require('cors'        );
const bodyParser    = require('body-parser' );
const multer        = require('multer'      );

                      

const storage       = multer.diskStorage(
                                            { destination:  (req, file, cb) => { cb(null, 'uploads')          },
                                                 filename:  (req, file, cb) => { cb(null, file.originalname)  }
                                            }
                                        )
const upload        = multer({ storage });


const app = express();
      app.use(cors());
      app.use(bodyParser.json());
      app.use(express.static(path.resolve(__dirname, "../build")));






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
app.post('/registerReset',       auth.registerReset                    );

// poster handlers
app.post('/getPostersByLetter',  posters.getPostersByLetter             );
app.post('/getDoublesPosters',   posters.getDoublesPosters              );
app.get( '/getPosterList',       posters.getPosterList                  );
app.post('/newPoster',           posters.newPoster                      );


// email handler
app.post('/email',                  email.emailHandler,
                                    auth.registerReset                  );

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











