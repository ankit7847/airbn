const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middlewires.js");
const listingController = require("../controller/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ dest: storage});


router.route("/").get( wrapAsync(listingController.index))
.post( isLoggedIn, upload.single("Listing[image]"),validateListing,
wrapAsync(listingController.createListing)
);
//New Route
router.get("/new",  isLoggedIn,listingController.renderNewForm);
  



router.route("/:id").get(wrapAsync(listingController.showlisting) )
.put(isLoggedIn,isOwner, validateListing, wrapAsync(listingController.renderUpdateForm))
  .delete(isLoggedIn,isOwner, wrapAsync(listingController.renderDeleteForm));
  
//Edit Route
router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
   

module.exports = router;