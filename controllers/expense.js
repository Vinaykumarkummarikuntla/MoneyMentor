const Expense = require("../models/expensemodel");
const client = require("../util/redis");

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
      signupId: req.user.id,
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
    console.log("req.user id -------->",req.user.id)
    const expense = await Expense.findAll({ where: { signupId: req.user.id}});
    // const expense = await Expense.findAll();
    res.status(200).json({ expensedetails: expense });
    console.log("the expense details are getting");
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: err });
  }
};

// redis getting details

// Get expense details
// exports.getexpense = async (req, res, next) => {
//   console.log('get expenses');
//   try {
//     const userId = req.user.id;
//     const cacheKey = `expenses:${userId}`;

//     // Establish Redis client connection
//     client.connect();
//     console.log("client connect")

//     // Check if the data exists in Redis cache
//     client.get(cacheKey, async (err, cachedData) => {
//       // if (err) {
//       //   console.log("err")
//       //   console.error("Redis cache error:", err);
//       //   res.status(500).json({ msg: err });
//       //   return;
//       // }

//       if (cachedData) {
//         // If data exists in cache, return it
//         console.log("Retrieving expense details from cache");
//         const expenses = JSON.parse(cachedData);
//         res.status(200).json({ expensedetails: expenses });
//       } else {
//         // If data doesn't exist in cache, fetch it from the database
//         console.log("Fetching expense details from the database");

//         const expenses = await Expense.findAll({ where: { signupId: userId } });

//         // Store the fetched data in Redis cache
//         client.setex(cacheKey, 3600, JSON.stringify(expenses)); // Set cache expiration time (3600 seconds = 1 hour)

//         res.status(200).json({ expensedetails: expenses });
//       }
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ msg: err });
//   }
// };

// delete expense details
exports.deleteexpense = async (req, res, next) => {
  try {
    const expenseId = req.body.expenseId;
    const expense = await Expense.findOne({ where: { signupId: req.user.id } });
    // const expense = await Expense.findAll({ where: { signupId: req.user.id}});
    if (expense) {
      await expense.destroy();
      res.status(200).json({ msg: "Expense deleted successfully" });
    } else {
      res.status(404).json({ msg: "Expense not found" });
    }
  } catch (err) {
    console.log(err)
    res
      .status(500)
      .json({ error: "An error occurred while deleting the expense" })
  }
}
