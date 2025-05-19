const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_SECRET = process.env.ADMIN_SECRET;


// Función para registrar usuarios
exports.register = async (req, res) => {
    const { nombre, correo, password, rol, adminPassword } = req.body;

    try {
        // Verificar si el correo ya está registrado
        const existingUser = await User.findOne({ where: { correo } });
        if (existingUser) {
            return res.status(409).json({ error: 'El correo ya está registrado' });
        }

        // Verificar si se quiere registrar como admin y comprobar contraseña de admin
        if (rol === 'admin') {
            if (!adminPassword || adminPassword !== ADMIN_SECRET) {
                return res.status(403).json({ error: 'Contraseña de administrador incorrecta o no proporcionada' });
            }
        }

        // Hashear la contraseña del usuario
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear el nuevo usuario
        const newUser = await User.create({
            nombre,
            correo,
            password: hashedPassword,
            rol,
        });

        res.status(201).json({ message: 'Usuario registrado con éxito', usuario: { id: newUser.id, nombre: newUser.nombre, correo: newUser.correo, rol: newUser.rol } });

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ error: 'Error del servidor al registrar usuario' });
    }
};

// Función para login de usuario
exports.login = async (req, res) => {
    const { correo, password } = req.body;

    try {
        const user = await User.findOne({ where: { correo } });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: user.id, correo: user.correo, rol: user.rol },
            JWT_SECRET,
            { expiresIn: '2h' }
        );

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id,
                nombre: user.nombre,
                correo: user.correo,
                rol: user.rol
            }
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error del servidor al iniciar sesión' });
    }
};
// Obtener perfil del usuario autenticado
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'nombre', 'correo', 'rol'],
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ error: 'Error del servidor al obtener perfil' });
    }
};
