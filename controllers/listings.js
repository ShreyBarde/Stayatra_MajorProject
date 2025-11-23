const Listing = require("../models/listing");
const { isLoggedIn, isOwner, validateReview, validateListing } = require("../middleware.js"); 
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError.js");

// Function to handle the index route
module.exports.index = wrapAsync(async (req,res) =>{
   const allListings =  await Listing.find({});
    // render expects a view name relative to the `views` directory and without a leading slash
    res.render("listings/index", { allListings });
   
});

//function to handle new routes 

module.exports.renderNewForm = wrapAsync(async (req,res) =>{
    
    res.render("listings/new.ejs");
})

// Function to handle the create route
module.exports.createListing = wrapAsync(async (req,res,next) =>{
       if (!req.file) {
        throw new ExpressError(400, "Image upload failed!");
    }
      const { path: url, filename } = req.file;
    console.log(url, "....", filename);
    

    const listing = new Listing(req.body.listing)
    // attach the currently logged-in user as the owner
   
        // ensure owner is stored as an array of user ids (backwards compatible)
        listing.owner = [req.user._id];
        listing.image = { url,filename };

    
    await listing.save();
        req.flash("success", "Successfully created a new listing!");
       return res.redirect(`/listings/${listing._id}`);  // Only one response
     
    
});

// Function to handle the edit route
module.exports.renderEditForm = wrapAsync(async (req,res) =>{
     const { id } = req.params;
    const listing = await Listing.findById(id).populate("owner");
    if(!listing){
        req.flash("error", "The listing does not exist!");
        return res.redirect("/listings");
    }
    // Guard against null/undefined image
    let originalImageUrl = "";
    if (listing.image && listing.image.url) {
        originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    }
    res.render("listings/edit", { listing, originalImageUrl });   
});

// Function to handle the update route
module.exports.updateListing = wrapAsync(async (req,res) =>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    const { id } = req.params;

   let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if (typeof req.file !== "undefined") {

   let url = req.file.path;
   let filename = req.file.filename;
    console.log(url, "....", filename);
    listing.image = { url,filename };
    await listing.save();  
    } 
    req.flash("success", "Successfully updated the listing!");
    
    res.redirect(`/listings/${id}`);
});

// Function to handle the delete route
module.exports.destroyListing = wrapAsync(async (req,res) =>{
   const { id } = req.params;
   
   await Listing.findByIdAndDelete(id);
   req.flash("success", "deleted a listing!");
   res.redirect("/listings");
});

// Function to handle the show route
module.exports.showListing = wrapAsync(async (req,res) =>{
    const listing = await Listing.findById(req.params.id)
    .populate({
                    path: "reviews",
                    populate: {
                        path: "author",
                    
                    }
                })
                .populate("owner"); 
    
    if(!listing){
        req.flash("error", "The listing does not exist!");
        return res.redirect("/listings");
    }
    
    res.render("listings/show", { listing });
})
