import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Module({
  providers: [FirebaseService, JwtAuthGuard],
  exports: [FirebaseService, JwtAuthGuard],
})
export class AuthModule {}
