const mongoose = require('mongoose');

/**
 * Connect to MongoDB using connection string from environment variables.
 * Fails fast and logs a clear error if connection fails.
 */
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    const errorMsg = 'FATAL ERROR: MONGODB_URI is not defined in environment variables (.env). Server startup aborted.';
    console.error('====================================================');
    console.error(`[DATABASE CONFIG ERROR] ${errorMsg}`);
    console.error('====================================================');
    throw new Error(errorMsg);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });

    console.log('====================================================');
    console.log(` MongoDB Connected Successfully!`);
    console.log(` Host:     ${conn.connection.host}`);
    console.log(` Port:     ${conn.connection.port}`);
    console.log(` Database: ${conn.connection.name}`);
    console.log('====================================================');

    return conn;
  } catch (err) {
    console.error('====================================================');
    console.error(`[DATABASE CONNECTION FAILED] ${err.message}`);
    console.error('Server startup aborted due to database connection failure.');
    console.error('====================================================');
    throw err;
  }
};

module.exports = connectDB;
