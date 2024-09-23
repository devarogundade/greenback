/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Activity } from './database/schemas/activity';
import { DisposeToMachineDto, DisposeToMachineViaCardDto } from './database/dtos/machine';
import { RequestCardDto } from './database/dtos/user';
import { Metric, Paged } from './types';
import { GreenbackContract } from './contracts/greenback-contract';
import { sendMail, Templates } from './mail';
import { RFIDMaker } from './rfids';
import { MintGNftDto } from './database/dtos/gnft';
import { MintGCouponDto } from './database/dtos/gcoupon';
import * as moment from 'moment';

const TAKE_SIZE: number = 10;

@Injectable()
export class AppService {
  private contract: GreenbackContract;

  constructor(
    @InjectModel(Activity.name) private activityModel: Model<Activity>
  ) {
    this.contract = new GreenbackContract();
  }

  async metrics(user_address: string): Promise<Metric | null> {
    try {
      const activities = await this.activityModel.aggregate([
        { $match: { user_address } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
            value: { $sum: 1 },
            date: { $first: "$created_at" }
          }
        },
        { $sort: { date: -1 } },
        { $limit: 7 },
      ]);

      // Start with today's date and go back 7 days
      const metric: Metric = [];
      const today = moment().startOf('day');

      for (let i = 0; i < 7; i++) {
        const currentDate = today.clone().subtract(i, 'days').toDate();

        // Check if we have an activity for this date
        const activityForDate = activities.find(
          activity => moment(activity.date).isSame(currentDate, 'day')
        );

        // If activity exists for the date, use it; otherwise, pad with zeros
        if (activityForDate) {
          metric.push({
            value: activityForDate.value,
            date: activityForDate.date,
          });
        } else {
          metric.push({
            value: 0,  // Padding with zero
            date: currentDate,   // The date we're padding for
          });
        }
      }

      return metric;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async requestCard(dto: RequestCardDto): Promise<string | null> {
    try {
      // @Todo this should be a order~delivery flow.
      // So we are hardcoding the delivery RFID card id to the user object.

      const card_id = await RFIDMaker.generateRFIDCard();

      const tx_hash = await this.contract.updateUserCard(
        dto.user_address,
        card_id
      );

      if (!tx_hash) return null;

      const htmlBody = Templates.buildMailForCardCreate(dto.name, dto.location, tx_hash);
      sendMail(dto.email, 'GreenBack RFID card sent out!.', htmlBody);

      return tx_hash;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async dispose(dto: DisposeToMachineDto): Promise<string | null> {
    try {
      const user_address = dto.user_address;

      const tx_hash = await this.contract.disposeToMachine(
        dto.machine_id,
        user_address,
        dto.weight_in_gram
      );

      if (!tx_hash) {
        console.log('Failed to reward user');
        return null;
      }

      const activity: Activity = {
        user_address,
        card_id: undefined,
        channel: dto.channel,
        reward_amount: 0,
        tx_hash: tx_hash,
        weight_in_gram: dto.weight_in_gram,
        created_at: new Date()
      };

      await this.activityModel.create(activity);

      return tx_hash;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async disposeViaCard(dto: DisposeToMachineViaCardDto): Promise<string | null> {
    try {
      const card_id = dto.card_id;

      const tx_hash = await this.contract.disposeToMachineViaRFIDCard(
        dto.machine_id,
        card_id,
        dto.weight_in_gram
      );

      if (!tx_hash) {
        console.log('Failed to reward user');
        return null;
      }

      const activity: Activity = {
        user_address: undefined,
        card_id,
        channel: dto.channel,
        reward_amount: 0,
        tx_hash: tx_hash,
        weight_in_gram: dto.weight_in_gram,
        created_at: new Date()
      };

      await this.activityModel.create(activity);

      return tx_hash;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async mintGNftToUser(dto: MintGNftDto): Promise<string | null> {
    try {
      return await this.contract.mintGNftToUser(
        dto.description,
        dto.name,
        dto.tokenURI,
        dto.userAddress
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async mintGCouponToUser(dto: MintGCouponDto): Promise<string | null> {
    try {
      return await this.contract.mintGCouponToUser(
        dto.description,
        dto.name,
        dto.tokenURI,
        dto.userAddress
      );
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getActivities(
    user_address: string,
    card_id: string | undefined,
    page: number
  ): Promise<Paged<Activity[]> | null> {
    try {
      const filter: FilterQuery<Activity> = {
        $or: [{ user_address }, { card_id }]
      };

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
