
const express = require('express');
const {
    createElection,
    getActiveElection,
    deleteElection
} = require('../controllers/electionController');

const authenticate = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

const router = express.Router();

// Crear una elección (solo admin)
router.post('/', authenticate, isAdmin, createElection);

// Verificar si hay elección activa
//router.get('/active', getActiveElection);

// Eliminar una elección (solo admin)
//router.delete('/:id', authenticate, isAdmin, deleteElection);

module.exports = router;

