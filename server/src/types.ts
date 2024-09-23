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

export type Metric = {
    0: MetricData;
    1: MetricData;
    2: MetricData;
    3: MetricData;
    4: MetricData;
    5: MetricData;
    6: MetricData;
};