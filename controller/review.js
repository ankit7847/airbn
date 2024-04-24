const Listing = require( "../models/listing");
const Review = require("../models/review");

module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
   newReview.author = req.user._id;
    listing.review.push(newReview);
  
    await newReview.save();
    await listing.save();
  
    console.log("new review saved");
    req.flash("success", " Review added");
    res.send("review was saved");
    
  }

  module.exports.deleteReview = async (req, res) => {
    let { id, reviewsId} = req.params;
    await Listing.findByIdAndUpdate(id,{ $pull: {reviews: reviewsId}});
   await Review.findByIdAndDelete(reviewsId);
   req.flash("success", " review deleted");
    res.redirect(`/listings/${id}`);
  }