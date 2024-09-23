import type { Activity, Metric, Paged, RequestCardForm } from '@/types';
import type { AccountAddress } from '@aptos-labs/ts-sdk';
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL
});

export async function getMetrics(
    userAddress: AccountAddress
): Promise<Metric | null> {
    try {
        const response = await api.get(`/metrics?=user_address=${userAddress.toString()}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export async function requestCard(
    form: RequestCardForm
): Promise<boolean> {
    try {
        const response = await api.post(`/request-card`, form);
        return response.data;
    } catch (error) {
        console.log(error);
        return false;
    }
};

export async function getUserActivities(
    accountAddress: AccountAddress,
    cardId: string | undefined,
    page: number
): Promise<Paged<Activity[]> | null> {
    try {
        const userAddress = accountAddress.toString();
        const response = await api.get(`/activities?user_address=${userAddress}&card_id=${cardId}&page=${page}`);
        return response.data;
    } catch (error) {
        console.log(error);
        return null;
    }
};