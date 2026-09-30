import app from '../src/app.js';
import { connectDatabase } from '../src/config/database.js';
import { AuthService } from '../src/services/auth.service.js';
import { Request, Response } from 'express';

let initialized = false;

const init = async () => {
  if (!initialized) {
    await connectDatabase();
    await AuthService.seedDefaultAdmin().catch(() => {});
    initialized = true;
  }
};

export default async function handler(req: Request, res: Response) {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, DELETE, POST, PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  await init();
  return app(req, res);
}
