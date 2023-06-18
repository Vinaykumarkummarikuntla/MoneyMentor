require('dotenv').config()
const Expense = require('../models/expensemodel')
const AWS = require('aws-sdk')

function uploadToS3 (data) {
  const BUCKET_NAME = process.env.BUCKET_NAME
  const IAM_USER_KEY = process.env.IAM_USER_KEY
  const IAM_USER_SECRET = process.env.IAM_USER_SECRET

  const s3bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
    Bucket: BUCKET_NAME
  })

  s3bucket.createBucket(() => {
    const params = {
      Bucket: BUCKET_NAME,
      Key: 'expense.txt',
      Body: data

    }
    s3bucket.upload(params, (err, s3response) => {
      if (err) {
        console.log(err)
      } else {
        console.log('success', s3response)
      }
    })
  })
}
exports.downloadreport = async (req, res) => {
  try {
    const expense = await Expense.findAll({ where: { signupId: req.user.id } })
    const stringfyexpenses = JSON.stringify(expense)
    const fileURL = uploadToS3(stringfyexpenses)
    res.status(200).json({ fileURL, message: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: err })
  }
}
