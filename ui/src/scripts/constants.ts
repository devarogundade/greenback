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

export const GCOIN_ID = '0x6f400ec376445212e5382b3aab9b168ce47349b1369766963dea8b05c13538da';
export const GNFT_ID: string = `0x248f96a8bc776d2035e9db97225948ee9600f4cc2acdc02268b5a9b2e59408b3`;
export const GCOUPON_ID: string = `0x9c2697ef144a85d4377f3c706369df66e2e8366f476cf3ab58a3acbb7699517d`;
