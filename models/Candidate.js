// models/Candidate.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Candidate = sequelize.define('Candidate', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    carrera: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    anio: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    biografia: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    foto_url: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    electionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

module.exports = Candidate;
