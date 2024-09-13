








const   express           = require('express');
const   router            = express.Router();

const { checkTable }      = require('../middleware/checkTable');

const   db                = require('../handlers/database');
const   auth              = require('../handlers/auth');
const   email             = require('../handlers/email');
const   cloudinary        = require('../handlers/cloudinary');
const   instagram         = require('../handlers/instagram');
const   performer         = require('../handlers/performers');

// test route
router.get( '/check', (req, res) => res.send('checkitout!'));


// database routes
router.post('/getData',             checkTable,
                                    db.getData                  );

// auth routes
router.post('/newPerformer',        performer.newPerformer      );
router.post('/login',               auth.login                  );
router.post('/resetPassword',       auth.resetPassword          );
router.post('/newPasswordLogin',    auth.newPasswordLogin       );
router.post('/registerReset',       auth.registerReset          );


// email route
router.post('/email',               email.emailHandler          );


// image routes
router.post('/signature',           cloudinary.getSignature     );
router.post('/fetchImage',          cloudinary.fetchImage       );
router.put( '/updateIGToken',       instagram.updateToken       );


module.exports = router;
