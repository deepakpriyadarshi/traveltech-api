const express = require("express");
const router = express.Router();

const { verifyUserToken } = require("../../utils/helpers");

const { registerUser, getDetails } = require("./user.controller");

router.post("/registerUser", registerUser);

router.post("/getDetails", verifyUserToken, getDetails);

module.exports = router;
