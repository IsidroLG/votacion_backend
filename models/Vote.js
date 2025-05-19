// models/Vote.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vote = sequelize.define('Vote', {
    presidentVotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    memberVotes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    candidateId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    electionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
});

module.exports = Vote;
