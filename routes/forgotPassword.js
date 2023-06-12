const express = require('express');

const router = express.Router();

const forgotPasswordController = require("../controllers/forgotPassword");


router.post("/password/forgotpassword",forgotPasswordController.forgotpassword)

module.exports = router;