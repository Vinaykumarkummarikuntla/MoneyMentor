const express = require('express')

const router = express.Router()

const downloadController = require('../controllers/downloadreport')

const userAuthentication = require('../middleware/auth')

// download report
router.get('/downloadreport', userAuthentication.authenticate, downloadController.downloadreport)

router.get('/getalldownloadedreports', userAuthentication.authenticate, downloadController.showallreports)

module.exports = router
