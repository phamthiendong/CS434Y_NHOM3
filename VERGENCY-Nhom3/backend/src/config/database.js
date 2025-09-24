import mongoose from 'mongoose';

const connectDB = async () => {
    console.log('1. Attempting to connect to DB...'); 

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error connecting to DB: ${error.message}`);
    process.exit(1); 
  }
  
};


export default connectDB; 