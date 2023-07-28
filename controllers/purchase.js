require('dotenv').config()
const logger = require('../middleware/logger')
const Razorpay = require('razorpay')
const Order = require('../models/ordermodel')
const jwt = require('jsonwebtoken')

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
    rzp.orders.create({ amount, currency: 'INR' }, async(err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err))
      }

      try {
        // Create a new order in the database
        const newOrder = await Order.create({
          orderid: order.id,
          status: 'PENDING',
          // signupId: req.user.id // Assuming the user ID is available in req.user.id
        });

        return res.status(201).json({ order, key_id: rzp.key_id });
      } catch (err) {
        logger.error('An error occurred:', err);
        throw new Error(err);
      }
    });
  } catch (err) {
    logger.error('An error occurred:', err);
    res.status(403).json({ message: 'Something went wrong', error: err });
  }
};


//       req.user
//         .createOrder({
//           orderid: order.id,
//           status: 'PENDING'
//         })
//         .then(() => {
//           return res.status(201).json({ order, key_id: rzp.key_id })
//         })
//         .catch((err) => {
//           logger.error('An error occurred:', err)
//           throw new Error(err)
//         })
//     })
//   } catch (err) {
//     logger.error('An error occurred:', err)
//     res.status(403).json({ message: 'Something went wrong', error: err })
//   }
// }

// TODO Update transaction details
// exports.updatetransactionstatus = async (req, res, next) => {
//   try {
//     const { payment_id, order_id } = req.body
//     const order = await Order.findOne({ where: { orderid: order_id } })
//     // console.log("payment_id id is ",payment_id)
//     const promise1 = order.update({
//       paymentid: payment_id,
//       status: 'SUCCESSFUL'
//     })
//     console.log('backenduser', req.user.id)
//     // const promise2 = order.update({ ispremiumuser: true });
//     const promise2 = req.user.update({ ispremiumuser: true })
//     Promise.all([promise1, promise2])
//       .then(() => {
//         return res
//           .status(202).json({
//             success: true,
//             message: 'Transaction Successful',
//             token: generateAccessToken(req.user.id, undefined, true)
//           })
//       })
//       .catch((error) => {
//         throw new Error(error)
//       })
//   } catch (err) {
//     logger.error('An error occurred:', err)
//     // console.log(err)
//     res.status(403).json({ error: err, message: 'Something went wrong' })
//   }
// }


exports.updatetransactionstatus = async (req, res, next) => {
  try {
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ orderid: order_id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const promises = [];

    // Update the order document with payment_id and status
    order.paymentid = payment_id;
    order.status = 'SUCCESSFUL';
    promises.push(order.save());

    // Update the user document to mark as a premium user
    req.user.ispremiumuser = true;
    promises.push(req.user.save());

    // Wait for both promises to resolve
    await Promise.all(promises);

    // Generate a new token with updated user details
    const token = generateAccessToken(req.user.id, req.user.email, true);

    return res.status(202).json({
      success: true,
      message: 'Transaction Successful',
      token: token
    });
  } catch (err) {
    logger.error('An error occurred:', err);
    res.status(403).json({ error: err, message: 'Something went wrong' });
  }
};