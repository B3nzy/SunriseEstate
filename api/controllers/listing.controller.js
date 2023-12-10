const Listing = require("../models/listing.model");
const { findById } = require("../models/user.model");
const errorHandler = require("../utils/error");

const createListing = async (req, res, next) => {
  try {
    const listingData = new Listing({
      ...req.body,
      userRef: req.user.id,
    });
    const listing = await listingData.save();
    res.status(201).json({
      success: true,
      listing,
    });
  } catch (err) {
    next(err);
  }
};

const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    } else if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, "You can only delete your own listings!"));
    }
    const deletedListingData = await Listing.findByIdAndDelete(req.params.id);
    res.status(201).json({
      success: true,
      message: "Listing has been deleted!",
      // deletedListingData,
    });
  } catch (err) {
    next(err);
  }
};

const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    console.log(listing);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    } else if (req.user.id !== listing.userRef.toString()) {
      return next(errorHandler(401, "You can only delete your own listings!"));
    } else {
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            ...req.body,
            userRef: req.user.id,
          },
        },
        { new: true }
      );
      res.status(200).json({
        success: true,
        updatedListing,
      });
    }
  } catch (err) {
    next(err);
  }
};

const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }
    res.status(200).json({
      success: true,
      listing,
    });
  } catch (err) {
    next(err);
  }
};

const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;

    console.log(req.query);

    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === "false") {
      offer = { $in: [true, false] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [true, false] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [true, false] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";

    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({
        [sort]: order,
      })
      .limit(limit)
      .skip(startIndex);

    if (!listings) {
      return next(errorHandler(404, "Listings not found!"));
    }
    res.status(200).json({
      success: true,
      listings,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createListing,
  deleteListing,
  updateListing,
  getListing,
  getListings,
};
