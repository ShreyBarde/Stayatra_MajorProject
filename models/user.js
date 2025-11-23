//init folder contains files to initialize the database with sample data

//this file defines the User model that uses passport-local-mongoose for authentication
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email:{
    type: String,
    required: true,
  }
});

userSchema.plugin(passportLocalMongoose); // adds username, hash and salt fields and methods for authentication

module.exports = mongoose.model("User", userSchema);
