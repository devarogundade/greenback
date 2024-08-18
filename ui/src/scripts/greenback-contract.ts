import {
    Account,
    AccountAddress,
    Aptos,
    AptosConfig,
    Ed25519PrivateKey,
    KeylessAccount,
    Network,
} from "@aptos-labs/ts-sdk";
import { testnetClient, VITE_CONTRACT_ID } from "./constants";

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

export async function createUser(keylessAccount: KeylessAccount): Promise<string | null> {
    try {
        const transaction = await aptos.transaction.build.simple({
            sender: keylessAccount.accountAddress,
            data: {
                function: `${VITE_CONTRACT_ID}::greenback::create_user`,
                functionArguments: []
            },
        });

        const { hash: tx_hash } = await aptos.signAndSubmitTransaction({
            signer: keylessAccount,
            transaction
        });

        return tx_hash;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function claimEarnings(
    keylessAccount: KeylessAccount,
    amount: string
): Promise<string | null> {
    try {
        const transaction = await aptos.transaction.build.simple({
            sender: keylessAccount.accountAddress,
            data: {
                function: `${VITE_CONTRACT_ID}::greenback::claim_earnings`,
                functionArguments: [
                    amount
                ]
            },
        });

        const { hash: tx_hash } = await aptos.signAndSubmitTransaction({
            signer: keylessAccount,
            transaction
        });

        return tx_hash;
    } catch (error) {
        console.log(error);
        return null;
    }
}


export async function mintCoupon(
    keylessAccount: KeylessAccount,
    couponId: number,
    amount: number
): Promise<string | null> {
    try {
        const transaction = await aptos.transaction.build.simple({
            sender: keylessAccount.accountAddress,
            data: {
                function: `${VITE_CONTRACT_ID}::greenback::mint_coupon`,
                functionArguments: [
                    couponId,
                    amount
                ]
            },
        });

        const { hash: tx_hash } = await aptos.signAndSubmitTransaction({
            signer: keylessAccount,
            transaction
        });

        return tx_hash;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function createProposal(
    keylessAccount: KeylessAccount,
    daoAddress: string,
    title: string,
    description: string,
    image: string,
    proposed_amount: number,
    start_time_sec: number
): Promise<string | null> {
    const daoAccountAddress = AccountAddress.fromString(daoAddress);

    try {
        const transaction = await aptos.transaction.build.simple({
            sender: keylessAccount.accountAddress,
            data: {
                function: `${VITE_CONTRACT_ID}::dao::create_proposal`,
                functionArguments: [
                    daoAccountAddress,
                    title,
                    description,
                    image,
                    proposed_amount,
                    start_time_sec
                ]
            },
        });

        const { hash: tx_hash } = await aptos.signAndSubmitTransaction({
            signer: keylessAccount,
            transaction
        });

        return tx_hash;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function vote(
    keylessAccount: KeylessAccount,
    daoAddress: string,
    proposalId: number,
    vote: boolean
): Promise<string | null> {
    const daoAccountAddress = AccountAddress.fromString(daoAddress);

    try {
        const transaction = await aptos.transaction.build.simple({
            sender: keylessAccount.accountAddress,
            data: {
                function: `${VITE_CONTRACT_ID}::dao::vote`,
                functionArguments: [
                    daoAccountAddress,
                    proposalId,
                    vote
                ]
            },
        });

        const { hash: tx_hash } = await aptos.signAndSubmitTransaction({
            signer: keylessAccount,
            transaction
        });

        return tx_hash;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function donate(
    keylessAccount: KeylessAccount,
    daoAddress: string,
    amount: number
): Promise<string | null> {
    const daoAccountAddress = AccountAddress.fromString(daoAddress);

    try {
        const transaction = await aptos.transaction.build.simple({
            sender: keylessAccount.accountAddress,
            data: {
                function: `${VITE_CONTRACT_ID}::dao::donate`,
                functionArguments: [
                    daoAccountAddress,
                    amount
                ]
            },
        });

        const { hash: tx_hash } = await aptos.signAndSubmitTransaction({
            signer: keylessAccount,
            transaction
        });

        return tx_hash;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getUserAccount(address: AccountAddress): Promise<any> {
    try {
        const userResponse = (await testnetClient.view({
            payload: {
                function: `${VITE_CONTRACT_ID}::greenback::get_user`,
                functionArguments: [address]
            },
        }));

        return userResponse[0];
    } catch (error) {
        console.log(error);
        return null;
    }
}