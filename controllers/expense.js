// const expense = require('../models/expensemodel')
const Expense = require('../models/expensemodel')
const Sequelize = require('sequelize')
const User = require('../models/signupmodel')
const logger = require('../logger')
const sequelize = require('../util/database')
// const client = require('../util/redis')

// storing expense details
exports.expense = async (req, res, next) => {
 let  t = sequelize.transaction()
  try {
    const expenseAmount = req.body.expenseAmount
    const checkDescription = req.body.checkDescription
    const category = req.body.category

    const expense = await Expense.create({
      expenseamount: expenseAmount,
      category,
      description: checkDescription,
      signupId: req.user.id
    })
    // try {
    const user = await User.findByPk(req.user.id)
    if (user) {
      const previousTotalAmount = user.totalAmount
      // console.log("previoustotal amount ",previosTotalAmount)
      const currentTotalAmount = Number(previousTotalAmount) + Number(expenseAmount)
      // console.log("currentTotalAmount" ,currentTotalAmount)
      await User.update({ totalAmount: currentTotalAmount }, { where: { id: req.user.id } })
      // res.status(200).json({ expense })
    }
    // } catch (error) {
    //   logger.error('An error occurred:', error)
    //   res.status(500).json({ success: false, error })
    // }
    // 
    await t.then(function(transaction) {
       transaction.commit();
      console.log('the expense details are stored');
      res.status(200).json({ msg: 'success' });
    });
  } catch (err) {
    
    await t.rollback()
    console.error(err)
    res.status(500).json({ msg: err })
  }
}

// get expense details
exports.getexpense = async (req, res, next) => {
  try {
    console.log('req.user id -------->', req.user.id)
    const expense = await Expense.findAll({ where: { signupId: req.user.id } })
    // const expense = await Expense.findAll();
    res.status(200).json({ expensedetails: expense })
    console.log('the expense details are getting')
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: err })
  }
}

// delete expense details
exports.deleteexpense = async (req, res, next) => {
  
  try {
    const expenseId = req.body.expenseId
    const expense = await Expense.findOne({ where: { signupId: req.user.id } })
    // const expense = await Expense.findAll({ where: { signupId: req.user.id}});
    if (expense) {
      await expense.destroy()
      res.status(200).json({ msg: 'Expense deleted successfully' })
    } else {
      res.status(404).json({ msg: 'Expense not found' })
    }
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'An error occurred while deleting the expense' })
  }
}
