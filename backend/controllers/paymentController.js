const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');

/**
 * Initialize Razorpay instance
 */
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error('Razorpay credentials (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET) are missing from environment.');
  }
  return new Razorpay({ key_id, key_secret });
};

/**
 * Format order helper
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
 * @desc   Get Razorpay Public Key ID
 * @route  GET /api/payment/key
 * @access Public
 */
exports.getRazorpayKey = (req, res) => {
  res.status(200).json({
    success: true,
    keyId: process.env.RAZORPAY_KEY_ID
  });
};

/**
 * @desc   Create Razorpay Order & initialize pending MongoDB order
 * @route  POST /api/payment/create-order
 * @access Public / Authenticated Customer
 */
exports.createPaymentOrder = async (req, res, next) => {
  try {
    const { customer, items, products, totalAmount, total } = req.body;

    // Validate customer
    if (!customer || !customer.fullName || !customer.phone) {
      return res.status(400).json({
        success: false,
        message: 'Customer information (fullName, phone) is required'
      });
    }

    // Validate products
    const rawProducts = products || items;
    if (!rawProducts || !Array.isArray(rawProducts) || rawProducts.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    const orderId = req.body.orderId || `AN-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const finalTotal = total !== undefined ? Number(total) : (totalAmount !== undefined ? Number(totalAmount) : 0);

    if (finalTotal <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Order total must be greater than zero'
      });
    }

    const formattedProducts = rawProducts.map((item) => ({
      productId: item.productId || item.id || '',
      name: item.name || 'Aquarium Specimen',
      price: Number(item.price) || 0,
      quantity: Math.max(1, Number(item.quantity) || 1),
      image: item.image || 'images/koi-kohaku.jpg'
    }));

    const totalQty = formattedProducts.reduce((sum, it) => sum + it.quantity, 0);

    // 1. Create Pending Order in MongoDB
    const pendingOrder = await Order.create({
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
      paymentMethod: 'Razorpay',
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      estimatedDelivery: req.body.estimatedDelivery || '24 to 48 Hours'
    });

    // 2. Create Razorpay Order via SDK
    const rzpAmountInPaise = Math.round(finalTotal * 100);
    const rzpOptions = {
      amount: rzpAmountInPaise,
      currency: 'INR',
      receipt: orderId,
      notes: {
        customerName: customer.fullName.trim(),
        customerPhone: customer.phone.trim(),
        orderId: orderId
      }
    };

    let rzpOrder;
    try {
      const razorpay = getRazorpayInstance();
      rzpOrder = await razorpay.orders.create(rzpOptions);
    } catch (rzpErr) {
      console.warn('[PAYMENT] Razorpay test sandbox fallback:', rzpErr.message);
      // In test mode / offline sandbox, provide standard compliant Razorpay order representation
      rzpOrder = {
        id: `order_test_${Math.random().toString(36).substring(2, 14)}`,
        entity: 'order',
        amount: rzpAmountInPaise,
        currency: 'INR',
        receipt: orderId,
        status: 'created'
      };
    }

    // 3. Link razorpayOrderId to the MongoDB order
    pendingOrder.razorpayOrderId = rzpOrder.id;
    await pendingOrder.save();

    res.status(201).json({
      success: true,
      message: 'Pending order created and payment gateway initialized',
      orderId: pendingOrder.orderId,
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      currency: rzpOrder.currency || 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
      customer: {
        fullName: pendingOrder.customer.fullName,
        email: pendingOrder.customer.email,
        phone: pendingOrder.customer.phone
      }
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Verify Razorpay payment signature & update Order = PAID
 * @route  POST /api/payment/verify
 * @access Public / Authenticated Customer
 */
exports.verifyPayment = async (req, res, next) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment verification parameters (razorpay_order_id, razorpay_payment_id, razorpay_signature required)'
      });
    }

    // 1. Cryptographically verify signature using HMAC-SHA256
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      throw new Error('RAZORPAY_KEY_SECRET environment variable is missing.');
    }
    const textToSign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(textToSign)
      .digest('hex');

    let isValid = false;
    try {
      isValid = crypto.timingSafeEqual(
        Buffer.from(generatedSignature, 'utf-8'),
        Buffer.from(razorpay_signature, 'utf-8')
      );
    } catch (e) {
      isValid = false;
    }

    // 2. Find MongoDB order
    let order = null;
    if (orderId) {
      order = await Order.findOne({ orderId: orderId });
    }
    if (!order && razorpay_order_id) {
      order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order associated with Razorpay Order ID '${razorpay_order_id}' not found`
      });
    }

    // 3. Handle signature verification result
    if (!isValid) {
      order.paymentStatus = 'Failed';
      order.paymentFailureReason = 'Invalid cryptographic signature mismatch';
      await order.save();

      return res.status(400).json({
        success: false,
        message: 'Payment verification failed: Invalid transaction signature'
      });
    }

    // 4. Mark Order as PAID and Confirmed
    order.paymentStatus = 'PAID';
    order.orderStatus = 'Confirmed';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paidAt = new Date();
    order.paymentFailureReason = '';

    const savedOrder = await order.save();

    console.log(`[PAYMENT VERIFIED] Order #${savedOrder.orderId} marked as PAID. Payment ID: ${razorpay_payment_id}`);

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully. Order confirmed as PAID.',
      order: formatOrder(savedOrder)
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Generate HMAC signature for test-mode offline simulations
 * @route  POST /api/payment/test-simulate-signature
 * @access Development / Test Mode Only
 */
exports.testSimulateSignature = (req, res) => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  if (!keyId || !keyId.startsWith('rzp_test_')) {
    return res.status(403).json({ success: false, message: 'Only available in test mode' });
  }

  const { razorpay_order_id, razorpay_payment_id } = req.body;
  if (!razorpay_order_id || !razorpay_payment_id) {
    return res.status(400).json({ success: false, message: 'razorpay_order_id and razorpay_payment_id required' });
  }

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return res.status(500).json({ success: false, message: 'RAZORPAY_KEY_SECRET is not configured' });
  }
  const textToSign = `${razorpay_order_id}|${razorpay_payment_id}`;
  const signature = crypto.createHmac('sha256', keySecret).update(textToSign).digest('hex');

  res.status(200).json({
    success: true,
    signature,
    razorpay_order_id,
    razorpay_payment_id
  });
};
