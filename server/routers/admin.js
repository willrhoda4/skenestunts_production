








const express       = require('express');
const router        = express.Router();


const db            = require('../handlers/database');


// Database routes
router.post('/deleteData',          db.deleteData               );
router.post('/reRankData',          db.reRankData               );
router.post('/addData',             db.addData                  );


module.exports = router;
