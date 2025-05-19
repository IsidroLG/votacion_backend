const express = require('express');
const { register, login, getUserProfile } = require('../controllers/authController');
const authenticate = require('../middleware/auth');

const router = express.Router();

// Registro y login
router.post('/register', register);
router.post('/login', login);

// Ruta protegida para obtener perfil del usuario autenticado
router.get('/me', authenticate, getUserProfile);

module.exports = router;
