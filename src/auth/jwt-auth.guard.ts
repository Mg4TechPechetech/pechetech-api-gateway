import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export interface UserPayload {
  userId: string;
  role: 'PECHEUR' | 'PROPRIETAIRE' | 'GIE' | 'MAREYEUSE';
  plan: 'FREE' | 'PREMIUM';
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      // Allow unauthenticated for public routes (e.g. login)
      // In a real API Gateway, we might block everything except /auth
      throw new UnauthorizedException('Missing Authorization Header');
    }

    const token = authHeader.split(' ')[1];
    try {
      // Mock validation for business plan demonstration
      // In prod, use standard secret or JWKS
      const decoded = jwt.decode(token) as UserPayload;
      if (!decoded) throw new Error();
      
      request.user = decoded;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
