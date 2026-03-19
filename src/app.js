// Entry point of the dev-tinder backend application

// Require express to create a server
const express = require('express');

// Importing db connection file
const { connectDB } = require('./config/database');

// Instance of the express
const app = express();

// importing cookie parser library
const cookieParser = require('cookie-parser');

// cors

const cors = require('cors');
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

require('dotenv').config();

// built-in middleware in Express for parsing incoming requests with JSON payload
app.use(express.json());

// built-in middleware in Express for parsing incoming requests with cookies parsing
app.use(cookieParser());

// importing the different router
const { authRouter } = require('./routes/auth');
const { profileRouter } = require('./routes/profile');
const { requestRouter } = require('./routes/request');
const { userRouter } = require('./routes/user');
const { paymentRouter } = require('./routes/payment');

// Define the port
const port = process.env.PORT || 7777;

app.listen(port, () => {
  console.log('Express server started at ... :', port);
});

connectDB()
  .then(() => {
    console.log('Database connected successfully...');
  })
  .catch(() => {
    console.log('Database connect failed');
  });

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);
app.use('/', paymentRouter);
