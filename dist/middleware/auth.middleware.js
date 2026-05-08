"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthMiddleware = void 0;
const common_1 = require("@nestjs/common");
const firebase_service_1 = require("../auth/firebase.service");
let AuthMiddleware = class AuthMiddleware {
    constructor(firebaseService) {
        this.firebaseService = firebaseService;
    }
    async use(req, res, next) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return next();
        }
        const token = authHeader.split(' ')[1];
        try {
            const decodedToken = await this.firebaseService.verifyToken(token);
            req.user = {
                userId: decodedToken.uid,
                email: decodedToken.email,
                role: decodedToken.role || 'PECHEUR',
                plan: decodedToken.plan || 'FREE',
            };
        }
        catch (e) {
            console.error('AuthMiddleware Error:', e.message);
        }
        next();
    }
};
exports.AuthMiddleware = AuthMiddleware;
exports.AuthMiddleware = AuthMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [firebase_service_1.FirebaseService])
], AuthMiddleware);
//# sourceMappingURL=auth.middleware.js.map