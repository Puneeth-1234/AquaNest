const mongoose = require('mongoose');
const Product = require('../models/Product');

/**
 * Helper to normalize MongoDB product document for frontend compatibility
 */
const formatProduct = (doc) => {
  if (!doc) return null;
  const p = doc.toObject ? doc.toObject({ virtuals: true }) : doc;
  return {
    ...p,
    id: p.productId || p.id,
    oldPrice: p.originalPrice !== undefined ? p.originalPrice : p.oldPrice,
    fullDescription: p.description !== undefined ? p.description : p.fullDescription
  };
};

/**
 * @desc   Get all products from MongoDB (with optional filtering)
 * @route  GET /api/products
 * @access Public
 */
exports.getProducts = async (req, res, next) => {
  try {
    const { category, search, inStock } = req.query;
    const filter = {};

    if (category) {
      const catRegex = new RegExp(category.trim(), 'i');
      filter.$or = [{ category: catRegex }, { categorySlug: catRegex }];
    }

    if (search) {
      const qRegex = new RegExp(search.trim(), 'i');
      const searchConditions = [
        { name: qRegex },
        { shortDescription: qRegex },
        { productId: qRegex }
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    if (inStock !== undefined) {
      const stockFlag = inStock === 'true' || inStock === '1';
      if (stockFlag) {
        filter.stock = { $gt: 0 };
      } else {
        filter.stock = { $lte: 0 };
      }
    }

    const rawProducts = await Product.find(filter).sort({ createdAt: -1 });
    const formatted = rawProducts.map(formatProduct);

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Get single product by ID from MongoDB
 * @route  GET /api/products/:id
 * @access Public
 */
exports.getProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let query = { productId: id };

    // Also check by MongoDB ObjectId if valid format
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ productId: id }, { _id: id }] };
    }

    const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      data: formatProduct(product)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Create a new product in MongoDB
 * @route  POST /api/products
 * @access Public (Admin)
 */
exports.createProduct = async (req, res, next) => {
  try {
    const { name, category, price } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Product name is required'
      });
    }

    if (price === undefined || isNaN(Number(price))) {
      return res.status(400).json({
        success: false,
        message: 'A valid numeric price is required'
      });
    }

    let productId = req.body.productId || req.body.id;
    if (!productId || productId.trim() === '') {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      productId = `${slug}-${Date.now().toString(36)}`;
    }

    const existing = await Product.findOne({ productId: productId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Product with ID '${productId}' already exists`
      });
    }

    const newProduct = await Product.create({
      productId: productId,
      name: name.trim(),
      category: category || 'General Fish',
      categorySlug: req.body.categorySlug || (category ? category.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'general'),
      price: Number(price),
      originalPrice: req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : (req.body.oldPrice !== undefined ? Number(req.body.oldPrice) : Number(price)),
      stock: req.body.stock !== undefined ? Number(req.body.stock) : 10,
      rating: req.body.rating !== undefined ? Number(req.body.rating) : 5.0,
      reviewsCount: req.body.reviewsCount !== undefined ? Number(req.body.reviewsCount) : 0,
      isTrending: Boolean(req.body.isTrending),
      isBestSeller: Boolean(req.body.isBestSeller),
      isSpecialOffer: Boolean(req.body.isSpecialOffer),
      discountBadge: req.body.discountBadge || '',
      image: req.body.image || 'images/koi-kohaku.jpg',
      fallbackColor: req.body.fallbackColor || '#00d2ff',
      shortDescription: req.body.shortDescription || '',
      description: req.body.description || req.body.fullDescription || '',
      tankSize: req.body.tankSize || req.body.specs?.minTankSize || '20+ Gallons',
      waterTemperature: req.body.waterTemperature || req.body.specs?.temperature || '24°C – 28°C',
      phRange: req.body.phRange || req.body.specs?.phRange || '6.8 – 7.5',
      careLevel: req.body.careLevel || req.body.specs?.careLevel || 'Beginner',
      diet: req.body.diet || req.body.specs?.diet || 'Omnivorous',
      expectedSize: req.body.expectedSize || req.body.specs?.adultSize || '2 – 3 inches',
      lifespan: req.body.lifespan || req.body.specs?.lifespan || '3 – 5 Years',
      specs: req.body.specs || {}
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully in MongoDB',
      data: formatProduct(newProduct)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Update an existing product in MongoDB
 * @route  PUT /api/products/:id
 * @access Public (Admin)
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    let query = { productId: id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ productId: id }, { _id: id }] };
    }

    const product = await Product.findOne(query);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found`
      });
    }

    // Map legacy field names if provided
    if (req.body.name !== undefined) product.name = req.body.name;
    if (req.body.category !== undefined) product.category = req.body.category;
    if (req.body.categorySlug !== undefined) product.categorySlug = req.body.categorySlug;
    if (req.body.price !== undefined) product.price = Number(req.body.price);
    if (req.body.originalPrice !== undefined) product.originalPrice = Number(req.body.originalPrice);
    if (req.body.oldPrice !== undefined) product.originalPrice = Number(req.body.oldPrice);
    if (req.body.stock !== undefined) product.stock = Number(req.body.stock);
    if (req.body.rating !== undefined) product.rating = Number(req.body.rating);
    if (req.body.reviewsCount !== undefined) product.reviewsCount = Number(req.body.reviewsCount);
    if (req.body.image !== undefined) product.image = req.body.image;
    if (req.body.shortDescription !== undefined) product.shortDescription = req.body.shortDescription;
    if (req.body.description !== undefined) product.description = req.body.description;
    if (req.body.fullDescription !== undefined) product.description = req.body.fullDescription;
    if (req.body.tankSize !== undefined) product.tankSize = req.body.tankSize;
    if (req.body.waterTemperature !== undefined) product.waterTemperature = req.body.waterTemperature;
    if (req.body.phRange !== undefined) product.phRange = req.body.phRange;
    if (req.body.careLevel !== undefined) product.careLevel = req.body.careLevel;
    if (req.body.diet !== undefined) product.diet = req.body.diet;
    if (req.body.expectedSize !== undefined) product.expectedSize = req.body.expectedSize;
    if (req.body.lifespan !== undefined) product.lifespan = req.body.lifespan;
    if (req.body.isTrending !== undefined) product.isTrending = Boolean(req.body.isTrending);
    if (req.body.isBestSeller !== undefined) product.isBestSeller = Boolean(req.body.isBestSeller);
    if (req.body.isSpecialOffer !== undefined) product.isSpecialOffer = Boolean(req.body.isSpecialOffer);
    if (req.body.discountBadge !== undefined) product.discountBadge = req.body.discountBadge;
    if (req.body.specs) {
      product.specs = { ...product.specs, ...req.body.specs };
    }

    const updated = await product.save();

    res.status(200).json({
      success: true,
      message: 'Product updated successfully in MongoDB',
      data: formatProduct(updated)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Delete a product from MongoDB
 * @route  DELETE /api/products/:id
 * @access Public (Admin)
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    let query = { productId: id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ productId: id }, { _id: id }] };
    }

    const deleted = await Product.findOneAndDelete(query);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully from MongoDB',
      deletedId: deleted.productId
    });
  } catch (err) {
    next(err);
  }
};
