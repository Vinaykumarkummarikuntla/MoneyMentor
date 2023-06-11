const express = require('express')

const router = express.Router()

const premiumFeatureController = require('../controllers/premiumFeature')

const userAuthentication = require('../middleware/auth')

// leaderboard
router.get('/premium/showleaderboard', userAuthentication.authenticate, premiumFeatureController.showleaderboard)

module.exports = router
