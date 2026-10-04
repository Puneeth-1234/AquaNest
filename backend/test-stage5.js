/**
 * AquaNest Stage 5 Comprehensive Authentication & Authorization Test Suite
 * Validates all 14 required security, role-based access, and regression checks.
 */
const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

function apiRequest(path, options = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {})
    };

    if (options.token) {
      headers['Authorization'] = `Bearer ${options.token}`;
    }

    const reqOptions = {
      method: options.method || 'GET',
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      headers: headers
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data, headers: res.headers });
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

async function runStage5Tests() {
  console.log('================================================================');
  console.log('       AQUANEST STAGE 5: AUTHENTICATION & AUTHORIZATION TESTS   ');
  console.log('================================================================\n');

  const testReport = {};
  let totalErrors = 0;

  function record(name, passed, detail = '') {
    testReport[name] = passed ? 'PASS' : 'FAIL';
    const tag = passed ? '[PASS]' : '[FAIL]';
    console.log(`${tag} ${name}${detail ? ' -> ' + detail : ''}`);
    if (!passed) totalErrors++;
  }

  const timestamp = Date.now();
  const testCustomerEmail = `customer_${timestamp}@testaquanest.in`;
  const testCustomerPassword = 'SecurePassword@2026';
  let customerToken = null;
  let adminToken = null;
  let customerUserId = null;

  try {
    // -------------------------------------------------------------------------
    // TEST 1: Register customer
    // -------------------------------------------------------------------------
    const regRes = await apiRequest('/auth/register', {
      method: 'POST',
      body: {
        name: 'Rahul Sen',
        email: testCustomerEmail,
        phone: '9876543210',
        password: testCustomerPassword
      }
    });

    if (regRes.status === 201 && regRes.data?.success && regRes.data?.token) {
      customerToken = regRes.data.token;
      customerUserId = regRes.data.user?.id || regRes.data.user?._id;
      const noPlaintext = !regRes.data.user?.password && !regRes.data.user?.passwordHash;
      record('Register customer', noPlaintext && regRes.data.user?.role === 'customer',
        `User ID: ${customerUserId}, Token issued, Password safely omitted`);
    } else {
      record('Register customer', false, `Status ${regRes.status}: ${JSON.stringify(regRes.data)}`);
    }

    // -------------------------------------------------------------------------
    // TEST 2: Duplicate registration (must return 409)
    // -------------------------------------------------------------------------
    const dupRes = await apiRequest('/auth/register', {
      method: 'POST',
      body: {
        name: 'Rahul Sen Duplicate',
        email: testCustomerEmail,
        phone: '9876543210',
        password: testCustomerPassword
      }
    });

    record('Duplicate registration', dupRes.status === 409 && dupRes.data?.success === false,
      `Rejected with HTTP 409 Conflict: "${dupRes.data?.message}"`);

    // -------------------------------------------------------------------------
    // TEST 3: Customer login
    // -------------------------------------------------------------------------
    const loginRes = await apiRequest('/auth/login', {
      method: 'POST',
      body: {
        email: testCustomerEmail,
        password: testCustomerPassword
      }
    });

    if (loginRes.status === 200 && loginRes.data?.success && loginRes.data?.token) {
      customerToken = loginRes.data.token; // Refresh token
      record('Customer login', loginRes.data.user?.email === testCustomerEmail.toLowerCase(),
        `Authenticated as customer: ${loginRes.data.user?.name}`);
    } else {
      record('Customer login', false, `Status ${loginRes.status}`);
    }

    // -------------------------------------------------------------------------
    // TEST 4: Wrong password (must return 401)
    // -------------------------------------------------------------------------
    const wrongPwdRes = await apiRequest('/auth/login', {
      method: 'POST',
      body: {
        email: testCustomerEmail,
        password: 'IncorrectPassword123'
      }
    });

    record('Wrong password', wrongPwdRes.status === 401 && wrongPwdRes.data?.success === false,
      `Rejected with HTTP 401 Unauthorized: "${wrongPwdRes.data?.message}"`);

    // -------------------------------------------------------------------------
    // TEST 5: Valid JWT (GET /api/auth/me)
    // -------------------------------------------------------------------------
    const meRes = await apiRequest('/auth/me', { token: customerToken });
    record('Valid JWT', meRes.status === 200 && meRes.data?.user?.email === testCustomerEmail.toLowerCase(),
      `Token validated, returned user: ${meRes.data?.user?.email} (Role: ${meRes.data?.user?.role})`);

    // -------------------------------------------------------------------------
    // TEST 6: Invalid JWT (must return 401)
    // -------------------------------------------------------------------------
    const invalidJwtRes = await apiRequest('/auth/me', { token: 'invalid.garbage.token.header' });
    record('Invalid JWT', invalidJwtRes.status === 401 && invalidJwtRes.data?.success === false,
      `Rejected invalid token with HTTP 401: "${invalidJwtRes.data?.message}"`);

    // -------------------------------------------------------------------------
    // TEST 7: Customer accessing admin endpoint -> must return 403 Forbidden
    // -------------------------------------------------------------------------
    const customerAdminRes = await apiRequest('/orders', { token: customerToken });
    record('Customer accessing admin endpoint', customerAdminRes.status === 403,
      `Customer blocked with HTTP 403 Forbidden: "${customerAdminRes.data?.message}"`);

    // -------------------------------------------------------------------------
    // TEST 8: Admin login
    // -------------------------------------------------------------------------
    const adminLoginRes = await apiRequest('/auth/login', {
      method: 'POST',
      body: {
        email: 'admin@aquanest.com',
        password: 'Admin@123456'
      }
    });

    if (adminLoginRes.status === 200 && adminLoginRes.data?.success && adminLoginRes.data?.user?.role === 'admin') {
      adminToken = adminLoginRes.data.token;
      record('Admin login', true, `Admin verified: ${adminLoginRes.data.user.email} (Role: ${adminLoginRes.data.user.role})`);
    } else {
      record('Admin login', false, `Status ${adminLoginRes.status}: ${JSON.stringify(adminLoginRes.data)}`);
    }

    // -------------------------------------------------------------------------
    // TEST 9: Admin accessing admin endpoint -> must succeed
    // -------------------------------------------------------------------------
    const adminOrdersRes = await apiRequest('/orders', { token: adminToken });
    record('Admin accessing admin endpoint', adminOrdersRes.status === 200 && Array.isArray(adminOrdersRes.data?.data),
      `Admin successfully accessed orders collection (${adminOrdersRes.data?.data?.length} orders)`);

    // -------------------------------------------------------------------------
    // TEST 10: Unauthenticated admin access -> must fail (401)
    // -------------------------------------------------------------------------
    const unauthOrdersRes = await apiRequest('/orders');
    record('Unauthenticated admin access', unauthOrdersRes.status === 401,
      `Anonymous call rejected with HTTP 401: "${unauthOrdersRes.data?.message}"`);

    // -------------------------------------------------------------------------
    // TEST 11: Logout (Client clears auth token and state)
    // -------------------------------------------------------------------------
    // In client-side token auth, logout removes token from storage; subsequent requests lack Bearer header
    const postLogoutRes = await apiRequest('/auth/me'); // Request without token
    record('Logout', postLogoutRes.status === 401,
      `Subsequent requests without client token rejected with HTTP 401`);

    // -------------------------------------------------------------------------
    // TEST 12: Existing product APIs (Public access preserved)
    // -------------------------------------------------------------------------
    const publicProductsRes = await apiRequest('/products');
    const publicDetailRes = await apiRequest('/products/koi-kohaku');
    const prodsOk = publicProductsRes.status === 200 && Array.isArray(publicProductsRes.data?.data) && publicProductsRes.data.data.length >= 20;
    const detailOk = publicDetailRes.status === 200 && publicDetailRes.data?.data?.name === 'Kohaku Japanese Koi';
    record('Existing product APIs', prodsOk && detailOk,
      `Public catalog (${publicProductsRes.data?.data?.length} species) & details accessible without login`);

    // -------------------------------------------------------------------------
    // TEST 13: Existing order APIs (Public/Guest & Authenticated customer)
    // -------------------------------------------------------------------------
    const testGuestOrder = {
      orderId: `AN-TEST-GUEST-${Math.floor(100000 + Math.random() * 900000)}`,
      customer: {
        fullName: 'Anita Deshmukh',
        phone: '9811223344',
        email: 'anita.d@example.com',
        address: '101 Lotus Enclave',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560001'
      },
      products: [
        { productId: 'betta-halfmoon-blue', name: 'Royal Blue Halfmoon Betta', price: 420, quantity: 1 }
      ],
      total: 420
    };

    const guestOrderRes = await apiRequest('/orders', { method: 'POST', body: testGuestOrder });
    const guestOrderPassed = guestOrderRes.status === 201 && guestOrderRes.data?.success;

    // Test authenticated customer order associating userId
    const testCustomerOrder = {
      orderId: `AN-TEST-CUST-${Math.floor(100000 + Math.random() * 900000)}`,
      customer: {
        fullName: 'Rahul Sen',
        phone: '9876543210',
        email: testCustomerEmail,
        address: '404 Palm Avenue',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700029'
      },
      products: [
        { productId: 'koi-showa', name: 'Showa Sanshoku Tri-Color Koi', price: 1850, quantity: 1 }
      ],
      total: 1850
    };

    const custOrderRes = await apiRequest('/orders', {
      method: 'POST',
      token: customerToken,
      body: testCustomerOrder
    });

    const custOrderPassed = custOrderRes.status === 201 && custOrderRes.data?.data?.userId === customerUserId;

    record('Existing order APIs', guestOrderPassed && custOrderPassed,
      `Guest checkout supported & Authenticated order successfully linked to userId: ${customerUserId}`);

    // -------------------------------------------------------------------------
    // TEST 14: Existing checkout flow (My Orders retrieval & integrity)
    // -------------------------------------------------------------------------
    const myOrdersRes = await apiRequest('/orders/my-orders', { token: customerToken });
    const hasCustomerOrder = myOrdersRes.status === 200 && Array.isArray(myOrdersRes.data?.data) && myOrdersRes.data.data.length > 0;
    record('Existing checkout flow', hasCustomerOrder,
      `Customer retrieved ${myOrdersRes.data?.data?.length} personal orders from MongoDB via /api/orders/my-orders`);

  } catch (err) {
    console.error('Fatal Test Execution Error:', err);
    totalErrors++;
  }

  console.log('\n================================================================');
  console.log('                FINAL STAGE 5 VERIFICATION RESULTS              ');
  console.log('================================================================');
  for (const [testName, result] of Object.entries(testReport)) {
    const pad = ' '.repeat(Math.max(2, 38 - testName.length));
    console.log(`${testName}:${pad}${result}`);
  }
  console.log('================================================================');
  console.log(`TOTAL CONSOLE & SERVER ERRORS: ${totalErrors}`);
  console.log('================================================================\n');

  if (totalErrors === 0) {
    console.log('>>> ALL 14 AUTHENTICATION & AUTHORIZATION TESTS PASSED! <<<');
    process.exit(0);
  } else {
    console.error(`>>> ${totalErrors} TEST(S) FAILED! <<<`);
    process.exit(1);
  }
}

runStage5Tests();
