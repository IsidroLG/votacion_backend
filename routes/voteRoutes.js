const express = require('express');
const router = express.Router();
const voteController = require('../controllers/voteController');

// Ruta para votar
router.post('/cast', voteController.castVote);

// Obtener resultados de una elección por ID
router.get('/results', voteController.getElectionResults);

module.exports = router;
