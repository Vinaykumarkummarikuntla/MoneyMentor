require('dotenv').config()
const path = require('path')
const fs = require('fs')

const Sequelize = require('sequelize')
const sequelize = new Sequelize('moneymentor', process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: 'mysql',
  host: process.env.DB_LOCALHOST,
  dialectOptions: {
    ssl: {
      ca: fs.readFileSync(
        '/media/vinay/CC4A7C094A7BEE98/MoneyMentor/certificate/DigiCertGlobalRootCA.crt.pem'
      ) // Path to the CA certificate
    }
  }
})

module.exports = sequelize
