// const expense = require('../models/expensemodel')
const Expense = require('../models/expensemodel')
const Sequelize = require('sequelize')
const User = require('../models/signupmodel')
const logger = require('../middleware/logger')
const sequelize = require('../util/database')
const { encryptData, decryptData } = require('../security/encryanddecrypt');
// const client = require('../util/redis')

// TODO Storing expense details
exports.expense = async (req, res, next) => {
  const t = await sequelize.transaction()
  try {
    const expenseAmount = encryptData(req.body.expenseAmount)
    const checkDescription = encryptData(req.body.checkDescription)
    const category = encryptData(req.body.category)

    const expense = await Expense.create({
      expenseamount: expenseAmount,
      category,
      description: checkDescription,
      signupId: encryptData(req.user.id)
    }
    // { transaction: t }
    )
    // try {
    const user = await User.findByPk((req.user.id))
    if (user) {
      const previousTotalAmount = decryptData(user.totalAmount);
      // console.log("previoustotal amount ",previosTotalAmount)
      const currentTotalAmount = Number(previousTotalAmount) + Number(decryptData(expenseAmount))
      // console.log("currentTotalAmount" ,currentTotalAmount)
      await User.update({ totalAmount: encryptData(currentTotalAmount) }, { where: { id: req.user.id } }
        // { transaction: t }
      )
      // res.status(200).json({ expense })
    }
    // } catch (error) {
    //   logger.error('An error occurred:', error)
    //   res.status(500).json({ success: false, error })
    // }
    //

    // await t.commit()
    console.log('the expense details are stored')
    res.status(200).json({ msg: 'success' })
  } catch (err) {
    // if (t) {
    //   await t.rollback()
    // }
    logger.error('An error occurred:', err)
    res.status(500).json({ msg: err })
  }
}

const defultItemsPerPage = 5
// TODO Get expense details by page limit
exports.getexpense = async (req, res, next) => {
  try {
    const pageSize = parseInt(req.query.pageSize) || defultItemsPerPage
    const page = parseInt(req.query.page) || 1
    console.log('the page number', page)
    const offsetsize = (page - 1) * pageSize
    console.log('req.user id -------->', req.user.id)

    const totalItems = await Expense.count({ where: { signupId: req.user.id } })

    const expense = await Expense.findAll({
      where: { signupId: req.user.id },
      offset: offsetsize,
      limit: pageSize
    })
    // const expense = await Expense.findAll();
    res.status(200).json({
      expensedetails: expense,
      pageData: {
        currentPage: page,
        hasNextPage: pageSize * page < totalItems,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / pageSize)
      }
    })
    console.log('the expense details are getting')
  } catch (err) {
    logger.error('An error occurred:', err)
    res.status(500).json({ msg: err })
  }
}

// TODO Delete expense details
exports.deleteexpense = async (req, res, next) => {
  const t = await sequelize.transaction()
  try {
    const expenseId = req.body.expenseId
    const expense = await Expense.findOne({ where: { signupId: req.user.id } })
    // const expense = await Expense.findAll({ where: { signupId: req.user.id}});
    console.log('delete expense ------>', expense.expenseamount)
    if (expense) {
      const deletedExpenseAmount = decryptData(expense.expenseamount);
      await expense.destroy({ transaction: t })
      res.status(200).json({ msg: 'Expense deleted successfully' })

      const user = await User.findByPk(req.user.id)
      if (user) {
        const previousTotalAmount = decryptData(user.totalAmount)
        // console.log("previoustotal amount ",previosTotalAmount)
        const currentTotalAmount = Number(previousTotalAmount) - Number(expense.expenseamount)
        // console.log("currentTotalAmount" ,currentTotalAmount)
        await User.update({ totalAmount:encryptData(currentTotalAmount) }, { where: { id: req.user.id } }, { transaction: t })
        // res.status(200).json({ expense })
      }
      await t.commit()
    } else {
      res.status(404).json({ msg: 'Expense not found' })
    }
  } catch (err) {
    if (t) {
      await t.rollback()
    }
    logger.error('An error occurred:', err)
    res.status(500).json({ error: 'An error occurred while deleting the expense' })
  }
}
