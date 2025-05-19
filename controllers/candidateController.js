const Candidate = require('../models/Candidate');
const Election = require('../models/Election');

// Obtener todos los candidatos
exports.getAllCandidates = async (req, res) => {
    try {
        const candidatos = await Candidate.findAll();
        res.status(200).json(candidatos);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los candidatos' });
    }
};

// Buscar un candidato por nombre
exports.searchCandidateByName = async (req, res) => {
    const { nombre } = req.query;
    if (!nombre) return res.status(400).json({ error: 'Se requiere el parámetro nombre' });

    try {
        const candidato = await Candidate.findOne({ where: { nombre } });
        if (!candidato) return res.status(404).json({ error: 'Candidato no encontrado' });
        res.status(200).json(candidato);
    } catch (err) {
        res.status(500).json({ error: 'Error al buscar el candidato' });
    }
};

// Obtener candidatos por electionId
exports.getCandidatesByElection = async (req, res) => {
    const { electionId } = req.query; // Usar query, no body
    if (!electionId) return res.status(400).json({ error: 'Se requiere electionId' });

    try {
        const candidatos = await Candidate.findAll({ where: { electionId } });
        res.status(200).json(candidatos);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener candidatos por elección' });
    }
};

// Crear un nuevo candidato
exports.createCandidate = async (req, res) => {
    try {
        const { nombre, carrera, anio, biografia, foto_url } = req.body;

        // Verificar elección activa
        const election = await Election.findOne({ where: { estado: 'abierta' } });
        if (!election) {
            return res.status(400).json({ error: 'No hay una elección activa' });
        }

        // Verificar duplicado
        const existingCandidate = await Candidate.findOne({
            where: { nombre, electionId: election.id },
        });

        if (existingCandidate) {
            return res.status(409).json({ error: 'El candidato ya está registrado en esta elección' });
        }

        // Crear candidato
        const newCandidate = await Candidate.create({
            nombre, carrera, anio, biografia, foto_url, electionId: election.id
        });

        res.status(201).json({ message: 'Candidato creado correctamente', candidato: newCandidate });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear candidato' });
    }
};

// Eliminar candidato
exports.deleteCandidate = async (req, res) => {
    const { id } = req.body;
    if (!id) return res.status(400).json({ error: 'Se requiere el id del candidato' });

    try {
        const candidato = await Candidate.findByPk(id);
        if (!candidato) {
            return res.status(404).json({ error: 'Candidato no encontrado' });
        }

        await candidato.destroy();
        res.status(200).json({ message: 'Candidato eliminado con éxito' });
    } catch (err) {
        res.status(500).json({ error: 'Error al eliminar el candidato' });
    }
};
