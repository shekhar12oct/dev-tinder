// Manage the routes specific to the profile

const express = require('express');
const profileRouter = express.Router();
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');

// get api for profile
profileRouter.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error('User does not exist!');
    }
    res.json(req.user);
  } catch (err) {
    res.status(400).send('Error:' + err.message);
  }
});

module.exports = {
  profileRouter,
};
