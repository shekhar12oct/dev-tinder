// Logic to connect to our database
// npm package used : mongoose

const mongoose = require('mongoose');

// create a sync function to connect to mongodb cluster

const connectDB = async () => {
  await mongoose.connect(process.env.DB_CONNECTION_SECRET);
};

module.exports = {
  connectDB,
};
