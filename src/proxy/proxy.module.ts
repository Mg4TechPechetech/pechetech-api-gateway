import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';

@Module({})
export class ProxyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 1. Proxy to Benefit Service (Micro-credit / Tontine)
    consumer
      .apply(createProxyMiddleware({ target: 'http://pechetech-benefit-service:3000', changeOrigin: true }))
      .forRoutes('/api/v1/expenses');

    // 2. Proxy to Fuel Service (Micro-Commissions 0.5%)
    consumer
      .apply(
        // We could intercept requests here to log business model commissions, 
        // but for now we just proxy directly.
        createProxyMiddleware({ target: 'http://pechetech-fuel-service:3001', changeOrigin: true })
      )
      .forRoutes('/api/v1/fuel');

    // 3. Proxy to OCR Service (Expense tracking)
    consumer
      .apply(createProxyMiddleware({ target: 'http://pechetech-finance-ocr-service:8000', changeOrigin: true }))
      .forRoutes('/api/v1/ocr');

    // 4. Proxy to Predictive Weather/Market (IA Premium)
    consumer
      .apply(
        createProxyMiddleware({
          target: 'http://pechetech-predictive-weather-service:8000',
          changeOrigin: true,
          onProxyReq: (proxyReq, req: any, res) => {
            // Business Logic: Check if user has PREMIUM plan to access market predictions
            const user = req.user; // Injected by JwtAuthGuard
            if (req.url.includes('/market') && user?.plan !== 'PREMIUM') {
              res.status(403).json({ 
                error: 'Premium Plan Required', 
                message: 'Access to predictive market prices requires the IA Prédictive Premium subscription.' 
              });
              // This is a naive way to block proxying, typically done via proper NestJS Guards
              // but demonstrated here in the proxy layer for the business model requirement.
              return;
            }
          }
        })
      )
      .forRoutes('/api/v1/predictions');
    // 5. Proxy to Blockchain Service (Traceability / Système à la part)
    consumer
      .apply(createProxyMiddleware({ target: 'http://pechetech-blockchain-service:3002', changeOrigin: true }))
      .forRoutes('/api/v1/blockchain');
  }
}
