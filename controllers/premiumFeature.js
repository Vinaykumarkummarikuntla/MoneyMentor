const Expense = require('../models/expensemodel')
const Sequelize = require('sequelize')
const User = require('../models/signupmodel')

// leaderboard details
exports.showleaderboard = async (req, res, next) => {
  try {
    const leaderboard = await User.findAll({
      order: [[Sequelize.literal('totalAmount'), 'DESC']]
    })

    res.status(200).json({ leaderboardresponse: leaderboard })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'An error occurred while fetching leaderboard data' })
  }
}
