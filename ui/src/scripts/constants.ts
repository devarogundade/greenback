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