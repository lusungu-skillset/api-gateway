// api-gateway/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('API Gateway');

  // Enable CORS with explicit configuration
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://192.168.6.128:5173',
      'http://localhost:3000',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'X-Requested-With',
      'Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Origin'
    ],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
  });

  // Add manual CORS middleware as backup
  app.use((req, res, next) => {
    const allowedOrigins = [
      'http://localhost:5173',
      'http://192.168.6.128:5173',
      'http://localhost:3000'
    ];
    
    const origin = req.headers.origin;
    
    if (origin && allowedOrigins.includes(origin)) {
      res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, X-Requested-With, Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    if (req.method === 'OPTIONS') {
      return res.status(204).send();
    }
    
    next();
  });

  await app.listen(3000, '0.0.0.0');
  logger.log('API Gateway running on http://0.0.0.0:3000');
  logger.log('CORS enabled for: http://localhost:5173, http://192.168.6.128:5173');
}
bootstrap();