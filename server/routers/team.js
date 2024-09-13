






const   express       = require('express');
const   router        = express.Router();

const { checkTable }  = require('../middleware/checkTable');

const   db            = require('../handlers/database');
const   auth          = require('../handlers/auth');
const   posters       = require('../handlers/posters');
const   email         = require('../handlers/email');
const   cloudinary    = require('../handlers/cloudinary');

// Database routes
router.post('/getAdminData',        checkTable,
                                    db.getData);


// poster routes
router.post('/getPostersByLetter',  posters.getPostersByLetter);
router.post('/getDoublesPosters',   posters.getDoublesPosters);
router.get('/getPosterList',        posters.getPosterList);
router.post('/newPoster',           posters.newPoster);
router.post('/newPosters',          posters.newPosters);


module.exports = router;
