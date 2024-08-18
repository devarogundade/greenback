import create from 'vue-zustand';

interface Config {
    gcoin_to_aptos: number;
}

export const useUserStore = create<Config>(() => ({
    gcoin_to_aptos: 0.0001
}));