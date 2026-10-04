const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Ensures an admin user exists in MongoDB for administrative dashboard access.
 */
const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@aquanest.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123456';

    const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(adminPassword, salt);

      await User.create({
        name: 'AquaNest Administrator',
        email: adminEmail.toLowerCase(),
        phone: '9876543210',
        passwordHash: passwordHash,
        role: 'admin'
      });

      console.log(`[AUTH] Default Admin account created: ${adminEmail}`);
    } else if (existingAdmin.role !== 'admin') {
      existingAdmin.role = 'admin';
      await existingAdmin.save();
      console.log(`[AUTH] Account ${adminEmail} promoted to admin.`);
    }
  } catch (err) {
    console.error('[AUTH] Admin seeding notice:', err.message);
  }
};

module.exports = seedAdmin;
