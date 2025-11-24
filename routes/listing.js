const express = require('express');
const router = express.Router();
const Listing = require("../models/listing");
const User = require("../models/user");
const fs = require('fs');
const path = require('path');
const wrapAsync = require('../utils/wrapAsync.js')
const author = require('../middleware.js')
const Review = require("../models/review");
const { isLoggedIn, isOwner, validateReview, validateListing } = require("../middleware.js");   
const listingController = require('../controllers/listings.js')

const multer  = require('multer')
const { storage } = require("../cloudconfig.js");
const upload = multer({ storage });


//new route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
            isLoggedIn,
             upload.single("listing[image]"),
             validateListing,
             listingController.createListing
        );
    
    


//create route
router
    .route("/new")
    .get(
        isLoggedIn, 
     listingController.renderNewForm
    )

//edit route
router.get(
    "/:id/edit",  isLoggedIn, isOwner,
    wrapAsync(listingController.renderEditForm)
);

//update delete and show route, uses router.route()  method to combine all route with same endpoint
router.route("/:id")
.put(
    isLoggedIn, isOwner, 
     upload.single("listing[image]"),validateListing,
   wrapAsync(listingController.updateListing))
.delete(
   isLoggedIn, isOwner,
   wrapAsync(listingController.destroyListing))
.get(
    
    listingController.showListing
);

router.route("/filter/:category")
.get(wrapAsync(listingController.filterByCategory));

module.exports = router;
