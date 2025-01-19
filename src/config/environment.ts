import * as dotenv from 'dotenv';

dotenv.config();

export const environment = {
  PORT: process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL || 'mongodb+srv://ahmednabeil:rVx7QaTzK2fEaI0a@exam.p26mk.mongodb.net/?retryWrites=true&w=majority&appName=Exam',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '24h',
  NODE_ENV: process.env.NODE_ENV || 'development',
  ALLOWED_ORIGINS: [
    'http://localhost:4200',
    'http://localhost:3000',
    'https://your-frontend-domain.com',
    /\.railway\.app$/
  ]
};