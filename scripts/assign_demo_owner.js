const mongoose = require('mongoose');
const User = require('../models/user');
const Listing = require('../models/listing');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/Stayatra';

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log('Connected to DB');

  // find or create a demo owner
  let demo = await User.findOne({ username: 'demo-owner' });
  if (!demo) {
    console.log('Creating demo-owner user');
    demo = new User({ username: 'demo-owner', email: 'demo-owner@example.com' });
    // Use register if passport-local-mongoose is used, but here we'll save raw user if register isn't available
    if (typeof User.register === 'function') {
      await User.register(demo, 'demopassword');
    } else {
      await demo.save();
    }
  } else {
    console.log('Found demo user:', demo._id);
  }

  // Find listings with empty owner array or owner ids that don't reference existing users
  const listings = await Listing.find().lean();
  let updated = 0;
  for (const l of listings) {
    let need = false;
    if (!l.owner || l.owner.length === 0) {
      need = true;
    } else {
      // verify at least one owner id maps to a user
      const owners = Array.isArray(l.owner) ? l.owner : [l.owner];
      const count = await User.countDocuments({ _id: { $in: owners } });
      if (count === 0) need = true;
    }
    if (need) {
      await Listing.findByIdAndUpdate(l._id, { owner: [demo._id] });
      updated++;
    }
  }

  console.log('Updated listings count:', updated);
  process.exit(0);
}

main().catch(err => { console.error(err); process.exit(1); });
