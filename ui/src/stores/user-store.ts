import { Metric } from '@/types';
import create from 'vue-zustand';

interface User {
    unclaimedEarnings: number;
    withdrawnEarnings: number;
    donatedEarnings: number;
    cardId: string | undefined;
    aptBalance: number;
    metric: Metric | null;
}

export const useUserStore = create<User>(() => ({
    unclaimedEarnings: 0,
    withdrawnEarnings: 0,
    donatedEarnings: 0,
    cardId: undefined,
    aptBalance: 0,
    metric: null
}));