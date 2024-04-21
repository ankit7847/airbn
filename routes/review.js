const express = require("express");
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Listing = require("../models/listing.js");
const Review =require("../models/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middlewires.js");



//Review
// post Route
router.post("/", isLoggedIn, validateReview, wrapAsync (async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
   newReview.author = req.user._id;
    listing.review.push(newReview);
  
    await newReview.save();
    await listing.save();
  
    console.log("new review saved");
    req.flash("success", " Review added");
    res.send("review was saved");
    
  }));
  
  // Review
  // Delete Route
  router.delete("/:reviewsId", isLoggedIn,isReviewAuthor, wrapAsync(async (req, res) => {
    let { id, reviewsId} = req.params;
    await Listing.findByIdAndUpdate(id,{ $pull: {reviews: reviewsId}});
   await Review.findByIdAndDelete(reviewsId);
   req.flash("success", " review deleted");
    res.redirect(`/listings/${id}`);
  }));

  module.exports = router;