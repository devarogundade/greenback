/* eslint-disable prettier/prettier */

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { DisposeChannel } from 'src/types';

export type ActivityDocument = HydratedDocument<Activity>;
@Schema()
export class Activity {
    @Prop({ required: false })
    user_address: string | undefined;

    @Prop({ required: false })
    card_id: string | undefined;

    @Prop({ required: true })
    weight_in_gram: number;

    @Prop({ required: true })
    channel: DisposeChannel;

    @Prop({ required: true })
    reward_amount: number;

    @Prop({ required: true })
    tx_hash: string;

    @Prop({ required: true })
    created_at: Date;
};

export const ActivitySchema = SchemaFactory.createForClass(Activity);