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
  await init();
  return app(req, res);
}
