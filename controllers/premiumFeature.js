const Expense = require('../models/expensemodel')
const Sequelize = require('sequelize')
const User = require('../models/signupmodel')

// leaderboard details
exports.showleaderboard = async (req, res, next) => {
  try {
    const leaderboard = await User.findAll({
      attributes: [
        'id',
        'username',
        [Sequelize.fn('SUM', Sequelize.col('expenses.expenseamount')), 'total_amount']
      ],
      include: [{
        model: Expense,
        attributes: []
      }],
      group: ['signup.id', 'username'],
      order: [[Sequelize.literal('total_amount'), 'DESC']]
    });
    
    

    res.status(200).json({ leaderboardresponse: leaderboard })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'An error occurred while fetching leaderboard data' })
  }
}
