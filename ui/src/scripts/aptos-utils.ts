import type { AccountAddress } from "@aptos-labs/ts-sdk";
import { testnetClient } from "./constants";

export async function fundAccount(
    accountAddress: AccountAddress,
    amount: number
): Promise<string | null> {
    try {
        const { hash: tx_hash } = await testnetClient.fundAccount({
            accountAddress,
            amount
        });

        return tx_hash;
    } catch (error) {
        console.log(error);
        return null;
    }
};

export async function getAccountAPTAmount(
    accountAddress: AccountAddress
): Promise<number> {
    try {
        const balance = await testnetClient.getAccountAPTAmount({
            accountAddress
        });

        return balance;
    } catch (error) {
        console.log(error);
        return 0;
    }
};