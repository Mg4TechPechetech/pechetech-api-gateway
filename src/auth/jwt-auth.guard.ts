import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Missing Authorization Header');
    }

    const token = authHeader.split(' ')[1];
    try {
      const decodedToken = await this.firebaseService.verifyToken(token);
      request.user = {
        userId: decodedToken.uid,
        email: decodedToken.email,
        // We can map more fields or fetch user from DB here
      };
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid Firebase Token');
    }
  }
}

