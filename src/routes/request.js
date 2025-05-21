// Manage the routes specific to the connection requests

const express = require('express');
const requestRouter = express.Router();
const User = require('../models/user');

module.exports = {
  requestRouter,
};
