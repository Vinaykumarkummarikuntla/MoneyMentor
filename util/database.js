// require('dotenv').config()
// const path = require('path')
// const fs = require('fs')
// const Sequelize = require('sequelize')

// // TODO Database Connection
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//   dialect: 'mysql',
//   host: process.env.DB_LOCALHOST
// })
// console.log('DB CONNECTED')
// module.exports = sequelize



require('dotenv').config()
const path = require('path')
const fs = require('fs')
const Sequelize = require('sequelize')

// TODO Database Connection
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {

  port: 3306,
  dialect: 'mysql',
  host: process.env.DB_LOCALHOST,
  dialectOptions: {
    ssl: {
      ca: fs.readFileSync(path.resolve(__dirname, '../DigiCertGlobalRootCA.crt.pem')),        // Path to CA certificate
    }
}})

console.log('DB CONNECTED in database.js')
module.exports = sequelize