const { model } = require("mongoose");
const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    // console.log(allListings);
    res.render("listings/index.ejs", { allListings });
  }

  module.exports.renderNewForm = (req, res) => {
   
    res.render("listings/new.ejs");
  };

  module.exports.showlisting = (async(req, res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path :"review",populate: {path: "author"},
  })
  .populate("owner");
    if(!listing){
      req.flash("error","Listing you request  for does not exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  });

  module.exports.createListing = async(req,res,next)=>{

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner =req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success", "new listing Create !");
    res.redirect("/listings");
  };

  module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","Listing you request  for does not exist"); 
      res.redirect("/listings");
    }
    req.flash("success", " listing updated !");
    let origialImageUrl = listing.image.url;
    origialImageUrl= origialImageUrl.replace("/uplode","uplode/h_300,w_250")

    res.render("listings/edit.ejs", { listing,origialImageUrl });
  };

  module.exports.renderUpdateForm = async (req, res) => {
    let { id } = req.params;
    const Listing = await Listing.findById(id);
    if( listing.owner.equals(res.locals.currUser._id)){
      req.flash("error", "You don't have permission to edit ")
     return res.redirect(`/listings/${id}`);
    }
   let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
if( typeof req.file !=="undefined") {



   let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await newListing.save();
  }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
  };

  module.exports.renderDeleteForm = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", " listing Deleted !");
    console.log(deletedListing);
    res.redirect("/listings");
  };
