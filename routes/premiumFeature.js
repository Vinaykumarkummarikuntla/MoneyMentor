const express = require('express')

const router = express.Router()

const premiumFeatureController = require('../controllers/premiumFeature')

const premiumFeatureredisController = require('../controllers/redisleaderboard')

const userAuthentication = require('../middleware/auth')

// leaderboard
router.get('/premium/showleaderboard', userAuthentication.authenticate, premiumFeatureController.showleaderboard)

// router.get('/premium/showleaderboard', userAuthentication.authenticate, premiumFeatureredisController.showLeaderboard)

module.exports = router
