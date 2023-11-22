require('dotenv').config()
const logger = require('../middleware/logger')
const Razorpay = require('razorpay')
const Order = require('../models/ordermodel')
const jwt = require('jsonwebtoken')
const { encryptData, decryptData } = require('../security/encryanddecrypt');

// TODO Generate a token
// secret key generated from ours linux-terminal
function generateAccessToken (id, mail, isPremiumUser) {
  return jwt.sign(
    { userId: id, mail, isPremiumUser },
    process.env.GENERATEACCESSTOKEN
  )
}

// TODO Purchase premium
exports.purchasePremium = async (req, res) => {
  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY
    })

    const amount = 5000
    rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err))
      }
      const encryptedStatus = encryptData('PENDING');
      req.user
        .createOrder({
          orderid: order.id,
          status: encryptedStatus
        })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id })
        })
        .catch((err) => {
          logger.error('An error occurred:', err)
          throw new Error(err)
        })
    })
  } catch (err) {
    logger.error('An error occurred:', err)
    res.status(403).json({ message: 'Something went wrong', error: err })
  }
}

// TODO Update transaction details
exports.updatetransactionstatus = async (req, res, next) => {
  try {
    const { payment_id, order_id } = req.body
    const order = await Order.findOne({ where: { orderid: order_id } })
    // console.log("payment_id id is ",payment_id)
    const promise1 = order.update({
      paymentid: payment_id,
      status: encryptData('SUCCESSFUL')
    })
    console.log('backenduser', req.user.id)
    // const promise2 = order.update({ ispremiumuser: true });
    const promise2 = req.user.update({ ispremiumuser: encryptData(true) })
    Promise.all([promise1, promise2])
      .then(() => {
        const decryptedIsPremiumUser = decryptData(req.user.ispremiumuser);
        return res
          .status(202).json({
            success: true,
            message: 'Transaction Successful',
            token: generateAccessToken(req.user.id, undefined, decryptedIsPremiumUser)
          })
      })
      .catch((error) => {
        throw new Error(error)
      })
  } catch (err) {
    logger.error('An error occurred:', err)
    // console.log(err)
    res.status(403).json({ error: err, message: 'Something went wrong' })
  }
}
