// const Sequelize = require('sequelize')
// const sequelize = require('../util/database')
// const Signup = require('../models/signupmodel')

// const expense = sequelize.define('expenses', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   expenseamount: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   category: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },

//   description: {
//     type: Sequelize.STRING,
//     allowNull: false

//   },
//   image: {
//     type: Sequelize.STRING,
//     allowNull: true // Assuming the image is optional and can be empty
//   }

// })

// module.exports = expense

const mongoose = require('mongoose');

// Define the Mongoose Schema
const expenseSchema = new mongoose.Schema({
  expenseamount: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false, // Assuming the image is optional and can be empty
  },
  signupId: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: 'User', // Reference to the 'User' model
    required: true,
  }

});

// Create the Mongoose Model for 'expense'
const Expense = mongoose.model('expenses', expenseSchema);

module.exports = Expense;
