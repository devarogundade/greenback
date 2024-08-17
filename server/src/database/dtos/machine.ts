/* eslint-disable prettier/prettier */

import { DisposeChannel } from "src/types";

export interface DisposeToMachineDto {
    card_id: string;
    machine_id: number;
    channel: DisposeChannel,
    weight_in_gram: number;
}