// const expense = require('../models/expensemodel')
const Expense = require('../models/expensemodel')
const Sequelize = require('sequelize')
const User = require('../models/signupmodel')
const logger = require('../middleware/logger')
const sequelize = require('../util/database')
const mongoose = require('mongoose');
// const client = require('../util/redis')

// TODO Storing expense details
// exports.expense = async (req, res, next) => {
//   const t = await sequelize.transaction()
//   try {
//     const expenseAmount = req.body.expenseAmount
//     const checkDescription = req.body.checkDescription
//     const category = req.body.category

//     const expense = await Expense.create({
//       expenseamount: expenseAmount,
//       category,
//       description: checkDescription,
//       signupId: req.user.id
//     }
//     // { transaction: t }
//     )
//     // try {
//     const user = await User.findByPk(req.user.id)
//     if (user) {
//       const previousTotalAmount = user.totalAmount
//       // console.log("previoustotal amount ",previosTotalAmount)
//       const currentTotalAmount = Number(previousTotalAmount) + Number(expenseAmount)
//       // console.log("currentTotalAmount" ,currentTotalAmount)
//       await User.update({ totalAmount: currentTotalAmount }, { where: { id: req.user.id } }
//         // { transaction: t }
//       )
//       // res.status(200).json({ expense })
//     }
//     // } catch (error) {
//     //   logger.error('An error occurred:', error)
//     //   res.status(500).json({ success: false, error })
//     // }
//     //

//     // await t.commit()
//     console.log('the expense details are stored')
//     res.status(200).json({ msg: 'success' })
//   } catch (err) {
//     // if (t) {
//     //   await t.rollback()
//     // }
//     logger.error('An error occurred:', err)
//     res.status(500).json({ msg: err })
//   }
// }

exports.expense = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const expenseAmount = req.body.expenseAmount;
    const checkDescription = req.body.checkDescription;
    const category = req.body.category;

    // Create an expense document and save it to the database
    const expense = new Expense({
      expenseamount: expenseAmount,
      category,
      description: checkDescription,
      signupId: req.user.id,
    });
    await expense.save({ session });

    // Update the totalAmount in the user document
    const user = await User.findById(req.user.id).session(session);
    if (user) {
      const previousTotalAmount = user.totalAmount;
      const currentTotalAmount = Number(previousTotalAmount) + Number(expenseAmount);
      user.totalAmount = currentTotalAmount;
      await user.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    console.log('the expense details are stored');
    res.status(200).json({ msg: 'success' });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    logger.error('An error occurred:', err);
    res.status(500).json({ msg: err.message });
  }
};




const defultItemsPerPage = 5
// TODO Get expense details by page limit
exports.getexpense = async (req, res, next) => {
  try {
    const pageSize = parseInt(req.query.pageSize) || defultItemsPerPage
    const page = parseInt(req.query.page) || 1
    console.log('the page number', page)
    const offsetsize = (page - 1) * pageSize
    console.log('req.user id -------->', req.user.id)

    const totalItems = await Expense.countDocuments({ signupId: req.user.id });


    console.log("TOOTALLL ITEMS", totalItems)
    const expenses = await Expense.find({ signupId:req.user.id })
    .skip(offsetsize)
    .limit(pageSize)

    // const expense = await Expense.findAll();
    res.status(200).json({
      expensedetails: expenses,
      pageData: {
        currentPage: page,
        hasNextPage: pageSize * page < totalItems,
        nextPage: page + 1,
        hasPreviousPage: page > 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / pageSize)
      }
    })
    console.log('the expense details are getting',expenses)
  } catch (err) {
    logger.error('An error occurred:', err)
    res.status(500).json({ msg: err })
  }
}









// TODO Delete expense details
// exports.deleteexpense = async (req, res, next) => {
//   const t = await sequelize.transaction()
//   try {
//     const expenseId = req.body.expenseId
//     const expense = await Expense.find({ where: { signupId: req.user.id } })
//     // const expense = await Expense.findAll({ where: { signupId: req.user.id}});
//     console.log('delete expense ------>', expense.expenseamount)
//     if (expense) {
//       await expense.destroy({ transaction: t })
//       res.status(200).json({ msg: 'Expense deleted successfully' })

//       const user = await User.findByPk(req.user.id)
//       if (user) {
//         const previousTotalAmount = user.totalAmount
//         // console.log("previoustotal amount ",previosTotalAmount)
//         const currentTotalAmount = Number(previousTotalAmount) - Number(expense.expenseamount)
//         // console.log("currentTotalAmount" ,currentTotalAmount)
//         await User.update({ totalAmount: currentTotalAmount }, { where: { id: req.user.id } }, { transaction: t })
//         // res.status(200).json({ expense })
//       }
//       await t.commit()
//     } else {
//       res.status(404).json({ msg: 'Expense not found' })
//     }
//   } catch (err) {
//     if (t) {
//       await t.rollback()
//     }
//     logger.error('An error occurred:', err)
//     res.status(500).json({ error: 'An error occurred while deleting the expense' })
//   }
// }


exports.deleteexpense = async (req, res, next) => {
  try {
    const expenseId = req.params.expenseId;
    console.log("THE  DELETING EXPENSING ID",expenseId)
    console.log("the deleting used id by", req.user.id)

    // Find the expense with the provided ID and the current user's ID
    const expense = await Expense.findOne({
      _id: expenseId,
      signupId: req.user.id, // Assuming req.user contains the user object with _id field
    });

    if (expense) {
      // Save the expense amount before deleting for updating totalAmount
      const expenseAmount = Number(expense.expenseamount);

      // Delete the expense
      await Expense.deleteOne({ _id: expenseId });

      // Update the user's totalAmount
      const user = await User.findById(req.user.id);
      if (user) {
        const previousTotalAmount = user.totalAmount;
        const currentTotalAmount = Number(previousTotalAmount) - expenseAmount;
        await user.updateOne({ totalAmount: currentTotalAmount });
      }

      res.status(200).json({ msg: 'Expense deleted successfully' });
    } else {
      res.status(404).json({ msg: 'Expense not found' });
    }
  } catch (err) {
    logger.error('An error occurred:', err);
    res.status(500).json({ error: 'An error occurred while deleting the expense' });
  }
};