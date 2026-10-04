const http = require('http');

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    const options = {
      method: method,
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log(`\n========================================`);
  console.log(` AquaNest Backend End-to-End API Test`);
  console.log(` Target: ${BASE_URL}`);
  console.log(`========================================\n`);

  let allPassed = true;

  function report(name, passed, detail) {
    if (passed) {
      console.log(`  [PASS] ${name}`);
    } else {
      console.log(`  [FAIL] ${name} -> ${detail}`);
      allPassed = false;
    }
  }

  try {
    // 1. Health Check
    const resHealth = await request('GET', '/api/health');
    report(
      'GET /api/health',
      resHealth.status === 200 && resHealth.data.success === true && resHealth.data.message === 'AquaNest API is running',
      JSON.stringify(resHealth.data)
    );

    // 2. GET all products
    const resProducts = await request('GET', '/api/products');
    report(
      'GET /api/products',
      resProducts.status === 200 && resProducts.data.success === true && Array.isArray(resProducts.data.data) && resProducts.data.count >= 20,
      `status=${resProducts.status}, count=${resProducts.data.count}`
    );

    // 3. GET product by ID
    const resSingleProduct = await request('GET', '/api/products/koi-kohaku');
    report(
      'GET /api/products/:id (koi-kohaku)',
      resSingleProduct.status === 200 && resSingleProduct.data.success === true && resSingleProduct.data.data.name === 'Kohaku Japanese Koi',
      JSON.stringify(resSingleProduct.data)
    );

    // 4. POST create new product
    const testProduct = {
      id: 'test-guppy-emerald',
      name: 'Emerald Dragon High-Fin Guppy',
      category: 'Guppy',
      price: 499,
      oldPrice: 599,
      stock: 25,
      shortDescription: 'Luminous emerald-green scales with trailing caudal fin.'
    };
    const resCreateProd = await request('POST', '/api/products', testProduct);
    report(
      'POST /api/products',
      resCreateProd.status === 201 && resCreateProd.data.success === true && resCreateProd.data.data.id === 'test-guppy-emerald',
      JSON.stringify(resCreateProd.data)
    );

    // 5. PUT update product
    const updatePayload = { price: 549, stock: 22 };
    const resUpdateProd = await request('PUT', '/api/products/test-guppy-emerald', updatePayload);
    report(
      'PUT /api/products/:id',
      resUpdateProd.status === 200 && resUpdateProd.data.success === true && resUpdateProd.data.data.price === 549 && resUpdateProd.data.data.stock === 22,
      JSON.stringify(resUpdateProd.data)
    );

    // 6. DELETE product
    const resDeleteProd = await request('DELETE', '/api/products/test-guppy-emerald');
    report(
      'DELETE /api/products/:id',
      resDeleteProd.status === 200 && resDeleteProd.data.success === true,
      JSON.stringify(resDeleteProd.data)
    );

    // 7. GET all orders
    const resOrders = await request('GET', '/api/orders');
    report(
      'GET /api/orders',
      resOrders.status === 200 && resOrders.data.success === true && Array.isArray(resOrders.data.data) && resOrders.data.count >= 2,
      `status=${resOrders.status}, count=${resOrders.data.count}`
    );

    // 8. GET order by ID
    const resSingleOrder = await request('GET', '/api/orders/ORD-9421');
    report(
      'GET /api/orders/:id (ORD-9421)',
      resSingleOrder.status === 200 && resSingleOrder.data.success === true && resSingleOrder.data.data.id === 'ORD-9421',
      JSON.stringify(resSingleOrder.data)
    );

    // 9. POST create order
    const testOrder = {
      id: 'ORD-TEST-999',
      customer: {
        fullName: 'Test Buyer',
        phone: '9988776655',
        email: 'testbuyer@aquanest.in',
        address: '100 Aqua Way',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      items: [
        { productId: 'koi-kohaku', name: 'Kohaku Japanese Koi', price: 1499, quantity: 1 }
      ],
      totalAmount: 1499,
      paymentMethod: 'UPI'
    };
    const resCreateOrder = await request('POST', '/api/orders', testOrder);
    report(
      'POST /api/orders',
      resCreateOrder.status === 201 && resCreateOrder.data.success === true && resCreateOrder.data.data.id === 'ORD-TEST-999',
      JSON.stringify(resCreateOrder.data)
    );

    // 10. PUT update order (status update)
    const resUpdateOrder = await request('PUT', '/api/orders/ORD-TEST-999', { status: 'Delivered' });
    report(
      'PUT /api/orders/:id (update status)',
      resUpdateOrder.status === 200 && resUpdateOrder.data.success === true && resUpdateOrder.data.data.status === 'Delivered',
      JSON.stringify(resUpdateOrder.data)
    );

    // Clean up test order from orders.json
    const fs = require('fs');
    const path = require('path');
    const ordersPath = path.join(__dirname, 'data', 'orders.json');
    if (fs.existsSync(ordersPath)) {
      const orders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
      const filtered = orders.filter(o => o.id !== 'ORD-TEST-999');
      fs.writeFileSync(ordersPath, JSON.stringify(filtered, null, 2));
    }

    // 11. GET users
    const resUsers = await request('GET', '/api/users');
    report(
      'GET /api/users',
      resUsers.status === 200 && resUsers.data.success === true && Array.isArray(resUsers.data.data),
      `status=${resUsers.status}, count=${resUsers.data.count}`
    );

    // 12. POST user
    const testUser = {
      name: 'Rohan Sharma',
      email: `rohan.${Date.now()}@example.com`,
      role: 'customer'
    };
    const resCreateUser = await request('POST', '/api/users', testUser);
    report(
      'POST /api/users',
      resCreateUser.status === 201 && resCreateUser.data.success === true && resCreateUser.data.data.name === 'Rohan Sharma',
      JSON.stringify(resCreateUser.data)
    );

    // 13. Unknown Route 404 test
    const res404 = await request('GET', '/api/unknown-endpoint-xyz');
    report(
      'GET /api/unknown-route (404 check)',
      res404.status === 404 && res404.data.success === false && res404.data.message === 'Route not found',
      JSON.stringify(res404.data)
    );

    console.log(`\n========================================`);
    if (allPassed) {
      console.log(` ALL 13 ENDPOINT TESTS PASSED SUCCESSFULLY!`);
    } else {
      console.log(` SOME ENDPOINT TESTS FAILED`);
    }
    console.log(`========================================\n`);

    process.exit(allPassed ? 0 : 1);
  } catch (err) {
    console.error('Test execution failed with error:', err);
    process.exit(1);
  }
}

runTests();
