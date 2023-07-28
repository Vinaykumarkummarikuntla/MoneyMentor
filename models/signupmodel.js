// const Sequelize = require('sequelize')
// const sequelize = require('../util/database')

// const signup = sequelize.define('signup', {
//   id: {
//     type: Sequelize.INTEGER,
//     autoIncrement: true,
//     allowNull: false,
//     primaryKey: true
//   },
//   username: {
//     type: Sequelize.STRING,
//     allowNull: false
//   },
//   email: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     unique: true, // Ensure email is unique
//     validate: {
//       isEmail: {
//         msg: 'Invalid email format'
//       }
//     }
//   },
//   password: {
//     type: Sequelize.STRING,
//     allowNull: false,
//     validate: {
//       len: {
//         args: [8, 100], // Password must be between 8 and 100 characters long
//         msg: 'Password must be between 8 and 100 characters'
//       },
//       isStrongPassword: {
//         args: {
//           minLength: 8, // Minimum password length
//           minLowercase: 1, // Minimum number of lowercase letters
//           minUppercase: 1, // Minimum number of uppercase letters
//           minNumbers: 1, // Minimum number of digits
//           minSymbols: 1 // Minimum number of symbols
//         },
//         msg: 'Password must be strong'
//       }
//     }
//   },
//   totalAmount: {
//     type: Sequelize.INTEGER,
//     defaultValue: 0

//   }
// })

// module.exports = signup


const mongoose = require('mongoose');

// Define the Mongoose Schema
const signupSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (email) {
        // Validate email format
        return /\S+@\S+\.\S+/.test(email);
      },
      message: 'Invalid email format',
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (password) {
        // Validate password strength
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z!@#$%^&*()_+{}\[\]:;<>,.?~\/\\|-]).{8,}$/.test(password);
      },
      message: 'Password must be strong',
    },
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
});

// Create the Mongoose Model for 'signup'
const Signup = mongoose.model('signup', signupSchema);

module.exports = Signup;
