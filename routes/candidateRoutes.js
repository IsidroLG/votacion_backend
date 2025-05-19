const express = require('express');
const router = express.Router();
const candidateController = require('../controllers/candidateController');
const authenticateToken = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

// Obtener todos los candidatos (público)
router.get('/getAll', candidateController.getAllCandidates);

// Buscar un candidato por nombre
router.get('/search', candidateController.searchCandidateByName);

// Obtener candidatos por electionId
router.get('/election', candidateController.getCandidatesByElection);

// Crear un nuevo candidato (solo admin)
router.post('/create', authenticateToken, isAdmin, candidateController.createCandidate);

// Eliminar un candidato (solo admin)
router.delete('/delete', authenticateToken, isAdmin, candidateController.deleteCandidate);

module.exports = router;
