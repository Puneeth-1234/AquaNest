const crypto = require('crypto');
require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const BASE_URL = 'http://localhost:5000/api';
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
if (!KEY_SECRET) {
  console.error('ERROR: RAZORPAY_KEY_SECRET is not configured in environment.');
  process.exit(1);
}

async function runStage6Tests() {
  console.log('====================================================');
  console.log('    STAGE 6: PAYMENT GATEWAY & VERIFICATION TESTS    ');
  console.log('====================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition, testName, extra = '') {
    total++;
    if (condition) {
      console.log(`[PASS] ${testName} ${extra}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName} ${extra}`);
    }
  }

  // 1. Health check
  try {
    const res = await fetch(`${BASE_URL}/health`);
    const data = await res.json();
    assert(res.ok && data.success === true, '1. Backend Health Check', `(${data.message})`);
  } catch (e) {
    assert(false, '1. Backend Health Check', `(${e.message})`);
  }

  // 2. Razorpay Public Key Endpoint
  try {
    const res = await fetch(`${BASE_URL}/payment/key`);
    const data = await res.json();
    assert(res.ok && data.keyId && data.keyId.startsWith('rzp_test_'), '2. GET /api/payment/key', `Key: ${data.keyId}`);
  } catch (e) {
    assert(false, '2. GET /api/payment/key', `(${e.message})`);
  }

  // 3. Customer -> Checkout -> Create Pending Order & Initialize Gateway
  let pendingOrderId = null;
  let razorpayOrderId = null;
  const mockOrderPayload = {
    orderId: `AN-2026-${Math.floor(100000 + Math.random() * 900000)}`,
    customer: {
      fullName: 'Vikram Malhotra',
      phone: '9876543210',
      email: 'vikram.m@example.com',
      address: 'Plot 45, Lotus Boulevard',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      notes: 'Please pack with extra thermal bubble insulation'
    },
    items: [
      {
        productId: 'koi-kohaku',
        name: 'Grand Champion Kohaku Koi',
        price: 1850,
        quantity: 1,
        image: 'images/koi-kohaku.jpg'
      },
      {
        productId: 'tetra-neon',
        name: 'Neon Tetra School (Pack of 10)',
        price: 499,
        quantity: 2,
        image: 'images/tetra-neon.jpg'
      }
    ],
    subtotal: 2848,
    deliveryCharge: 0,
    discount: 0,
    total: 2848,
    paymentMethod: 'Razorpay'
  };

  try {
    const res = await fetch(`${BASE_URL}/payment/create-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockOrderPayload)
    });
    const data = await res.json();
    pendingOrderId = data.orderId;
    razorpayOrderId = data.razorpayOrderId;

    assert(
      res.status === 201 && data.success && data.orderId && data.razorpayOrderId && data.amount === 284800,
      '3. POST /api/payment/create-order creates Pending Order + Razorpay Order',
      `Order: ${data.orderId}, RZP Order: ${data.razorpayOrderId}, Amount: ₹${data.amount / 100}`
    );
  } catch (e) {
    assert(false, '3. POST /api/payment/create-order', `(${e.message})`);
  }

  // 4. Verify Payment with Tampered / Invalid Signature (Security Verification)
  try {
    const fakePaymentId = `pay_${Math.random().toString(36).substring(2, 14)}`;
    const tamperedSignature = 'badf00d_invalid_hmac_signature_998877';

    const res = await fetch(`${BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: pendingOrderId,
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: fakePaymentId,
        razorpay_signature: tamperedSignature
      })
    });
    const data = await res.json();

    assert(
      res.status === 400 && data.success === false,
      '4. POST /api/payment/verify rejects tampered cryptographic signature with 400 Bad Request',
      `Status: ${res.status}, Reason: "${data.message}"`
    );
  } catch (e) {
    assert(false, '4. Security signature tampering check', `(${e.message})`);
  }

  // 5. Payment Gateway -> Cryptographic Verification on Backend -> Verified Payment -> Order = PAID
  const validPaymentId = `pay_test_${Math.random().toString(36).substring(2, 14)}`;
  const textToSign = `${razorpayOrderId}|${validPaymentId}`;
  const validSignature = crypto.createHmac('sha256', KEY_SECRET).update(textToSign).digest('hex');

  let verifiedOrder = null;
  try {
    const res = await fetch(`${BASE_URL}/payment/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId: pendingOrderId,
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: validPaymentId,
        razorpay_signature: validSignature
      })
    });
    const data = await res.json();
    verifiedOrder = data.order;

    assert(
      res.status === 200 &&
      data.success === true &&
      data.order.paymentStatus === 'PAID' &&
      data.order.orderStatus === 'Confirmed' &&
      data.order.razorpayPaymentId === validPaymentId &&
      data.order.paidAt,
      '5. POST /api/payment/verify accepts valid HMAC signature -> Order = PAID & Confirmed',
      `Payment ID: ${validPaymentId}, Status: ${data.order?.paymentStatus}, Paid At: ${data.order?.paidAt}`
    );
  } catch (e) {
    assert(false, '5. Valid payment verification', `(${e.message})`);
  }

  // 6. Admin sees Paid Order in /api/orders (Requires Admin JWT Token)
  try {
    // 6a. Admin Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@aquanest.com', password: 'Admin@123456' })
    });
    const loginData = await loginRes.json();
    const adminToken = loginData.token;

    // 6b. Admin GET /api/orders
    const res = await fetch(`${BASE_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Accept': 'application/json'
      }
    });
    const data = await res.json();
    const found = data.data?.find(o => o.orderId === pendingOrderId || o.id === pendingOrderId);

    assert(
      res.ok && found && found.paymentStatus === 'PAID' && found.razorpayPaymentId === validPaymentId,
      '6. Admin GET /api/orders reflects Order as PAID with Gateway Transaction Reference',
      `Found Order #${found?.orderId}, paymentStatus="${found?.paymentStatus}", total=₹${found?.totalAmount}`
    );
  } catch (e) {
    assert(false, '6. Admin orders reflection', `(${e.message})`);
  }

  // 7. Cash on Delivery (COD) flow remains intact as alternative option
  try {
    const codPayload = {
      orderId: `AN-2026-${Math.floor(100000 + Math.random() * 900000)}`,
      customer: {
        fullName: 'Anita Sen',
        phone: '9812345678',
        email: 'anita@example.com',
        address: '12 Rose Lane',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      products: [
        { productId: 'betta-halfmoon-blue', name: 'Royal Blue Halfmoon Betta', price: 420, quantity: 1 }
      ],
      total: 420,
      paymentMethod: 'Cash on Delivery'
    };

    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(codPayload)
    });
    const data = await res.json();

    assert(
      res.status === 201 && data.success && data.data.paymentMethod === 'Cash on Delivery' && data.data.paymentStatus === 'Pending',
      '7. Cash on Delivery checkout creates order with paymentStatus="Pending"',
      `Order: ${data.data?.orderId}, Method: ${data.data?.paymentMethod}`
    );
  } catch (e) {
    assert(false, '7. COD flow check', `(${e.message})`);
  }

  console.log('\n====================================================');
  console.log(` RESULTS: ${passed} / ${total} TESTS PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('====================================================\n');

  if (passed === total) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runStage6Tests().catch(err => {
  console.error('Test execution fatal error:', err);
  process.exit(1);
});
