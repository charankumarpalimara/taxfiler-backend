import app from './app.js';
import { ENVIRONMENT } from './config/environment.js';
import { connectDatabase } from './config/database.js';
import { AuthService } from './services/auth.service.js';
import { Logger } from './utils/logger.js';

// Catch uncaught exceptions globally to prevent server crashes
process.on('uncaughtException', (error: Error) => {
  Logger.error('UNCAUGHT EXCEPTION PREVENTED SERVER CRASH', error);
});

// Catch unhandled promise rejections globally
process.on('unhandledRejection', (reason: any) => {
  Logger.error('UNHANDLED REJECTION PREVENTED SERVER CRASH', reason instanceof Error ? reason : new Error(String(reason)));
});

const startServer = async () => {
  await connectDatabase();
  await AuthService.seedDefaultAdmin();

  const server = app.listen(ENVIRONMENT.PORT, () => {
    Logger.info(`🚀 Server running smoothly on http://localhost:${ENVIRONMENT.PORT}`);
  });

  process.on('SIGTERM', () => {
    Logger.info('SIGTERM signal received. Shutting down server gracefully...');
    server.close(() => {
      Logger.info('HTTP server closed');
    });
  });
};

startServer();
