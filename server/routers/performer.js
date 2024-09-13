








const express       = require('express');
const router        = express.Router();

const performers    = require('../handlers/performers');


router.put( '/updatePerformer',  performers.updatePerformer  );

module.exports = router;
