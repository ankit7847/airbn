const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middlewires.js");
const listingController = require("../controller/listing.js");



  //New Route
  router.get("/new",  isLoggedIn,listingController.renderNewForm);

  //Index Route
  router.get("/", wrapAsync(listingController.index));



//Show Route
router.get("/:id",wrapAsync(listingController.showlisting) );

//Edit Route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
  
  //Update Route
  router.put("/:id",isLoggedIn,isOwner, validateListing, wrapAsync(listingController.renderUpdateForm));
  
  //Delete Route
  router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.renderDeleteForm));
 
//create route
  router.post("/", validateListing,isLoggedIn,
wrapAsync(listingController.createListing)
);
module.exports = router;