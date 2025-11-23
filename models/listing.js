//models folder used to store Mongoose models means it contains the data structure definitions for the application

//this file defines the Listing model with references to Review and User models
const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review");
const listingSchema = new Schema({
    title: {
        type: String,
        set: (v) => v.trim(),
        required: true
    },
    description: String,
    image: {
       url: String,
       filename: String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
             ref: "Review"
        },
        ],

    owner:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        ],
    categories : {
        type: [String],
        enum: ['Farm', 'Trending', 'Cities', 'Beach', 'Mountain', 'Surfing', 'Pools', 'Work', 'Arctic', 'Amazing View']
    }

});
// mongoose middleware
listingSchema.post("findOneAndDelete", async (listing)=>{
    if(listing){
   await Review.deleteMany({_id: {$in: listing.reviews} } );
    }
});   

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;