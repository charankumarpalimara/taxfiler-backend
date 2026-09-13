export const ENVIRONMENT = {
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://nexgengroup2026_db_user:zNyTY4DryTeNUFX6@taxfiler.pt5gbxn.mongodb.net/?appName=taxfiler',
  JWT_SECRET: process.env.JWT_SECRET || 'taxfiler_super_secret_jwt_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL || 'nexgengroup2026@gmail.com',
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: parseInt(process.env.SMTP_PORT || '587', 10),
  SMTP_USER: process.env.SMTP_USER || 'nexgengroup2026@gmail.com',
  SMTP_PASS: process.env.SMTP_PASS || '',
  CORS_ORIGINS: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001', '*'],
};
