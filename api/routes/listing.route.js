const express = require("express");
const router = express.Router();
const {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
} = require("../controllers/listing.controller");
const { verifyToken } = require("../utils/verifyUser");

router.post("/create", verifyToken, createListing);
router.delete("/delete/:id", verifyToken, deleteListing);
router.get("/get/:id", verifyToken, getListing);
router.get("/get/", getListings);
router.post("/update/:id", verifyToken, updateListing);

module.exports = router;
