/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Activity } from './database/schemas/activity';
import { DisposeToMachineDto } from './database/dtos/machine';
import { RequestCardDto } from './database/dtos/user';
import { Paged } from './types';
import { AptosContract } from './contracts/aptos-contract';
import { sendMail, Templates } from './mail';
import { RFIDMaker } from './rfids';

const TAKE_SIZE: number = 20;

@Injectable()
export class AppService {
  private contract: AptosContract;

  constructor(
    @InjectModel(Activity.name) private activityModel: Model<Activity>
  ) {
    this.contract = new AptosContract();
  }

  async requestCard(dto: RequestCardDto): Promise<boolean> {
    try {
      // @Todo this should be a order~delivery flow.
      // So we are hardcoding the delivery RFID card id to the user object.

      const card_id = await RFIDMaker.generateRFIDCard();
      console.log(card_id);

      const htmlBody = Templates.buildMailForCardCreate(dto.name, dto.location);
      sendMail(dto.email, 'GreenBack RFID card ordered!.', htmlBody);

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async dispose(dto: DisposeToMachineDto): Promise<boolean> {
    try {
      const user_address = dto.card_id;

      const tx_hash = await this.contract.disposeToMachine(
        dto.machine_id, user_address, dto.weight_in_gram
      );

      if (!tx_hash) {
        console.log('Failed to reward user');
        return false;
      }

      const activity: Activity = {
        _id: tx_hash,
        user_address,
        channel: dto.channel,
        reward_amount: 0,
        tx_hash: tx_hash,
        weight_in_gram: dto.weight_in_gram,
        created_at: new Date()
      };

      await this.activityModel.create(activity);
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  async getActivities(
    user_address: string,
    page: number
  ): Promise<Paged<Activity[]> | null> {
    try {
      const filter = (user_address != 'undefined') ? { user_address } : {};

      const total = await this.activityModel.countDocuments(filter);

      const data = await this.activityModel.find(filter)
        .limit(TAKE_SIZE * 1)
        .skip((page - 1) * TAKE_SIZE)
        .sort({ created_at: 'desc' })
        .exec();

      const lastPage = Math.ceil(total / TAKE_SIZE);

      return { total, lastPage, data };
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
