import mongoose from 'mongoose';
import { environment } from './environment';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(environment.DATABASE_URL);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};