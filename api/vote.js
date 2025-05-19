const express = require('express');
const { vote, getResults } = require('../controllers/voteController');
const authenticate = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticate, vote);
//router.get('/resultados', getResults);

module.exports = router;
