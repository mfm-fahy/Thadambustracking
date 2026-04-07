const mongoose = require('mongoose');

// Helper: try to load mongodb-memory-server (devDependency, not available in production)
const tryMemoryServer = async () => {
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    return mongoServer.getUri();
  } catch {
    return null;
  }
};

const connectDB = async () => {
  try {
    // Mock mode — local dev only
    if (process.env.DB_TYPE === 'mock') {
      console.log('Using In-Memory Database (Mock Mode)...');
      const uri = await tryMemoryServer();
      if (!uri) {
        console.warn('mongodb-memory-server not installed. Skipping mock DB.');
        return;
      }
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB Connected (Mock): ${conn.connection.host}`);
      return;
    }

    // Production — connect to Atlas
    if (!process.env.MONGODB_URI) {
      console.warn('MONGODB_URI not set. Server starting WITHOUT database.');
      return;
    }
    console.log('Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Database Connection Error: ${err.message}`);
    console.warn('Server starting WITHOUT a live database connection.');
  }
};

module.exports = connectDB;
