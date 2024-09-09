/* eslint-disable prettier/prettier */

import { DisposeChannel } from "src/types";
export interface DisposeToMachineViaCardDto extends BaseDisposeToMachineDto {
    card_id: string;
    channel: DisposeChannel;
}
export interface DisposeToMachineDto extends BaseDisposeToMachineDto {
    user_address: string;
    channel: DisposeChannel;
}

interface BaseDisposeToMachineDto {
    machine_id: number;
    weight_in_gram: number;
}