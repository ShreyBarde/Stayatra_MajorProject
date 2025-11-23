const mongoose = require('mongoose');
const Listing = require('../models/listing');
const Review = require('../models/review');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/Stayatra';
const id = process.argv[2] || '690f23ed02bd87a4353b44b4';

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to DB');
  const listing = await Listing.findById(id);
  if (!listing) {
      const count = await Listing.countDocuments();
      console.log('No listing found for id', id);
      console.log('Total listings in DB:', count);
      if (count > 0) {
        const some = await Listing.find({}).limit(10).select('_id title').lean();
        console.log('Sample listings (first 10):', JSON.stringify(some, null, 2));
      }
      process.exit(0);
  }
  console.log('Listing object (raw):');
  console.log(JSON.stringify(listing.toObject(), null, 2));

  const reviewIds = listing.reviews || [];
  console.log('Listing.reviews array (length):', reviewIds.length);
  if (reviewIds.length === 0) {
    console.log('No review ids referenced on the listing.');
    process.exit(0);
  }

  const reviews = await Review.find({ _id: { $in: reviewIds } });
  console.log('Found reviews documents (count):', reviews.length);
  console.log(JSON.stringify(reviews.map(r => r.toObject()), null, 2));
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
