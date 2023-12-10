const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  google,
  signout,
} = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get("/signout", signout);

module.exports = router;
