import create from 'vue-zustand';

interface User {
    unclaimed_earnings: number;
    withdrawn_earnings: number;
    donated_earnings: number;
    card_id: string | undefined;
    apt_balance: number;
}

export const useUserStore = create<User>(() => ({
    unclaimed_earnings: 0,
    withdrawn_earnings: 0,
    donated_earnings: 0,
    card_id: undefined,
    apt_balance: 0
}));