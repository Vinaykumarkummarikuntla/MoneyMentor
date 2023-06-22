// const Expense = require('../models/expensemodel')
const Sequelize = require('sequelize')
const User = require('../models/signupmodel')
const logger = require('../logger')

// leaderboard details
exports.showleaderboard = async (req, res, next) => {
  try {
    const leaderboard = await User.findAll({
      order: [[Sequelize.literal('totalAmount'), 'DESC']]
    })

    res.status(200).json({ leaderboardresponse: leaderboard })
  } catch (error) {
    logger.error('An error occurred:', error)
    res
      .status(500)
      .json({ error: 'An error occurred while fetching leaderboard data' })
  }
}
