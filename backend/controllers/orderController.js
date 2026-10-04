const mongoose = require('mongoose');
const Order = require('../models/Order');

/**
 * Helper to normalize MongoDB order document for frontend compatibility
 */
const formatOrder = (doc) => {
  if (!doc) return null;
  const o = doc.toObject ? doc.toObject({ virtuals: true }) : doc;
  return {
    ...o,
    id: o.orderId || o.id,
    items: o.products || o.items,
    totalAmount: o.total !== undefined ? o.total : o.totalAmount,
    status: o.orderStatus || o.status,
    paymentStatus: o.paymentStatus || 'Pending',
    isPaid: o.paymentStatus === 'PAID',
    paidAt: o.paidAt || null,
    razorpayPaymentId: o.razorpayPaymentId || '',
    razorpayOrderId: o.razorpayOrderId || ''
  };
};

/**
 * @desc   Get all orders from MongoDB (with optional status or email filter)
 * @route  GET /api/orders
 * @access Public / Admin
 */
exports.getOrders = async (req, res, next) => {
  try {
    const { status, email } = req.query;
    const filter = {};

    if (status) {
      filter.orderStatus = new RegExp(`^${status.trim()}$`, 'i');
    }

    if (email) {
      filter['customer.email'] = new RegExp(email.trim(), 'i');
    }

    const rawOrders = await Order.find(filter).sort({ createdAt: -1 });
    const formatted = rawOrders.map(formatOrder);

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
 * @desc   Get single order by ID from MongoDB
 * @route  GET /api/orders/:id
 * @access Public / Customer / Admin
 */
exports.getOrderById = async (req, res, next) => {
  try {
    const id = req.params.id;
    let query = { orderId: new RegExp(`^${id}$`, 'i') };

    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ orderId: new RegExp(`^${id}$`, 'i') }, { _id: id }] };
    }

    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID '${id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      data: formatOrder(order)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Create a new order in MongoDB
 * @route  POST /api/orders
 * @access Public
 */
exports.createOrder = async (req, res, next) => {
  try {
    const { customer, items, products, totalAmount, total, paymentMethod } = req.body;

    if (!customer || !customer.fullName || !customer.phone) {
      return res.status(400).json({
        success: false,
        message: 'Customer information (fullName, phone) is required'
      });
    }

    const rawProducts = products || items;
    if (!rawProducts || !Array.isArray(rawProducts) || rawProducts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    const orderId = req.body.orderId || req.body.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalTotal = total !== undefined ? Number(total) : (totalAmount !== undefined ? Number(totalAmount) : 0);

    const formattedProducts = rawProducts.map((item) => ({
      productId: item.productId || item.id || '',
      name: item.name || 'Aquarium Specimen',
      price: Number(item.price) || 0,
      quantity: Math.max(1, Number(item.quantity) || 1),
      image: item.image || 'images/koi-kohaku.jpg'
    }));

    const totalQty = formattedProducts.reduce((sum, it) => sum + it.quantity, 0);

    const newOrder = await Order.create({
      orderId: orderId,
      userId: req.user ? req.user._id : (req.body.userId || null),
      customer: {
        fullName: customer.fullName.trim(),
        phone: customer.phone.trim(),
        email: customer.email ? customer.email.trim() : '',
        address: customer.address ? customer.address.trim() : '',
        city: customer.city ? customer.city.trim() : '',
        state: customer.state ? customer.state.trim() : '',
        pincode: customer.pincode ? customer.pincode.trim() : '',
        notes: customer.notes ? customer.notes.trim() : ''
      },
      products: formattedProducts,
      quantities: totalQty,
      subtotal: req.body.subtotal !== undefined ? Number(req.body.subtotal) : finalTotal,
      deliveryCharge: req.body.deliveryCharge !== undefined ? Number(req.body.deliveryCharge) : 0,
      discount: req.body.discount !== undefined ? Number(req.body.discount) : 0,
      total: finalTotal,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      orderStatus: req.body.orderStatus || req.body.status || 'Pending',
      estimatedDelivery: req.body.estimatedDelivery || '24 to 48 Hours'
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully in MongoDB',
      data: formatOrder(newOrder)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Update an existing order in MongoDB
 * @route  PUT /api/orders/:id
 * @access Public / Admin
 */
exports.updateOrder = async (req, res, next) => {
  try {
    const id = req.params.id;
    let query = { orderId: new RegExp(`^${id}$`, 'i') };

    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { $or: [{ orderId: new RegExp(`^${id}$`, 'i') }, { _id: id }] };
    }

    const order = await Order.findOne(query);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order with ID '${id}' not found`
      });
    }

    // Map status if provided
    const newStatus = req.body.orderStatus || req.body.status;
    if (newStatus) {
      const validStatuses = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];
      const match = validStatuses.find((s) => s.toLowerCase() === newStatus.toLowerCase());
      if (match) {
        order.orderStatus = match;
      }
    }

    if (req.body.deliveryCharge !== undefined) order.deliveryCharge = Number(req.body.deliveryCharge);
    if (req.body.discount !== undefined) order.discount = Number(req.body.discount);
    if (req.body.total !== undefined) order.total = Number(req.body.total);
    if (req.body.totalAmount !== undefined) order.total = Number(req.body.totalAmount);
    if (req.body.paymentMethod !== undefined) order.paymentMethod = req.body.paymentMethod;
    if (req.body.estimatedDelivery !== undefined) order.estimatedDelivery = req.body.estimatedDelivery;

    if (req.body.customer) {
      order.customer = { ...order.customer, ...req.body.customer };
    }

    const updated = await order.save();

    res.status(200).json({
      success: true,
      message: 'Order updated successfully in MongoDB',
      data: formatOrder(updated)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Get logged-in user's orders
 * @route  GET /api/orders/my-orders
 * @access Private (Customer / Admin)
 */
exports.getMyOrders = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const orders = await Order.find({
      $or: [
        { userId: req.user._id },
        { 'customer.email': req.user.email.toLowerCase() }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders.map(formatOrder)
    });
  } catch (err) {
    next(err);
  }
};

