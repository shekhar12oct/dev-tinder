// Logic to connect to our database
// npm package used : mongoose

const mongoose = require('mongoose');

// create a sync function to connect to mongodb cluster

const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://sd12oct:dMX373vCYqOo7l0G@nodecuster.mbgyn9p.mongodb.net/'
  );
};

module.exports = {
  connectDB,
};
