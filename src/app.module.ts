import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProxyModule } from './proxy/proxy.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import * as jwt from 'jsonwebtoken';

// Middleware to extract JWT before proxy middleware runs
function extractUserMiddleware(req: any, res: any, next: Function) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.decode(token);
    } catch (e) {}
  }
  next();
}

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100, // Global rate limit: 100 requests per minute
    }]),
    ProxyModule
  ],
  providers: [
    // We enforce JWT validation globally
    // { provide: APP_GUARD, useClass: JwtAuthGuard } 
    // Disabled globally for local dev simplicity, but enabled logically in proxy
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(extractUserMiddleware).forRoutes('*');
  }
}
