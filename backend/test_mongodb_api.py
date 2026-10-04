import urllib.request
import json
import sys

BASE = 'http://localhost:5000'
all_passed = True

def report(name, condition, details=""):
    global all_passed
    if condition:
        print(f"  [PASS] {name} - {details}")
    else:
        print(f"  [FAIL] {name} - {details}")
        all_passed = False

def http_get(path):
    req = urllib.request.Request(f"{BASE}{path}", headers={'Accept': 'application/json'})
    with urllib.request.urlopen(req, timeout=5) as res:
        status = res.status
        data = json.loads(res.read().decode('utf-8'))
        return status, data

def http_post(path, payload):
    req = urllib.request.Request(
        f"{BASE}{path}",
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'Accept': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req, timeout=5) as res:
        status = res.status
        data = json.loads(res.read().decode('utf-8'))
        return status, data

def http_put(path, payload):
    req = urllib.request.Request(
        f"{BASE}{path}",
        data=json.dumps(payload).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'Accept': 'application/json'},
        method='PUT'
    )
    with urllib.request.urlopen(req, timeout=5) as res:
        status = res.status
        data = json.loads(res.read().decode('utf-8'))
        return status, data

def http_delete(path):
    req = urllib.request.Request(
        f"{BASE}{path}",
        headers={'Accept': 'application/json'},
        method='DELETE'
    )
    with urllib.request.urlopen(req, timeout=5) as res:
        status = res.status
        data = json.loads(res.read().decode('utf-8'))
        return status, data

print("\n==================================================")
print(" AquaNest MongoDB Integration API Verification")
print(" Target: http://localhost:5000")
print("==================================================\n")

# 1. Health check
status, health = http_get('/api/health')
report(
    "GET /api/health",
    status == 200 and health.get('success') is True,
    f"Status {status}, message: '{health.get('message')}'"
)

# 2. GET /api/products
status, prods = http_get('/api/products')
has_mongo_fields = False
if status == 200 and prods.get('count', 0) >= 20:
    first_item = prods['data'][0]
    # Check if document has MongoDB _id and createdAt
    if '_id' in first_item and 'createdAt' in first_item:
        has_mongo_fields = True

report(
    "GET /api/products",
    status == 200 and prods.get('success') is True and prods.get('count') >= 20,
    f"Status {status}, Total Products: {prods.get('count')}"
)

report(
    "Verify Products from MongoDB",
    has_mongo_fields,
    f"MongoDB _id='{first_item.get('_id')}', createdAt='{first_item.get('createdAt')}'"
)

# 3. GET /api/products/:id
status, single_p = http_get('/api/products/koi-kohaku')
report(
    "GET /api/products/koi-kohaku",
    status == 200 and single_p.get('success') is True and single_p.get('data', {}).get('name') == 'Kohaku Japanese Koi',
    f"Status {status}, Product: '{single_p.get('data', {}).get('name')}', MongoDB _id: {single_p.get('data', {}).get('_id')}"
)

# 4. GET /api/orders
status, orders = http_get('/api/orders')
first_order = orders['data'][0] if orders.get('data') else {}
report(
    "GET /api/orders",
    status == 200 and orders.get('success') is True and orders.get('count') >= 2,
    f"Status {status}, Total Orders: {orders.get('count')}, Sample: '{first_order.get('orderId')}' (_id: {first_order.get('_id')})"
)

# 5. POST /api/products (CRUD verify in MongoDB)
try:
    http_delete('/api/products/mongo-test-discus')
except Exception:
    pass

test_prod = {
    "productId": "mongo-test-discus",
    "name": "Turquoise Checkerboard Discus",
    "category": "Angelfish & Cichlids",
    "price": 2800,
    "originalPrice": 3200,
    "stock": 8,
    "shortDescription": "Stunning blue and red striated show-grade discus fish."
}
status, created_p = http_post('/api/products', test_prod)
report(
    "POST /api/products (Create in MongoDB)",
    status == 201 and created_p.get('success') is True and created_p.get('data', {}).get('productId') == 'mongo-test-discus',
    f"Status {status}, Created MongoDB document _id: {created_p.get('data', {}).get('_id')}"
)

# 6. PUT /api/products/:id (Update in MongoDB)
status, updated_p = http_put('/api/products/mongo-test-discus', {"price": 2950, "stock": 6})
report(
    "PUT /api/products/:id (Update in MongoDB)",
    status == 200 and updated_p.get('success') is True and updated_p.get('data', {}).get('price') == 2950,
    f"Status {status}, Updated Price: Rs. {updated_p.get('data', {}).get('price')}, Stock: {updated_p.get('data', {}).get('stock')}"
)

# 7. DELETE /api/products/:id (Delete from MongoDB)
status, deleted_p = http_delete('/api/products/mongo-test-discus')
report(
    "DELETE /api/products/:id (Delete from MongoDB)",
    status == 200 and deleted_p.get('success') is True,
    f"Status {status}, Deleted: {deleted_p.get('deletedId')}"
)

# Verify deletion from MongoDB
try:
    http_get('/api/products/mongo-test-discus')
    deleted_verified = False
except urllib.error.HTTPError as e:
    deleted_verified = (e.code == 404)

report(
    "Confirm Deletion from MongoDB (404 expected)",
    deleted_verified,
    "Item no longer exists in MongoDB"
)

print("\n==================================================")
if all_passed:
    print(" ALL MONGODB BACKEND API TESTS PASSED 100%!")
else:
    print(" SOME TESTS FAILED!")
print("==================================================\n")

sys.exit(0 if all_passed else 1)
