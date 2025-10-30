import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller.http';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AuthControllerMessage } from './auth.controller.message';



@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || "3d" },
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController, AuthControllerMessage],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule { }
