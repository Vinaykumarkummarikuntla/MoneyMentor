const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const Order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  expenseamount: Sequelize.STRING,

  paymentid: Sequelize.STRING,

  orderid: Sequelize.STRING,
  
  status: Sequelize.STRING,
  
  ispremiumuser : Sequelize.BOOLEAN

});

module.exports = Order;
