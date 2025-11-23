const {validateReview, isLoggedIn, isAuthor} = require("../middleware.js");
const {listingSchema, reviewSchema} = require("../Schema.js")
const Review = require("../models/review");
const Listing = require("../models/listing");

const wrapAsync = require("../utils/wrapAsync");

// create review for a listing
module.exports.createReview = wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id) 
   
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "Successfully created a new review!");
    res.redirect(`/listings/${listing._id}`);
});

// delete a review

module.exports.deleteReview = wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    
    // Check if listing exists
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "The listing does not exist!");
        return res.redirect("/listings");
    }
    
    // Remove review from listing and delete the review
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted a review!");
    res.redirect(`/listings/${id}`);
});


