








const express       = require('express');
const router        = express.Router();


const db            = require('../handlers/database');


router.put( '/updateData',          db.updateData               );


module.exports = router;
