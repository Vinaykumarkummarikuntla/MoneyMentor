const Expense = require('../models/expensemodel')
const { Sequelize } = require('sequelize')

// The details getting by categorywise
exports.getExpenseByCategory = async (req, res, next) => {
  try {
    const categoryWiseAmount = await Expense.findAll({
      attributes: [
        'category',
        [Sequelize.fn('SUM', Sequelize.col('expenseamount')), 'total_amount']
      ],
      where: {
        signupId: req.user.id
      },
      group: 'category'
    })
    console.log('EXPENSES BY CATEGORY:', categoryWiseAmount)
    res.status(200).json(categoryWiseAmount)
  } catch (error) {
    console.log(error)
    res.status(500).json({ msg: 'Internal Server Error' })
  }
}
