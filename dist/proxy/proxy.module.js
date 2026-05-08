"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxyModule = void 0;
const common_1 = require("@nestjs/common");
const http_proxy_middleware_1 = require("http-proxy-middleware");
let ProxyModule = class ProxyModule {
    configure(consumer) {
        consumer
            .apply((0, http_proxy_middleware_1.createProxyMiddleware)({ target: 'http://pechetech-benefit-service:3000', changeOrigin: true }))
            .forRoutes('/api/v1/expenses');
        consumer
            .apply((0, http_proxy_middleware_1.createProxyMiddleware)({ target: 'http://pechetech-fuel-service:3001', changeOrigin: true }))
            .forRoutes('/api/v1/fuel');
        consumer
            .apply((0, http_proxy_middleware_1.createProxyMiddleware)({ target: 'http://pechetech-finance-ocr-service:8000', changeOrigin: true }))
            .forRoutes('/api/v1/ocr');
        consumer
            .apply((0, http_proxy_middleware_1.createProxyMiddleware)({
            target: 'http://pechetech-predictive-weather-service:8000',
            changeOrigin: true,
            on: {
                proxyReq: (proxyReq, req, res) => {
                    const user = req.user;
                    if (req.url.includes('/market') && user?.plan !== 'PREMIUM') {
                        res.status(403).json({
                            error: 'Premium Plan Required',
                            message: 'Access to predictive market prices requires the IA Prédictive Premium subscription.'
                        });
                        return;
                    }
                }
            }
        }))
            .forRoutes('/api/v1/predictions');
        consumer
            .apply((0, http_proxy_middleware_1.createProxyMiddleware)({ target: 'http://pechetech-blockchain-service:3002', changeOrigin: true }))
            .forRoutes('/api/v1/blockchain');
    }
};
exports.ProxyModule = ProxyModule;
exports.ProxyModule = ProxyModule = __decorate([
    (0, common_1.Module)({})
], ProxyModule);
//# sourceMappingURL=proxy.module.js.map