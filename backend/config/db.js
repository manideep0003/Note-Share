import mongoose from 'mongoose';

/**
 * Establishes connection to MongoDB Atlas database.
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      console.warn(
        '⚠️  [Database Warning]: MONGO_URI is not defined in your .env file.\n' +
        '👉 Please add your MongoDB Atlas connection string to backend/.env to connect to the database.'
      );
      return;
    }

    const conn = await mongoose.connect(mongoUri);

    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do not exit in development so health check remains inspectable
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

export default connectDB;

