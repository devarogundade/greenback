/* eslint-disable prettier/prettier */

import { DisposeChannel } from "src/types";

export interface DisposeToMachineDto {
    user_address_or_card_id: string;
    machine_id: number;
    channel: DisposeChannel,
    weight_in_gram: number;
}