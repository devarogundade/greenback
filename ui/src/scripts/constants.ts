import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

export const LocalStorageKeys = {
    keylessAccounts: "@aptos-connect/keyless-accounts",
};

export const testnetClient = new Aptos(
    new AptosConfig({ network: Network.TESTNET })
);

export const CONTRACT_ID = '';