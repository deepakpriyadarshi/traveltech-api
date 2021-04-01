const express = require("express");
const router = express.Router();

const { verifyUserToken } = require("../../utils/helpers");

const { registerUser, authenticateUser, getDetails } = require("./user.controller");

router.post("/registerUser", registerUser);
router.post("/authenticateUser", authenticateUser);

router.post("/getDetails", verifyUserToken, getDetails);

module.exports = router;
