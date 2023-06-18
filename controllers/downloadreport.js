require('dotenv').config()
const Expense = require('../models/expensemodel')
const logger = require('../logger')
const S3Upload = require('../services/s3service')
const storereportDB = require('../services/filedownload')
const Alldownloadedfiles = require('../models/reportdownloadedmodel')

exports.downloadreport = async (req, res) => {
  try {
    const expense = await Expense.findAll({ where: { signupId: req.user.id } })
    const stringfyexpenses = JSON.stringify(expense)
    const userId = req.user.id
    const filename = `Expense${userId}/${new Date()}.txt`

    const fileURL = await S3Upload.uploadToS3(stringfyexpenses, filename) // storing expense details in S3 BUCKET

    const savingfileinDB = await storereportDB.storeURLInDB(userId, fileURL) // storing URL in DB

    res.status(200).json({ fileURL, message: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ fileURL: '', success: false, msg: err })
  }
}

exports.showallreports = async (req, res) => {
  try {
    const alldownloadedfiles = await Alldownloadedfiles.findAll({ where: { userId: req.user.id } })
    const stringfyfiles = JSON.stringify(alldownloadedfiles)
    console.log(stringfyfiles)
    res.status(200).json({ stringfyfiles, message: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ success: false, msg: err })
  }
}
