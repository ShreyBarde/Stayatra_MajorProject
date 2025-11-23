const mongoose = require('mongoose');
const Listing = require('../models/listing');
const Review = require('../models/review');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/Stayatra';
const id = process.argv[2] || '6910bd8fb8acfbe5a0f62751'; // sample listing id found earlier

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to DB');
  const listing = await Listing.findById(id);
  if (!listing) {
    console.error('No listing found for id', id);
    process.exit(1);
  }

  const newReview = new Review({ rating: 4, comment: 'Automated test review' });
  await newReview.save();
  listing.reviews.push(newReview._id);
  await listing.save();
  console.log('Created review', newReview._id, 'and pushed to listing', id);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
