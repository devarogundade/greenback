/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestCardDto } from './database/dtos/user';
import { DisposeToMachineDto } from './database/dtos/machine';
import { Activity } from './database/schemas/activity';
import { Paged } from './types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('/create-card')
  createCard(@Body() dto: RequestCardDto): Promise<boolean> {
    return this.appService.requestCard(dto);
  }

  @Post('/dispose-to-machine')
  dispose(@Body() dto: DisposeToMachineDto): Promise<boolean> {
    return this.appService.dispose(dto);
  }

  @Get('/activities')
  getActivities(
    @Query('user_address') user_address: string,
    @Query('page') page: number = 1
  ): Promise<Paged<Activity[]> | null> {
    return this.appService.getActivities(user_address, page);
  }
}
