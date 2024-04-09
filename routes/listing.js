const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../Schema.js");
const Listing = require("../models/listing.js");

const validateListing = (req,res,next)=>{
    let {error }= listingSchema.validate(req.body);  
    
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
     throw new ExpressError(400,errMsg);
    } else{
      next();
    }
  };

  //New Route
  router.get("/new", (req, res) => {
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
  const listing = await Listing.findById(id).populate("review");
  if(!listing){
    req.flash("error","Listing you request  for does not exist");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
}));

//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
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
  router.put("/:id", validateListing, wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    
    res.redirect(`/listings/${id}`);
  }));
  
  //Delete Route
  router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", " listing Deleted !");
    console.log(deletedListing);
    res.redirect("/listings");
  }));
 
//create route
  router.post("/", validateListing,
wrapAsync(async(req,res,next)=>{

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "new listing Create !");
    res.redirect("/listings")
  })
);
module.exports = router;