// const { DataTypes, Sequelize } = require('sequelize')
// const { v4: uuidv4 } = require('uuid')
// const sequelize = require('../util/database')

// const ForgotPasswordRequests = sequelize.define('ForgotPasswordRequests', {
//   id: {
//     type: DataTypes.UUID,
//     defaultValue: Sequelize.UUIDV4,
//     primaryKey: true
//   },
//   userId: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   isActive: {
//     type: DataTypes.BOOLEAN,
//     defaultValue: true
//   }
// })
// module.exports = ForgotPasswordRequests

const mongoose = require('mongoose');

// Define the Mongoose Schema
const forgotPasswordRequestSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  userId: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Create the Mongoose Model for 'ForgotPasswordRequests'
const ForgotPasswordRequests = mongoose.model('ForgotPasswordRequests', forgotPasswordRequestSchema);

module.exports = ForgotPasswordRequests;
