import mongoose from 'mongoose';

const paymentLinkSchema = new mongoose.Schema({
  name: String,
  description: String,
  amount: Number,
  currency: {
    type: String,
    default: 'USD'
  },
  stripeLink: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('PaymentLink', paymentLinkSchema);
