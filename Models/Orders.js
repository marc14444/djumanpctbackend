import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  artisan: { type: mongoose.Schema.Types.ObjectId, ref: 'Artisan', required: true },
  publication: { type: mongoose.Schema.Types.ObjectId, ref: 'Publications', required: true },
  items: [{
    product: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
