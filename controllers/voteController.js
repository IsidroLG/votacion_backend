// controllers/voteController.js
const { Vote, Candidate, Election } = require('../models');

exports.castVote = async (req, res) => {
    try {
        const { electionId, presidentId, memberIds } = req.body;

        // Validación básica
        if (!electionId || !presidentId || !Array.isArray(memberIds)) {
            return res.status(400).json({ error: 'Datos inválidos.' });
        }

        if (memberIds.length !== 8) {
            return res.status(400).json({ error: 'Debe seleccionar exactamente 8 miembros.' });
        }

        if (!memberIds.includes(presidentId)) {
            return res.status(400).json({ error: 'El presidente también debe estar entre los miembros.' });
        }

        // Verificar si la elección existe y está abierta
        const election = await Election.findByPk(electionId);
        if (!election) {
            return res.status(404).json({ error: 'Elección no encontrada.' });
        }
        console.log(election.estado)
        if (election.estado==="cerrada") {
            return res.status(403).json({ error: 'La elección está cerrada. No se pueden emitir votos.' });
        }

        // Función para actualizar votos
        const updateVote = async (candidateId, field) => {
            const [vote, created] = await Vote.findOrCreate({
                where: { candidateId, electionId },
                defaults: { presidentVotes: 0, membersVotes: 0 },
            });

            vote[field] += 1;
            await vote.save();
        };

        // Votar al presidente
        await updateVote(presidentId, 'presidentVotes');

        // Votar a los miembros
        for (const memberId of memberIds) {
            await updateVote(memberId, 'membersVotes');
        }

        res.json({ message: 'Voto registrado con éxito.' });
    } catch (error) {
        console.error('Error al registrar voto:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};

exports.getElectionResults = async (req, res) => {
    try {
        const { electionId } = req.body;

        const votos = await Vote.findAll({
            where: { electionId },
            include: {
                model: Candidate,
                as: 'candidate',
                attributes: ['id', 'nombre', 'carrera', 'anio', 'foto_url']
            },
            order: [
                ['presidentVotes', 'DESC'],
                ['memberVotes', 'DESC']
            ]
        });

        const resultados = votos.map(v => ({
            id: v.candidate.id,
            nombre: v.candidate.nombre,
            carrera: v.candidate.carrera,
            anio: v.candidate.anio,
            foto_url: v.candidate.foto_url,
            presidentVotes: v.presidentVotes,
            membersVotes: v.membersVotes
        }));

        res.json(resultados);
    } catch (error) {
        console.error('Error al obtener resultados:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};
