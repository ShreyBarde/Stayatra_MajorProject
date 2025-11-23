const express = require('express');
const router = express.Router({ mergeParams: true });
const Listing = require("../models/listing");
const wrapAsync = require('../utils/wrapAsync.js')
const {listingSchema, reviewSchema} = require("../Schema.js")

const ExpressError = require("../utils/ExpressError.js");
const {validateReview, isLoggedIn, isAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


// create review for a listing
router.post(
    "/:id/reviews",  isLoggedIn, validateReview, 
    reviewController.createReview
);

// delete a review
router.delete("/:id/reviews/:reviewId", isLoggedIn,isAuthor, 
   wrapAsync(reviewController.deleteReview ));

module.exports = router;