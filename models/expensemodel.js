const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const expense = sequelize.define('expenses', {
    id: {
       type: Sequelize.INTEGER,
       autoIncrement: true,
       allowNull: false,
       primaryKey: true,
    },
    expenseamount: {
       type: Sequelize.STRING,
       allowNull: false,
    },
    category: {
       type: Sequelize.STRING,
       allowNull: false,
    },

    description: {
       type: Sequelize.STRING,
       allowNull: false,
       
    },
    image: {
        type: Sequelize.STRING,
        allowNull: true, // Assuming the image is optional and can be empty
      },

 });
 
 module.exports = expense;