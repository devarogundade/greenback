/* eslint-disable prettier/prettier */

export enum DisposeChannel {
    RFID,
    QrScan
}

export type Paged<T> = {
    total: number,
    lastPage: number;
    data?: T;
};