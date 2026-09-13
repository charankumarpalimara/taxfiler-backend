import mongoose from 'mongoose';
import { ENVIRONMENT } from './environment.js';
import { Logger } from '../utils/logger.js';

let isConnected = false;

export const connectDatabase = async (): Promise<void> => {
  if (isConnected || mongoose.connection.readyState === 1) {
    isConnected = true;
    return;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(ENVIRONMENT.MONGODB_URI);
    isConnected = true;
    Logger.info('🍃 Connected to MongoDB Atlas successfully');
  } catch (error) {
    Logger.error('❌ MongoDB Connection Error:', error);
  }
};
