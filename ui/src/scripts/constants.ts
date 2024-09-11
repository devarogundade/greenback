import { Aptos, AptosConfig, Network, } from "@aptos-labs/ts-sdk";

export const LocalStorageKeys = {
    keylessAccounts: "@aptos-connect/keyless-accounts",
};

export const aptos = new Aptos(
    new AptosConfig({ network: Network.TESTNET })
);

export const FAUCET_AMOUNT = 100_000_000;
export const MIN_FAUCET_AMOUNT = 1_000_000;
export const VITE_CONTRACT_ID = import.meta.env.VITE_CONTRACT_ID;

export const GCOIN_ID = '0x430e19a79440f3be880908f1ff8cdbb151d3268a83bec17cfc4d8ad921d05c6f';
export const GNFT_ID: string = `0xe48976834ed21101531cf45daad8fdacf9dad01adec6a34397059798e2cb9819`;
export const GCOUPON_ID: string = `0x1ff92aad5e81dbf3093a54e659416816dd50a97766a3b7ea4137e085da0b4c17`;
