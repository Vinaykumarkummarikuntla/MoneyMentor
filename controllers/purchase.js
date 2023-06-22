require('dotenv').config()
const logger = require('../logger')
const Razorpay = require('razorpay')
const Order = require('../models/ordermodel')
// const userController = require("../controllers/login");
const jwt = require('jsonwebtoken')

// generate a token
// secret key generated from ours linux-terminal
function generateAccessToken (id, mail, isPremiumUser) {
  return jwt.sign(
    { userId: id, mail, isPremiumUser },
    process.env.GENERATEACCESSTOKEN
    // 'OM43lvuJhjSc74Wk9KGdKq33QQu7uojMhAyprCt1Mo5JKqjFJ2IdrQDgEm8omL2vN4hDglXFwNroOezKVBK+gg=='
  )
}

// purcahse premium
exports.purchasePremium = async (req, res) => {
  try {
    // key = 'process.env.RAZORPAY_KEY_ID',
    // secret_key = 'process.env.RAZORPAY_SECRET_KEY'
    // key = 'rzp_test_SKR2d6ojcvCQ9G',
    // secret_key = 'qS5QVk688OpL9qoQNKxncH2v'

    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET_KEY
    })

    const amount = 500

    rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err))
      }

      req.user
        .createOrder({
          orderid: order.id,
          status: 'PENDING'
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

// update transaction details
exports.updatetransactionstatus = async (req, res, next) => {
  try {
    const { payment_id, order_id } = req.body
    const order = await Order.findOne({ where: { orderid: order_id } })
    // console.log("payment_id id is ",payment_id)
    const promise1 = order.update({
      paymentid: payment_id,
      status: 'SUCCESSFUL'
    })
    console.log('backenduser', req.user.id)
    // const promise2 = order.update({ ispremiumuser: true });
    const promise2 = req.user.update({ ispremiumuser: true })
    // redisClient.set('isPremiumUser:' + req.user.id, true);

    Promise.all([promise1, promise2])
      .then(() => {
        return res
          .status(202)
          .json({
            success: true,
            message: 'Transaction Successful',
            token: generateAccessToken(req.user.id, undefined, true)
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
