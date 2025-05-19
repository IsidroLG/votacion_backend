const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const sequelize = require('./config/database'); // conexión
const models = require('./models/index'); // debe exportar los modelos

// Definir asociaciones aquí
models.Candidate.hasOne(models.Vote, {
  foreignKey: 'candidateId',
  as: 'vote',
});

models.Vote.belongsTo(models.Candidate, {
  foreignKey: 'candidateId',
  as: 'candidate',
});

models.Election.hasMany(models.Vote, {
  foreignKey: 'electionId',
  as: 'votes',
});

models.Vote.belongsTo(models.Election, {
  foreignKey: 'electionId',
  as: 'election',
});

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const voteRoutes = require('./routes/voteRoutes');
const electionRoutes = require('./routes/electionRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Montar rutas
app.use('/api/auth', authRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/election', electionRoutes);
app.use('/api/vote', voteRoutes);

// Ruta 404
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Sincronización con la base de datos y arranque servidor
async function startServer() {
  try {
    await sequelize.sync({ force: false }); // o true para resetear tablas
    console.log('Base de datos sincronizada');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (err) {
    console.error('Error al sincronizar la base de datos:', err);
  }
}

startServer();
