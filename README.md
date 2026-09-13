# Taxfiler Backend Server

Industrial Node.js Express TypeScript backend server for Taxfiler client registrations, consultations, appointment submissions, and admin authentication with MongoDB Atlas integration and Nodemailer email dispatch.

## Features
- **Express & TypeScript**: Strong types and modular architecture.
- **MongoDB Atlas & Mongoose**: Relational-like schema design for registrations, submissions, and admin accounts.
- **JWT Admin Authentication**: Token-based auth endpoints (`/api/auth/login`, `/api/auth/me`).
- **Nodemailer Notification Engine**: Automated HTML email alerts sent to administrator inbox.
- **Vercel Serverless Ready**: Native deployment support with serverless function handler (`vercel.json` & `api/index.ts`).

## Environment Variables
Set these variables in your Vercel project settings or `.env` file:
- `PORT`: Server port (default: 5001)
- `MONGODB_URI`: MongoDB Atlas connection string
- `JWT_SECRET`: Secret key for JWT signing
- `NOTIFICATION_EMAIL`: Email address for admin notifications

## Deploy to Vercel
1. Import this repository into Vercel.
2. Add the environment variables above in Vercel project settings.
3. Deploy!
