const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (process.env.DB_TYPE === 'mock') {
      console.log('Using In-Memory Database (Mock Mode)...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (Mock): ${conn.connection.host}`);
      return;
    }

    console.log('Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`Database Connection Error: ${err.message}`);
    
    if (err.message.includes('ECONNREFUSED') || err.message.includes('MongooseServerSelectionError')) {
      console.log('--- FALLBACK TRIGGERED ---');
      console.log('Atlas connection failed. Attempting to start in-memory database for local development...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected (Fallback to Mock): ${conn.connection.host}`);
        return;
      } catch (fallbackErr) {
        console.error(`Fallback failed: ${fallbackErr.message}`);
      }
    }
    
    console.warn('Server starting WITHOUT a live database connection.');
  }
};

module.exports = connectDB;
