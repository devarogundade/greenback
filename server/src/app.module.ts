/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MainGateway } from './database/scokets/main/main.gateway';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Activity, ActivitySchema } from './database/schemas/activity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URL),
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema }
    ])
  ],
  controllers: [AppController],
  providers: [AppService, MainGateway],
})
export class AppModule { }
