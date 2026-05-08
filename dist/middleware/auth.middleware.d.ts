import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FirebaseService } from '../auth/firebase.service';
export declare class AuthMiddleware implements NestMiddleware {
    private readonly firebaseService;
    constructor(firebaseService: FirebaseService);
    use(req: Request, res: Response, next: NextFunction): Promise<void>;
}
