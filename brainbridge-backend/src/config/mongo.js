import mongoose from 'mongoose';

const connectMongo = async (retries = 5) => {
  while (retries) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return mongoose;
    } catch (error) {
      console.error(`❌ MongoDB connection attempt failed: ${error.message}`);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      if (retries === 0) {
        return null;
      }
      // Wait for 5 seconds before retrying
      await new Promise(res => setTimeout(res, 5000));
    }
  }
};

export const closeMongooseConnection = async () => {
  await mongoose.connection.close();
};

export default connectMongo;
export { connectMongo };
