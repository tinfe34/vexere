const express = require("express");
const router = express.Router();
const { postBranch } = require("../controllers/branch");

router.post("/branch", postBranch);

module.exports = router;
