const { DataTypes, Sequelize } = require('sequelize')
const { v4: uuidv4 } = require('uuid')
const sequelize = require('../util/database')

const ForgotPasswordRequests = sequelize.define('ForgotPasswordRequests', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
})
module.exports = ForgotPasswordRequests
