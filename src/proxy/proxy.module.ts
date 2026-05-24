import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';

@Module({})
export class ProxyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 1. Proxy to Benefit Service (Micro-credit / Tontine)
    consumer
      .apply(createProxyMiddleware({ 
        target: 'http://127.0.0.1:3000', 
        changeOrigin: true,
        pathRewrite: (path) => '/expenses' + path.replace(/\/$/, ''),
        on: {
          proxyReq: (proxyReq, req: any, res) => {
            // Fix for NestJS body parser consuming the stream
            if (req.body) {
              const bodyData = JSON.stringify(req.body);
              proxyReq.setHeader('Content-Type', 'application/json');
              proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
              proxyReq.write(bodyData);
            }
            console.log(`[PROXY-BENEFIT] Forwarding ${req.method} ${req.url} -> ${proxyReq.path}`);
          },
          error: (err, req, res) => {
            console.error('[PROXY-BENEFIT] Error:', err.message);
          }
        }
      }))
      .forRoutes('/api/v1/expenses');

    // 1.b Proxy to Benefit Service (Distribution des bénéfices)
    consumer
      .apply(createProxyMiddleware({ 
        target: 'http://127.0.0.1:3000', 
        changeOrigin: true,
        pathRewrite: (path) => '/distribution' + path.replace(/\/$/, ''),
        on: {
          proxyReq: (proxyReq, req: any, res) => {
            if (req.body) {
              const bodyData = JSON.stringify(req.body);
              proxyReq.setHeader('Content-Type', 'application/json');
              proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
              proxyReq.write(bodyData);
            }
            console.log(`[PROXY-DISTRIBUTION] Forwarding ${req.method} ${req.url} -> ${proxyReq.path}`);
          },
          error: (err, req, res) => {
            console.error('[PROXY-DISTRIBUTION] Error:', err.message);
          }
        }
      }))
      .forRoutes('/api/v1/distribution');

    // 2. Proxy to Fuel Service (Micro-Commissions 0.5%)
    consumer
      .apply(
        // We could intercept requests here to log business model commissions, 
        // but for now we just proxy directly.
        createProxyMiddleware({ target: 'http://localhost:3001', changeOrigin: true })
      )
      .forRoutes('/api/v1/fuel');

    // 3. Proxy to OCR Service (Expense tracking)
    consumer
      .apply(createProxyMiddleware({ 
        target: 'http://127.0.0.1:8001', 
        changeOrigin: true,
        pathRewrite: (path, req: any) => req.originalUrl,
        on: {
          proxyReq: (proxyReq, req, res) => {
            console.log(`[PROXY-OCR] Forwarding ${req.method} ${req.url} to OCR Service`);
          },
          error: (err, req, res) => {
            console.error('[PROXY-OCR] Error:', err.message);
          }
        }
      }))
      .forRoutes('/api/v1/ocr');

    // 4. Proxy to Predictive Weather/Market (IA Premium)
    consumer
      .apply(
        createProxyMiddleware({
          target: 'http://localhost:8000',
          changeOrigin: true,
          pathRewrite: (path, req: any) => req.originalUrl,
          on: {
            proxyReq: (proxyReq, req: any, res) => {
              // Business Logic: Check if user has PREMIUM plan to access market predictions
              const user = req.user; // Injected by JwtAuthGuard
              if (req.url.includes('/market') && user?.plan !== 'PREMIUM') {
                (res as any).status(403).json({ 
                  error: 'Premium Plan Required', 
                  message: 'Access to predictive market prices requires the IA Prédictive Premium subscription.' 
                });
                return;
              }

            }
          }
        })

      )
      .forRoutes('/api/v1/predictions');
      
    // 4.b Proxy to Predictive Weather Service for weather
    consumer
      .apply(createProxyMiddleware({ 
        target: 'http://localhost:8000', 
        changeOrigin: true,
        pathRewrite: (path, req: any) => req.originalUrl 
      }))
      .forRoutes('/api/v1/weather');

    // 5. Proxy to Blockchain Service (Traceability / Système à la part)
    consumer
      .apply(createProxyMiddleware({ 
        target: 'http://localhost:3002', 
        changeOrigin: true,
        pathRewrite: (path, req: any) => req.originalUrl 
      }))
      .forRoutes('/api/v1/blockchain');
  }
}
