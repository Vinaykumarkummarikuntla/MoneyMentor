const path = require('path')

const express = require('express')

const router = express.Router()

const expenseController = require('../controllers/expense')

const userAuthentication = require('../middleware/auth')

const expense = require('../models/expensemodel')

// expense details storing
router.post('/expensedetails', userAuthentication.authenticate, expenseController.expense)

// router.get("/expensedetails",expenseController.getexpense);
router.get('/expensedetails', userAuthentication.authenticate, expenseController.getexpense)
// page number
// router.get('/expensedetails', userAuthentication.authenticate, expenseController.getexpense)

// expense details deleted
router.delete('/deleteexpense/:expenseid', userAuthentication.authenticate, expenseController.deleteexpense)

module.exports = router
