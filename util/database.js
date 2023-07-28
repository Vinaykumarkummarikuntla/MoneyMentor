require('dotenv').config()
const path = require('path')
const fs = require('fs')
const mongoose = require('mongoose');
// const Sequelize = require('sequelize')

// // TODO Database Connection
// const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//   dialect: 'mysql',
//   host: process.env.DB_LOCALHOST
// })
// console.log('DB CONNECTED')
// module.exports = sequelize


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', () => {
    console.log('MongoDB connected');
  });

