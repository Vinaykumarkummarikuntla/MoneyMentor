const express = require('express');

const router = express.Router();

const purchaseController = require("../controllers/purchase");

const userAuthentication = require("../middleware/auth");

// const Order = require("../models/ordermodel");


router.get("/buypremiumship",userAuthentication.authenticate,purchaseController.purchasePremium);
router.post("/updatetransactionstatus",userAuthentication.authenticate,purchaseController.updatetransactionstatus);

module.exports = router;