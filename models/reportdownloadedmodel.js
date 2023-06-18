const sequelize = require('../util/database')
const Sequelize = require('sequelize')

const reportdownloaded = sequelize.define('reportdownloaded', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: Sequelize.INTEGER
  },

  fileURL: Sequelize.STRING

})

module.exports = reportdownloaded
