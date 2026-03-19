const express = require('express');
const paymentRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const { razorpayInstance, hasRazorpayConfig } = require('../utils/razorpay');
const Payment = require('../models/payment');
const { membershipAmount } = require('../utils/constant');
const {
  validateWebhookSignature,
} = require('razorpay/dist/utils/razorpay-utils');
const User = require('../models/user');

paymentRouter.post('/payment/create', userAuth, async (req, res) => {
  try {
    if (!hasRazorpayConfig || !razorpayInstance) {
      return res.status(503).json({
        msg: 'Payment service is unavailable. Configure Razorpay keys in environment variables.',
      });
    }

    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipAmount[membershipType] * 100,
      currency: 'INR',
      receipt: 'receipt#1',
      partial_payment: false,
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType: membershipType,
      },
    });

    // save it to my database
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savePayment = await payment.save();

    // return back my order details to front-end
    res.json({ ...savePayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    return res
      .status(500)
      .json({ msg: err?.message ?? 'something went wrong' });
  }
});

paymentRouter.post('/payment/webhook', async (req, res) => {
  try {
    if (!process.env.RAZORPAY_WEBHOOK_SECRET) {
      return res.status(503).json({
        msg: 'Payment webhook is unavailable. Configure RAZORPAY_WEBHOOK_SECRET.',
      });
    }

    const webhookSignature = req.get('X-Razorpay-Signature');
    const isWebHookValid = validateWebhookSignature(
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );
    if (!isWebHookValid) {
      return res.status(400).send({ msg: 'Webhook signature is invalid' });
    }

    // update my payment in db
    const paymentDetails = req.body.payload.payment.entity;

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status;

    await payment.save();

    const user = await User.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.membershipType = payment.notes.membershipType;

    await user.save();

    if (req.body.event === 'payment.captured') {
    }
    if (req.body.event === 'payment.failed') {
    }
    // return success response to razorpay
    return res.status(200).json({ msg: 'Webhook Received Successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: err?.message ?? 'something went wrong' });
  }
});

paymentRouter.get('/premium/verify', userAuth, async (req, res) => {
  const user = req.user.toJSON();
  if (user.isPremium) {
    return res.json({ ...user });
  }
  return res.json({ ...user });
});

module.exports = { paymentRouter };
