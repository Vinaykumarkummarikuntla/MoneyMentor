const express = require('express')

const router = express.Router()

const chartController = require('../controllers/chart')

const userAuthentication = require('../middleware/auth')

// download report
router.get('/chart',userAuthentication.authenticate, chartController.getExpenseByCategory)


module.exports = router;