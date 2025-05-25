// Manage the routes specific to the authentication

const express = require('express');
const authRouter = express.Router();
const { validateSignUpData } = require('../utils/validation');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const validator = require('validator');

// Post api for /signup
authRouter.post('/signup', async (req, res) => {
  try {
    // Validation of data
    validateSignUpData(req);

    // Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    // create a new user model Instance
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    const savedUser = await user.save();
    const token = await savedUser.getJWT();
    res.json({ message: 'User Added Successfully!', data: savedUser });
  } catch (err) {
    res.status(400).send('Error:' + err.message);
  }
});

// Post api for /login
authRouter.post('/login', async (req, res) => {
  try {
    const { emailId, password } = req.body;

    // Check validations of emailId
    if (!validator.isEmail(emailId)) {
      throw new Error('Email is not valid!');
    }

    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      throw new Error('Invalid credentials!');
    }

    // Check for password validation
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      // Create a token
      const token = await user.getJWT();

      // Add the token to cookie and send back to user along with response
      res.cookie('token', token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send(user);
    } else {
      throw new Error('Invalid credentials!');
    }
  } catch (err) {
    res.status(400).send(err?.message ?? 'Something went wrong');
  }
});

// Post api for /logout
authRouter.post('/logout', async (req, res) => {
  try {
    res.cookie('token', null, {
      expires: new Date(Date.now()),
    });
    res.send('User logout successfully');
  } catch (error) {
    res.status(400).send('Error:' + err.message);
  }
});

module.exports = {
  authRouter,
};
