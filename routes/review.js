const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Listing = require("../models/listing.js");
const Review =require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middlewires.js");
const { createReview } = require("../controller/review.js");
const reviewController = require("../controller/review.js");
const review = require("../models/review.js");


//Review
// post Route
router.post("/", isLoggedIn, validateReview, wrapAsync (reviewController.createReview));
  
  // Review
  // Delete Route
  router.delete("/:reviewsId", isLoggedIn,isReviewAuthor, wrapAsync(reviewController.deleteReview));

  module.exports = router;