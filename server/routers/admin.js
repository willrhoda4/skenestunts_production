








const express       = require('express');
const router        = express.Router();


const db            = require('../handlers/database');
const auth          = require('../handlers/auth');
const posters       = require('../handlers/posters');
const email         = require('../handlers/email');
const cloudinary    = require('../handlers/cloudinary');
const instagram     = require('../handlers/instagram');


// test route
router.get( '/check', (req, res) => res.send('checkitout!'));


// Database routes
router.post('/getData',             db.getData                  );
router.post('/deleteData',          db.deleteData               );
router.post('/reRankData',          db.reRankData               );
router.post('/addData',             db.addData                  );
router.put( '/updateData',          db.updateData               );

// Auth routes
router.post('/newPerformer',        auth.newPerformer           );
router.post('/login',               auth.login                  );
router.post('/resetPassword',       auth.resetPassword          );
router.post('/newPasswordLogin',    auth.newPasswordLogin       );
router.post('/registerReset',       auth.registerReset          );

// poster routes
router.post('/getPostersByLetter',  posters.getPostersByLetter  );
router.post('/getDoublesPosters',   posters.getDoublesPosters   );
router.get( '/getPosterList',       posters.getPosterList       );
router.post('/newPoster',           posters.newPoster           );  
router.post('/newPosters',          posters.newPosters          );  

// email route
router.post('/email',               email.emailHandler          );

// image routes
router.post('/signature',           cloudinary.getSignature     );
router.post('/fetchImage',          cloudinary.fetchImage       );
router.put( '/updateIGToken',       instagram.updateToken       );

module.exports = router;
