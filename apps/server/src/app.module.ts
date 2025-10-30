
import { configDotenv } from 'dotenv';
configDotenv();
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI_DEV),
    AuthModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
