//this file is used to initialize the database with some data
const mongoose = require("mongoose");
const initData = require("./data.js"); // sample data to initialize the database
const Listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/Stayatra";

async function main(params) {
     await mongoose.connect(MONGO_URL);
}

main().then(() =>{
   console.log("Connected to db")
})
.catch((err) => {
    console.log(err);
});


const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
  ...obj,
  owner: new mongoose.Types.ObjectId("690f1f2def4a8c37b603bae1")
}));

   await Listing.insertMany(initData.data);
    console.log("Data was initialized.");
}

initDB();