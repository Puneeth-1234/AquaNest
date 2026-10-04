const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, 'Product ID is required'],
      unique: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true
    },
    categorySlug: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be greater than or equal to 0']
    },
    originalPrice: {
      type: Number,
      default: function () {
        return this.price;
      }
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative']
    },
    rating: {
      type: Number,
      default: 5.0,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    reviewsCount: {
      type: Number,
      default: 0
    },
    isTrending: {
      type: Boolean,
      default: false
    },
    isBestSeller: {
      type: Boolean,
      default: false
    },
    isSpecialOffer: {
      type: Boolean,
      default: false
    },
    discountBadge: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      default: 'images/koi-kohaku.jpg'
    },
    fallbackColor: {
      type: String,
      default: '#00d2ff'
    },
    shortDescription: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    tankSize: {
      type: String,
      default: '20+ Gallons'
    },
    waterTemperature: {
      type: String,
      default: '24°C – 28°C'
    },
    phRange: {
      type: String,
      default: '6.8 – 7.5'
    },
    careLevel: {
      type: String,
      default: 'Beginner'
    },
    diet: {
      type: String,
      default: 'Omnivorous'
    },
    expectedSize: {
      type: String,
      default: '2 – 3 inches'
    },
    lifespan: {
      type: String,
      default: '3 – 5 Years'
    },
    specs: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret.productId;
        ret.oldPrice = ret.originalPrice;
        ret.fullDescription = ret.description;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// Virtual id property
productSchema.virtual('id').get(function () {
  return this.productId;
});

module.exports = mongoose.model('Product', productSchema);
