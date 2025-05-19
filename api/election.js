const express = require('express');
const { createElection, deleteElection, getActiveElection } = require('../controllers/electionController');
const authenticate = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

router.post('/', authenticate, isAdmin, createElection);
router.delete('/:id', authenticate, isAdmin, deleteElection);
router.get('/activa', getActiveElection); // para consultar si hay una elección activa

module.exports = router;
