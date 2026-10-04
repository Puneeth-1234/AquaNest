/**
 * Comprehensive AquaNest E2E API & Integration Verification Test
 */
const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const reqOptions = {
      method: options.method || 'GET',
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(options.token ? { 'Authorization': `Bearer ${options.token}` } : {}),
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('========================================================');
  console.log('       AQUANEST END-TO-END REGRESSION VERIFICATION     ');
  console.log('========================================================\n');

  // Obtain Admin Token for protected admin operations
  const adminLoginRes = await request('/auth/login', {
    method: 'POST',
    body: { email: 'admin@aquanest.com', password: 'Admin@123456' }
  });
  const adminToken = adminLoginRes.data?.token;

  const results = {
    healthCheck: false,
    productsApi: false,
    productDetailsApi: false,
    adminProductCrud: false,
    checkoutToMongoOrder: false,
    adminOrdersList: false,
    orderStatusUpdate: false,
    consoleErrors: 0
  };

  try {
    // 1. Health Check
    console.log('[1/7] Testing Health Check endpoint (/api/health)...');
    const healthRes = await request('/health');
    if (healthRes.status === 200 && healthRes.data?.success === true) {
      console.log('   PASS: Health Check returned 200 OK:', healthRes.data.message);
      results.healthCheck = true;
    } else {
      console.error('   FAIL: Health check failed:', healthRes);
      results.consoleErrors++;
    }

    // 2. Products API (Shop / Catalog)
    console.log('\n[2/7] Testing Product Catalog API (/api/products)...');
    const productsRes = await request('/products');
    if (productsRes.status === 200 && Array.isArray(productsRes.data?.data) && productsRes.data.data.length >= 20) {
      const pCount = productsRes.data.data.length;
      console.log(`   PASS: Successfully loaded ${pCount} species from MongoDB.`);
      const first = productsRes.data.data[0];
      console.log(`   Sample species: "${first.name}" (ID: ${first.id || first.productId}, Category: ${first.category}, Price: Rs. ${first.price}, Stock: ${first.stock})`);
      results.productsApi = true;
    } else {
      console.error('   FAIL: Products listing failed or returned < 20 products:', productsRes);
      results.consoleErrors++;
    }

    // 3. Product Details API (/api/products/:id)
    console.log('\n[3/7] Testing Product Details API (/api/products/koi-kohaku)...');
    const detailRes = await request('/products/koi-kohaku');
    if (detailRes.status === 200 && detailRes.data?.data) {
      const p = detailRes.data.data;
      const hasCare = p.specs?.careLevel || p.careLevel;
      const hasTank = p.specs?.minTankSize || p.tankSize;
      const hasTemp = p.specs?.temperature || p.waterTemperature;
      const hasPh = p.specs?.phRange || p.phRange;
      const hasDiet = p.specs?.diet || p.diet;

      console.log(`   PASS: Product "${p.name}" retrieved successfully.`);
      console.log(`   Attributes verified:`);
      console.log(`     - Care Level: ${p.specs?.careLevel || p.careLevel}`);
      console.log(`     - Tank Size: ${p.specs?.minTankSize || p.tankSize}`);
      console.log(`     - Water Temp: ${p.specs?.temperature || p.waterTemperature}`);
      console.log(`     - pH Range: ${p.specs?.phRange || p.phRange}`);
      console.log(`     - Diet: ${p.specs?.diet || p.diet}`);
      console.log(`     - Rating: ${p.rating} (${p.reviewsCount} reviews)`);

      if (hasCare && hasTank && hasTemp && hasPh && hasDiet) {
        results.productDetailsApi = true;
      } else {
        console.error('   FAIL: Missing some aquarium care specifications.');
        results.consoleErrors++;
      }
    } else {
      console.error('   FAIL: Product details request failed:', detailRes);
      results.consoleErrors++;
    }

    // 4. Admin Product CRUD
    console.log('\n[4/7] Testing Admin Product CRUD Operations...');
    const testProductPayload = {
      productId: 'test-blue-neon-tetra',
      name: 'Test Electric Blue Neon Tetra',
      category: 'Tetra',
      categorySlug: 'tetra',
      price: 180,
      originalPrice: 240,
      stock: 50,
      rating: 4.9,
      image: 'images/tetra-neon.jpg',
      shortDescription: 'Specially quarantined neon tetra for testing.',
      description: 'Full description for testing admin CRUD operations in MongoDB.',
      tankSize: '15+ Gallons',
      waterTemperature: '22C - 26C',
      phRange: '6.0 - 7.0',
      careLevel: 'Easy',
      diet: 'Flakes & Micro Pellets',
      expectedSize: '1.2 inches',
      lifespan: '3 - 5 Years'
    };

    // CREATE
    console.log('   (a) Creating test product via POST /api/products...');
    const createRes = await request('/products', { method: 'POST', body: testProductPayload, token: adminToken });
    if (createRes.status === 201 && createRes.data?.success) {
      console.log('       PASS: Created test product in MongoDB.');
      
      // UPDATE
      console.log('   (b) Updating price & stock via PUT /api/products/test-blue-neon-tetra...');
      const updateRes = await request('/products/test-blue-neon-tetra', {
        method: 'PUT',
        token: adminToken,
        body: { price: 195, stock: 45, shortDescription: 'Updated test description' }
      });
      if (updateRes.status === 200 && updateRes.data?.data?.price === 195) {
        console.log('       PASS: Updated test product in MongoDB. New price:', updateRes.data.data.price);

        // DELETE
        console.log('   (c) Deleting test product via DELETE /api/products/test-blue-neon-tetra...');
        const deleteRes = await request('/products/test-blue-neon-tetra', { method: 'DELETE', token: adminToken });
        if (deleteRes.status === 200 && deleteRes.data?.success) {
          console.log('       PASS: Deleted test product from MongoDB.');
          results.adminProductCrud = true;
        } else {
          console.error('       FAIL: Delete product failed:', deleteRes);
          results.consoleErrors++;
        }
      } else {
        console.error('       FAIL: Update product failed:', updateRes);
        results.consoleErrors++;
      }
    } else {
      console.error('       FAIL: Create product failed:', createRes);
      results.consoleErrors++;
    }

    // 5. Checkout -> MongoDB Order
    console.log('\n[5/7] Testing Checkout -> MongoDB Order Placement (POST /api/orders)...');
    const sampleOrderPayload = {
      orderId: 'AQN-' + Math.floor(100000 + Math.random() * 900000),
      customer: {
        fullName: 'Dr. Arjun Verma',
        phone: '9876543210',
        email: 'arjun.verma@example.com',
        address: '42 Marine Drive, Aqua Bay',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400020'
      },
      products: [
        {
          productId: 'koi-kohaku',
          name: 'Kohaku Japanese Koi',
          price: 1499,
          quantity: 2,
          subtotal: 2998,
          image: 'images/koi-kohaku.jpg'
        }
      ],
      subtotal: 2998,
      deliveryCharge: 0,
      discount: 0,
      total: 2998,
      paymentMethod: 'cod',
      orderStatus: 'Pending',
      createdAt: new Date().toISOString()
    };

    const orderRes = await request('/orders', { method: 'POST', body: sampleOrderPayload });
    let createdOrderId = null;
    if (orderRes.status === 201 && orderRes.data?.success) {
      createdOrderId = orderRes.data.data.orderId;
      console.log(`   PASS: Successfully placed order #${createdOrderId} to MongoDB.`);
      console.log(`   Customer: ${orderRes.data.data.customer?.fullName}, Total: Rs. ${orderRes.data.data.total}`);
      results.checkoutToMongoOrder = true;
    } else {
      console.error('   FAIL: Order placement failed:', orderRes);
      results.consoleErrors++;
    }

    // 6. Admin Orders List
    console.log('\n[6/7] Testing Admin Orders Retrieval (GET /api/orders)...');
    const ordersListRes = await request('/orders', { token: adminToken });
    if (ordersListRes.status === 200 && Array.isArray(ordersListRes.data?.data)) {
      const orders = ordersListRes.data.data;
      const foundOrder = orders.find(o => o.orderId === createdOrderId);
      console.log(`   PASS: Admin retrieved ${orders.length} orders from MongoDB.`);
      if (foundOrder) {
        console.log(`   Verified presence of newly placed order #${foundOrder.orderId} (Status: ${foundOrder.orderStatus || foundOrder.status})`);
        results.adminOrdersList = true;
      } else {
        console.error(`   FAIL: Placed order #${createdOrderId} not found in admin orders list.`);
        results.consoleErrors++;
      }
    } else {
      console.error('   FAIL: Orders retrieval failed:', ordersListRes);
      results.consoleErrors++;
    }

    // 7. Order Status Update
    if (createdOrderId) {
      console.log(`\n[7/7] Testing Order Status Update (PUT /api/orders/${createdOrderId})...`);
      const statusUpdateRes = await request(`/orders/${encodeURIComponent(createdOrderId)}`, {
        method: 'PUT',
        token: adminToken,
        body: { orderStatus: 'Confirmed', status: 'Confirmed' }
      });

      if (statusUpdateRes.status === 200 && statusUpdateRes.data?.success) {
        const updatedStatus = statusUpdateRes.data.data?.orderStatus || statusUpdateRes.data.data?.status;
        console.log(`   PASS: Order #${createdOrderId} status updated to: "${updatedStatus}".`);
        results.orderStatusUpdate = true;
      } else {
        console.error('   FAIL: Order status update failed:', statusUpdateRes);
        results.consoleErrors++;
      }
    }

  } catch (err) {
    console.error('Fatal test execution error:', err);
    results.consoleErrors++;
  }

  console.log('\n========================================================');
  console.log('                 FINAL TEST METRICS                     ');
  console.log('========================================================');
  console.log(`Product API connection:   ${results.productsApi ? 'PASS' : 'FAIL'}`);
  console.log(`Product details API:      ${results.productDetailsApi ? 'PASS' : 'FAIL'}`);
  console.log(`Admin product CRUD:       ${results.adminProductCrud ? 'PASS' : 'FAIL'}`);
  console.log(`Checkout -> MongoDB order: ${results.checkoutToMongoOrder ? 'PASS' : 'FAIL'}`);
  console.log(`Admin orders:             ${results.adminOrdersList ? 'PASS' : 'FAIL'}`);
  console.log(`Order status update:      ${results.orderStatusUpdate ? 'PASS' : 'FAIL'}`);
  console.log(`Console errors:           ${results.consoleErrors}`);
  console.log('========================================================\n');

  if (
    results.productsApi &&
    results.productDetailsApi &&
    results.adminProductCrud &&
    results.checkoutToMongoOrder &&
    results.adminOrdersList &&
    results.orderStatusUpdate &&
    results.consoleErrors === 0
  ) {
    console.log('ALL VERIFICATION CHECKS PASSED WITH 0 ERRORS!');
    process.exit(0);
  } else {
    console.error('SOME VERIFICATION CHECKS FAILED!');
    process.exit(1);
  }
}

runTests();
