const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    image: {
      type: String,
      default: 'images/koi-kohaku.jpg'
    }
  },
  { _id: false }
);

const customerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Customer full name is required'],
      trim: true
    },
    phone: {
      type: String,
      required: [true, 'Customer phone number is required'],
      trim: true
    },
    email: {
      type: String,
      trim: true,
      default: ''
    },
    address: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    pincode: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: [true, 'Order ID is required'],
      unique: true,
      trim: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    customer: {
      type: customerSchema,
      required: [true, 'Customer details are required']
    },
    products: {
      type: [orderItemSchema],
      required: [true, 'Order must contain products'],
      validate: [
        (val) => Array.isArray(val) && val.length > 0,
        'Order must contain at least one item'
      ]
    },
    quantities: {
      type: Number,
      default: function () {
        if (!this.products) return 0;
        return this.products.reduce((sum, item) => sum + (item.quantity || 1), 0);
      }
    },
    subtotal: {
      type: Number,
      default: 0
    },
    deliveryCharge: {
      type: Number,
      default: 0
    },
    discount: {
      type: Number,
      default: 0
    },
    total: {
      type: Number,
      required: [true, 'Order total is required'],
      min: [0, 'Total cannot be negative']
    },
    paymentMethod: {
      type: String,
      default: 'Razorpay'
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'PAID', 'Failed', 'Refunded'],
      default: 'Pending',
      index: true
    },
    razorpayOrderId: {
      type: String,
      default: '',
      index: true
    },
    razorpayPaymentId: {
      type: String,
      default: ''
    },
    razorpaySignature: {
      type: String,
      default: ''
    },
    paidAt: {
      type: Date,
      default: null
    },
    paymentFailureReason: {
      type: String,
      default: ''
    },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    estimatedDelivery: {
      type: String,
      default: '24 to 48 Hours'
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.orderId;
        ret.items = ret.products;
        ret.totalAmount = ret.total;
        ret.status = ret.orderStatus;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// Virtual id property
orderSchema.virtual('id').get(function () {
  return this.orderId;
});

module.exports = mongoose.model('Order', orderSchema);
