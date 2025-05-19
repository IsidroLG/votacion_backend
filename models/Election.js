// models/Election.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Election = sequelize.define('Election', {
    titulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    fecha_inicio: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    fecha_fin: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    estado: {
        type: DataTypes.STRING,
        defaultValue: 'abierta', // puede ser 'abierta' o 'cerrada'
    },
});

module.exports = Election;
