//this file defines the Review model that represents reviews for listings
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: String,
    rating:{
        type: Number, min: 1, max: 5
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
         type: Date, 
         default: Date.now()
    },
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Review", reviewSchema);