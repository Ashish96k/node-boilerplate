const router = require("express").Router();
const { registerUser, loginUser } = require("../controllers/auth");

// Register a new user
router.post("/register", registerUser);

// Login registered user
router.post("/login", loginUser);

module.exports = router;
