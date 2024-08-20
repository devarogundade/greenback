/* eslint-disable prettier/prettier */

export type DisposeChannel = 'RFID' | 'QrScan';


export type Paged<T> = {
    total: number,
    lastPage: number;
    data?: T;
};