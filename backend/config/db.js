import dns from 'dns'
import mongoose from "mongoose";
import dotenv from "dotenv";
dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_DB 
    await mongoose.connect(mongoUri);
    console.log("database is connected");
  } catch (err) {
    console.error("server error: " + err.message);
    process.exit(1);
  }
};

export default connectDB;