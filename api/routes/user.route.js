const express = require("express");
const { verifyToken } = require("../utils/verifyUser");
const router = express.Router();
const {
  updateUser,
  deleteUser,
  getUserListing,
  getUser,
} = require("../controllers/user.controller");

router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListing);
router.get("/:id", verifyToken, getUser);

module.exports = router;
