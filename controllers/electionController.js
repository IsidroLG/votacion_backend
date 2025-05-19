//controllers/electionController
const  Election  = require('../models/Election');

exports.createElection = async (req, res) => {
    try {
        const { titulo, descripcion, fecha_inicio, fecha_fin,estado} = req.body;

        // Verificar si el usuario tiene rol de admin
        const { rol } = req.user;
        if (rol !== 'admin') {
            return res.status(403).json({ error: 'No autorizado, se necesita ser administrador' });
        }

        // Verificar si ya existe un evento de elecciones activo
        console.log(titulo,descripcion,fecha_inicio,fecha_fin,estado)
        const electionExistent = await Election.findOne({ where: { estado: 'abierta' } });
        console.log(electionExistent);
        if (electionExistent) {
            return res.status(409).json({ error: 'Ya existe un evento de elecciones activo' });
        }

        const newElection = await Election.create({
            titulo,
            descripcion,
            fecha_inicio,
            fecha_fin,
            estado: 'abierta', // Estado inicial
        });

        res.status(201).json({ message: 'Evento de elecciones creado con éxito', evento: newElection });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el evento de elecciones' });
    }
};
