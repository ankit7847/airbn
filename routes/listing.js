const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middlewires.js");



  //New Route
  router.get("/new", isLoggedIn, (req, res) => {
   
    res.render("listings/new.ejs");
  });

  //Index Route
  router.get("/", async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", { allListings });
  });



//Show Route
router.get("/:id",wrapAsync (async(req, res,next) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path :"review",populate: {path: "author"},
})
.populate("owner");
  if(!listing){
    req.flash("error","Listing you request  for does not exist");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
}));

//Edit Route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you request  for does not exist"); 
      res.redirect("/listings");
    }
    req.flash("success", " listing updated !");
    res.render("listings/edit.ejs", { listing });
  }));
  
  //Update Route
  router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if( listing.owner.equals(res.locals.currUser._id)){
      req.flash("error", "You don't have permission to edit ")
     return res.redirect(`/listings/${id}`);
    }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
  }));
  
  //Delete Route
  router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", " listing Deleted !");
    console.log(deletedListing);
    res.redirect("/listings");
  }));
 
//create route
  router.post("/", validateListing,isLoggedIn,
wrapAsync(async(req,res,next)=>{

    const newListing = new Listing(req.body.listing);
    newListing.owner =req.user._id;
    await newListing.save();
    req.flash("success", "new listing Create !");
    res.redirect("/listings")
  })
);
module.exports = router;