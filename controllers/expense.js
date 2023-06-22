// const expense = require('../models/expensemodel')
const Expense = require('../models/expensemodel')
const Sequelize = require('sequelize')
const User = require('../models/signupmodel')
const logger = require('../logger')
const sequelize = require('../util/database')
// const client = require('../util/redis')

// storing expense details
exports.expense = async (req, res, next) => {
  const t = await sequelize.transaction()
  try {
    const expenseAmount = req.body.expenseAmount
    const checkDescription = req.body.checkDescription
    const category = req.body.category

    const expense = await Expense.create({
      expenseamount: expenseAmount,
      category,
      description: checkDescription,
      signupId: req.user.id
    }
    // { transaction: t }
    )
    // try {
    const user = await User.findByPk(req.user.id)
    if (user) {
      const previousTotalAmount = user.totalAmount
      // console.log("previoustotal amount ",previosTotalAmount)
      const currentTotalAmount = Number(previousTotalAmount) + Number(expenseAmount)
      // console.log("currentTotalAmount" ,currentTotalAmount)
      await User.update({ totalAmount: currentTotalAmount }, { where: { id: req.user.id } }
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
// get expense details
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
    }
    )

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

// delete expense details
exports.deleteexpense = async (req, res, next) => {
  const t = await sequelize.transaction()
  try {
    const expenseId = req.body.expenseId
    const expense = await Expense.findOne({ where: { signupId: req.user.id } })
    // const expense = await Expense.findAll({ where: { signupId: req.user.id}});
    console.log('delete expense ------>', expense.expenseamount)
    if (expense) {
      await expense.destroy({ transaction: t })
      res.status(200).json({ msg: 'Expense deleted successfully' })

      const user = await User.findByPk(req.user.id)
      if (user) {
        const previousTotalAmount = user.totalAmount
        // console.log("previoustotal amount ",previosTotalAmount)
        const currentTotalAmount = Number(previousTotalAmount) - Number(expense.expenseamount)
        // console.log("currentTotalAmount" ,currentTotalAmount)
        await User.update({ totalAmount: currentTotalAmount }, { where: { id: req.user.id } }, { transaction: t })
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
