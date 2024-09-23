/* eslint-disable prettier/prettier */

export type DisposeChannel = 'RFID' | 'QrScan';

export type Paged<T> = {
    total: number,
    lastPage: number;
    data?: T;
};

type MetricData = {
    value: number;
    date: Date;
};

export type Metric = MetricData[];