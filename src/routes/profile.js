// Manage the routes specific to the profile

const express = require('express');
const profileRouter = express.Router();
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');

// Get api for /profile
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

// Patch api for /profile/edit
profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error('Invalid edit request');
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName} your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send('Error:' + err.message);
  }
});

module.exports = {
  profileRouter,
};
