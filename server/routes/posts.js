const router = require("express").Router();
const { verifyToken } = require("../controllers/auth");

router.get("/", verifyToken, (req, res) => {
  res.json({ msg: "This is the random data" });
});

module.exports = router;
