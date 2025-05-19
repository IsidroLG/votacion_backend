const express = require('express');
const { createCandidate, getCandidates, deleteCandidate } = require('../controllers/candidateController');
const authenticate = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

router.get('/', getCandidates);
router.post('/', authenticate, isAdmin, createCandidate);
router.delete('/:id', authenticate, isAdmin, deleteCandidate);

module.exports = router;
