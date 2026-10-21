
const express = require("express");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.get("/me", authenticateToken, (req, res) => {
  res.json({
    message: "Profile retrieved successfully.",
    user: req.user,
  });
});

module.exports = router;
