// middleware.js - contains middleware functions for authentication and redirect URL handling
const Listing = require("./models/listing");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./Schema.js")
const Review = require("./models/review");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // save the URL they were trying to access
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You must be signed in to access this page!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate("owner");
  
  // Check if listing exists
  if (!listing) {
    req.flash("error", "The listing does not exist!");
    return res.redirect("/listings");
  }
  
  // Check if current user is the owner (owner is an array)
  if (!Array.isArray(listing.owner) || !listing.owner.some(o => o._id.equals(req.user._id))) {
    req.flash("error", "You are not authorized to perform this action!");
    return res.redirect(`/listings/${id}`);
  }
  
  next();
});

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error)
    }
    else{
        next();
    }
     
}

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error)
    }
    else{
        next();
    }
     
}


module.exports.isAuthor = wrapAsync(async (req, res, next) => {
  const { id, reviewId } = req.params;  // Need to get 'id' from params
  const review = await Review.findById(reviewId).populate("author");
  
  // Check if review exists
  if (!review) {
    req.flash("error", "Review not found!");
    return res.redirect(`/listings/${id}`);
  }

  // Check if user is authenticated and is the author
  if (!req.user || !review.author || !review.author._id.equals(req.user._id)) {
    req.flash("error", "You are not authorized to perform this action!");
    return res.redirect(`/listings/${id}`);
  }
  
  next();
});