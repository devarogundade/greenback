/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestCardDto } from './database/dtos/user';
import { DisposeToMachineDto, DisposeToMachineViaCardDto } from './database/dtos/machine';
import { Activity } from './database/schemas/activity';
import { Paged } from './types';
import { MintGNftDto } from './database/dtos/gnft';
import { MintGCouponDto } from './database/dtos/gcoupon';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/request-card')
  requestCard(@Body() dto: RequestCardDto): Promise<string | null> {
    return this.appService.requestCard(dto);
  }

  @Post('/dispose-to-machine')
  dispose(@Body() dto: DisposeToMachineDto): Promise<string | null> {
    return this.appService.dispose(dto);
  }

  @Post('/dispose-to-machine-via-card')
  disposeViaCard(@Body() dto: DisposeToMachineViaCardDto): Promise<string | null> {
    return this.appService.disposeViaCard(dto);
  }

  @Post('/mint-gnft-to-user')
  mintGNftToUser(@Body() dto: MintGNftDto): Promise<string | null> {
    return this.appService.mintGNftToUser(dto);
  }

  @Post('/mint-gcoupon-to-user')
  mintGCouponToUser(@Body() dto: MintGCouponDto): Promise<string | null> {
    return this.appService.mintGCouponToUser(dto);
  }

  @Get('/activities')
  getActivities(
    @Query('user_address') user_address: string,
    @Query('card_id') card_id: string | undefined,
    @Query('page') page: number = 1
  ): Promise<Paged<Activity[]> | null> {
    return this.appService.getActivities(user_address, card_id, page);
  }
}
