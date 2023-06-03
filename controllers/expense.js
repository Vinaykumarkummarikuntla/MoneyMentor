const Expense = require("../models/expensemodel");

// storing expense details
exports.expense = async (req, res, next) => {
  try {
    const expenseAmount = req.body.expenseAmount;
    const checkDescription = req.body.checkDescription;
    const category = req.body.category;

    const expense = await Expense.create({
      expenseamount: expenseAmount,
      category: category,
      description: checkDescription,
    });
    console.log("the expense details are stored");
    res.status(200).json({ msg: "success" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err });
  }
};

// get expense details
exports.getexpense = async (req, res, next) => {
  try {
    const expense = await Expense.findAll();

    res.status(200).json({ expensedetails: expense });
    console.log("the expense details are getting");
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err });
  }
};

// delete expense details
exports.deleteexpense = async (req, res, next) => {
  try {
    const expenseId = req.body.expenseId;
    const expense = await Expense.findByPk(expenseId);
    if (expense) {
      await expense.destroy();
      res.status(200).json({ msg: "Expense deleted successfully" });
    } else {
      res.status(404).json({ msg: "Expense not found" });
    }
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the expense" });
  }
};