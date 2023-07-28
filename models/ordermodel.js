// const Sequelize = require("sequelize");
// const sequelize = require("../util/database");

// const Order = sequelize.define("order", {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true,
//   },
//   expenseamount: Sequelize.STRING,

//   paymentid: Sequelize.STRING,

//   orderid: Sequelize.STRING,
  
//   status: Sequelize.STRING,
  
//   ispremiumuser : Sequelize.BOOLEAN

// });

// module.exports = Order;
const mongoose = require('mongoose');

// Define the Mongoose Schema
const orderSchema = new mongoose.Schema({
  expenseamount: String,
  paymentid: String,
  orderid: String,
  status: String,
  ispremiumuser: Boolean,
});

// Create the Mongoose Model for 'Order'
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
