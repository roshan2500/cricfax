import { createApp } from './app';
import { config } from './config';
import { initDatabase } from './db/store';

async function bootstrap() {
  await initDatabase();

  const app = createApp();

  const server = app.listen(config.port, () => {
    console.log(`===============================================`);
    console.log(`🏏 CricFax API Server is live!`);
    console.log(`📍 Endpoint: http://localhost:${config.port}/api/v1`);
    console.log(`🩺 Health:   http://localhost:${config.port}/api/v1/health`);
    console.log(`🌐 Mode:     ${config.nodeEnv}`);
    console.log(`===============================================`);
  });

  // Graceful shutdown handling
  const shutdown = () => {
    console.log('\nReceived kill signal, shutting down gracefully...');
    server.close(() => {
      console.log('Closed out remaining connections.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap().catch(err => {
  console.error('Fatal error during server bootstrap:', err);
  process.exit(1);
});
