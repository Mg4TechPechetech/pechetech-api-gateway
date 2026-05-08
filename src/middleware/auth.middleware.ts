import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FirebaseService } from '../auth/firebase.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly firebaseService: FirebaseService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      // For some routes we might want to allow unauthenticated access, 
      // but for proxying to internal services, we usually want auth.
      // Let's just decode if possible and move on, or block if needed.
      return next();
    }

    const token = authHeader.split(' ')[1];
    try {
      const decodedToken = await this.firebaseService.verifyToken(token);
      (req as any).user = {
        userId: decodedToken.uid,
        email: decodedToken.email,
        // Default roles/plans if not in custom claims
        role: decodedToken.role || 'PECHEUR',
        plan: decodedToken.plan || 'FREE',
      };
    } catch (e) {
      // In a gateway, we might want to be strict
      // throw new UnauthorizedException('Invalid Firebase Token');
      console.error('AuthMiddleware Error:', e.message);
    }
    next();
  }
}
