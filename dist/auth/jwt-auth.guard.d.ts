import { CanActivate, ExecutionContext } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
export declare class JwtAuthGuard implements CanActivate {
    private readonly firebaseService;
    constructor(firebaseService: FirebaseService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
