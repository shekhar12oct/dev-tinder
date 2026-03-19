// Initializing razorpay instance

require('dotenv').config();


const Razorpay = require('razorpay');
const hasRazorpayConfig =
  Boolean(process.env.RAZORPAY_KEY_ID) &&
  Boolean(process.env.RAZORPAY_KEY_SECRET);

const instance = hasRazorpayConfig
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

module.exports = {
  razorpayInstance: instance,
  hasRazorpayConfig,
};
