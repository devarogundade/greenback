import create from 'vue-zustand';

interface User {
    unclaimedEarnings: number;
    withdrawnEarnings: number;
    donatedEarnings: number;
    cardId: string | undefined;
    aptBalance: number;
}

export const useUserStore = create<User>(() => ({
    unclaimedEarnings: 0,
    withdrawnEarnings: 0,
    donatedEarnings: 0,
    cardId: undefined,
    aptBalance: 0
}));