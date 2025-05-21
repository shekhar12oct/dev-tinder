const mongoose = require('mongoose');

const validator = require('validator');

const jwt = require('jsonwebtoken');

const bcrypt = require('bcrypt');

// create a user schema
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true,
      trim: true,
      vaildate(value) {
        if (!validator.isEmail) {
          throw new Error('Invalid Email Address');
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
    },
    photoUrl: {
      type: String,
    },
    about: {
      type: String,
      default: 'This is a default about the user!',
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

userSchema.method.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, 'Test@2025', {
    expiresIn: '7d',
  });
  return token;
};

userSchema.method.validatePassword = async function (inputPassword) {
  const user = this;
  const passwordHash = user.password;

  const isPasswordValid = await bcrypt.compare(inputPassword, passwordHash);

  return isPasswordValid;
};

// Once schema is created we can create a mongoose modal
const User = mongoose.model('User', userSchema);

// export the user model
module.exports = User;
