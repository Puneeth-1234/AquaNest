const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const connectDB = require('./config/db');
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await connectDB();

    // 1. Seed Products from products.json
    const productsPath = path.join(__dirname, 'data', 'products.json');
    if (!fs.existsSync(productsPath)) {
      console.warn('data/products.json not found, skipping product seed.');
    } else {
      const rawProducts = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));
      console.log(`Found ${rawProducts.length} products in data/products.json`);

      let insertedCount = 0;
      let updatedCount = 0;

      for (const p of rawProducts) {
        const productId = p.id || p.productId;
        if (!productId) continue;

        const productDoc = {
          productId: productId,
          name: p.name,
          category: p.category,
          categorySlug: p.categorySlug || '',
          price: p.price,
          originalPrice: p.oldPrice !== undefined ? p.oldPrice : (p.originalPrice !== undefined ? p.originalPrice : p.price),
          stock: p.stock !== undefined ? p.stock : 10,
          rating: p.rating !== undefined ? p.rating : 5.0,
          reviewsCount: p.reviewsCount || 0,
          isTrending: Boolean(p.isTrending),
          isBestSeller: Boolean(p.isBestSeller),
          isSpecialOffer: Boolean(p.isSpecialOffer),
          discountBadge: p.discountBadge || '',
          image: p.image || 'images/koi-kohaku.jpg',
          fallbackColor: p.fallbackColor || '#00d2ff',
          shortDescription: p.shortDescription || '',
          description: p.fullDescription || p.description || '',
          tankSize: p.specs?.minTankSize || p.tankSize || '20+ Gallons',
          waterTemperature: p.specs?.temperature || p.waterTemperature || '24°C – 28°C',
          phRange: p.specs?.phRange || p.phRange || '6.8 – 7.5',
          careLevel: p.specs?.careLevel || p.careLevel || 'Beginner',
          diet: p.specs?.diet || p.diet || 'Omnivorous',
          expectedSize: p.specs?.adultSize || p.expectedSize || '2 – 3 inches',
          lifespan: p.specs?.lifespan || p.lifespan || '3 – 5 Years',
          specs: p.specs || {}
        };

        const existing = await Product.findOne({ productId: productId });
        if (existing) {
          await Product.updateOne({ productId: productId }, { $set: productDoc });
          updatedCount++;
        } else {
          await Product.create(productDoc);
          insertedCount++;
        }
      }

      const totalInDb = await Product.countDocuments();
      console.log(`Product seeding complete: ${insertedCount} newly inserted, ${updatedCount} updated. Total in DB: ${totalInDb}`);
    }

    // 2. Seed Sample Orders if collection is empty
    const ordersPath = path.join(__dirname, 'data', 'orders.json');
    if (fs.existsSync(ordersPath)) {
      const rawOrders = JSON.parse(fs.readFileSync(ordersPath, 'utf-8'));
      for (const o of rawOrders) {
        const orderId = o.id || o.orderId;
        if (!orderId) continue;

        const orderDoc = {
          orderId: orderId,
          customer: o.customer,
          products: (o.items || o.products || []).map((it) => ({
            productId: it.productId || it.id,
            name: it.name,
            price: it.price,
            quantity: it.quantity || 1,
            image: it.image || 'images/koi-kohaku.jpg'
          })),
          subtotal: o.subtotal || o.totalAmount || o.total || 0,
          deliveryCharge: o.deliveryCharge || 0,
          discount: o.discount || 0,
          total: o.totalAmount || o.total || 0,
          paymentMethod: o.paymentMethod || 'Cash on Delivery',
          orderStatus: o.status || o.orderStatus || 'Pending',
          estimatedDelivery: o.estimatedDelivery || '24 to 48 Hours'
        };

        const existingOrder = await Order.findOne({ orderId: orderId });
        if (!existingOrder) {
          await Order.create(orderDoc);
          console.log(`Seeded order: ${orderId}`);
        }
      }
    }

    // 3. Seed Sample Users if collection is empty
    const usersPath = path.join(__dirname, 'data', 'users.json');
    if (fs.existsSync(usersPath)) {
      const rawUsers = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
      for (const u of rawUsers) {
        if (!u.email) continue;
        const existingUser = await User.findOne({ email: u.email.toLowerCase().trim() });
        if (!existingUser) {
          await User.create({
            name: u.name,
            email: u.email.toLowerCase().trim(),
            phone: u.phone || '',
            role: u.role || 'customer'
          });
          console.log(`Seeded user: ${u.email}`);
        }
      }
    }

    console.log('Database initialization / seeding finished successfully!');
    if (require.main === module) {
      await mongoose.connection.close();
      process.exit(0);
    }
  } catch (err) {
    console.error('Database seeding failed:', err);
    if (require.main === module) {
      process.exit(1);
    }
    throw err;
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
