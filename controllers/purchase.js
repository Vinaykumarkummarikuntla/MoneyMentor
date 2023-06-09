const Razorpay = require("razorpay");
const Order = require("../models/ordermodel");
// const userController = require("../controllers/login");
const jwt = require("jsonwebtoken");



// generate a token
// secret key generated from ours linux-terminal 
function generateAccessToken(id,mail,isPremiumUser){
  return jwt.sign({userId: id, mail: mail,isPremiumUser},'OM43lvuJhjSc74Wk9KGdKq33QQu7uojMhAyprCt1Mo5JKqjFJ2IdrQDgEm8omL2vN4hDglXFwNroOezKVBK+gg==')
}




exports.purchasePremium = async (req, res) => {
  try {
    
    // key = "",
    // secret_key = ""
    key = "rzp_test_qCdIUw1swZbWqs",  
    secret_key = "1GsSdXLUt3jALzFQmMER1iKm"

    const rzp = new Razorpay({
      key_id: key,
      key_secret: secret_key,
    });

    const amount = 500;

    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }

      req.user
        .createOrder({
          orderid: order.id,
          status: "PENDING",
        })
        .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch((err) => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

exports.updatetransactionstatus = async (req, res, next) => {
  try {
    const { payment_id, order_id } = req.body;
    const order = await Order.findOne({ where: { orderid: order_id } });
    // console.log("payment_id id is ",payment_id)
    const promise1 = order.update({
      paymentid: payment_id,
      status: "SUCCESSFUL",
    }); 
    console.log("backenduser",req.user.id)
    // const promise2 = order.update({ ispremiumuser: true }); 
    const promise2 = req.user.update({ ispremiumuser: true });
    // redisClient.set('isPremiumUser:' + req.user.id, true);

    

    Promise.all([promise1, promise2])
      .then(() => {
       
      return res.status(202).json({success: true, message: "Transaction Successful", token: generateAccessToken(req.user.id, undefined , true)}); 
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: err, message: "Something went wrong" });
  }
};
