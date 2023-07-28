const Expense = require('../models/expensemodel')
const { Sequelize } = require('sequelize')
const logger = ("../middleware/logger.js")

// The details getting by categorywise
// exports.getExpenseByCategory = async (req, res, next) => {
//   try {
//     const categoryWiseAmount = await Expense.findAll({
//       attributes: [
//         'category',
//         [Sequelize.fn('SUM', Sequelize.col('expenseamount')), 'total_amount']
//       ],
//       where: {
//         signupId: req.user.id
//       },
//       group: 'category'
//     })
//     console.log('EXPENSES BY CATEGORY:', categoryWiseAmount)
//     res.status(200).json(categoryWiseAmount)
//   } catch (error) {
//     console.log(error)
//     res.status(500).json({ msg: 'Internal Server Error' })
//   }
// }


exports.getExpenseByCategory = async (req, res, next) => {
  try {
    const categoryWiseAmount = await Expense.aggregate([
      {
        $group: {
          _id: {
            signupId: '$signupId',
            category: '$category',
          },
          total_amount: { $sum: { $toDouble: '$expenseamount' } },
        },
      },
      {
        $project: {
          signupId: '$_id.signupId',
          category: '$_id.category',
          total_amount: 1,
          _id: 0,
        },
      },
    ]);

    console.log('TOTAL AMOUNT BY USER AND CATEGORY:', categoryWiseAmount);
    res.status(200).json(categoryWiseAmount);
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).json({ msg: 'Internal Server Error' });
  }
};
