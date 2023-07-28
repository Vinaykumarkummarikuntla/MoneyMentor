require('dotenv').config()
const Expense = require('../models/expensemodel')
const logger = require('../middleware/logger')
const S3Upload = require('../services/s3service')
const storereportDB = require('../services/filedownload')
const Alldownloadedfiles = require('../models/reportdownloadedmodel')

// Download expense details and storing S3
// exports.downloadreport = async (req, res) => {
//   try {
//     const expense = await Expense.findAll({ where: { signupId: req.user.id } })
//     const stringfyexpenses = JSON.stringify(expense)
//     const userId = req.user.id
//     const filename = `Expense${userId}/${new Date()}.txt`

//     const fileURL = await S3Upload.uploadToS3(stringfyexpenses, filename) // storing expense details in S3 BUCKET

//     const savingfileinDB = await storereportDB.storeURLInDB(userId, fileURL) // storing URL in DB

//     res.status(200).json({ fileURL, message: true })
//   } catch (err) {
//     logger.error('An error occurred:', err)
//     res.status(500).json({ fileURL: '', success: false, msg: err })
//   }
// }

// // Showing all downloaded files
// exports.showallreports = async (req, res) => {
//   try {
//     const alldownloadedfiles = await Alldownloadedfiles.findAll({ where: { userId: req.user.id } })

//     const stringfyfiles = JSON.stringify(alldownloadedfiles)
//     console.log(stringfyfiles)
//     res.status(200).json({ stringfyfiles, message: true })
//   } catch (err) {
//     logger.error('An error occurred:', err)
//     res.status(500).json({ success: false, msg: err })
//   }
// }



exports.downloadreport = async (req, res) => {
  try {
    const expenses = await Expense.find({ signupId: req.user.id });
    const stringfyexpenses = JSON.stringify(expenses);
    const userId = req.user.id;
    const filename = `Expense${userId}/${new Date()}.txt`;

    // Storing expense details in a local file
    fs.writeFileSync(filename, stringfyexpenses);

    // Save the file URL in the database
    const fileURL = filename;
    await Alldownloadedfiles.create({ userId, fileURL });

    res.status(200).json({ fileURL, message: true });
  } catch (err) {
    logger.error('An error occurred:', err);
    res.status(500).json({ fileURL: '', success: false, msg: err });
  }
};

// Showing all downloaded files
exports.showallreports = async (req, res) => {
  try {
    const alldownloadedfiles = await Alldownloadedfiles.find({ userId: req.user.id });

    const stringfyfiles = JSON.stringify(alldownloadedfiles);
    console.log(stringfyfiles);
    res.status(200).json({ stringfyfiles, message: true });
  } catch (err) {
    logger.error('An error occurred:', err);
    res.status(500).json({ success: false, msg: err });
  }
};