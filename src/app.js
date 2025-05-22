// Entry point of the dev-tinder backend application

// Require express to create a server
const express = require('express');

// Importing db connection file
const { connectDB } = require('./config/database');

// Instance of the express
const app = express();

// importing cookie parser library
const cookieParser = require('cookie-parser');

// built-in middleware in Express for parsing incoming requests with JSON payload
app.use(express.json());

// built-in middleware in Express for parsing incoming requests with cookies parsing
app.use(cookieParser());

// importing the different router
const { authRouter } = require('./routes/auth');
const { profileRouter } = require('./routes/profile');
const { requestRouter } = require('./routes/request');
const { userRouter } = require('./routes/user');

// Define the port
const port = 3000;

connectDB()
  .then(() => {
    // First connect to the database
    console.log('Database connected successfully...');

    // Then listen the express server
    app.listen(port, () => {
      console.log('Express server started at ... :', port);
    });
  })
  .catch((err) => {
    console.log('Database connect failed');
  });

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
