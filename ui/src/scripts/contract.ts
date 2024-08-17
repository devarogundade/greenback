import {
    Account,
    AccountAddress,
    Aptos,
    AptosConfig,
    Ed25519PrivateKey,
    Network,
} from "@aptos-labs/ts-sdk";
import { CONTRACT_ID } from "./constants";

const config = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(config);

export async function createUser(
    privateKey: Uint8Array
): Promise<string | null> {
    const signer = Account.fromPrivateKey(
        { privateKey: new Ed25519PrivateKey(privateKey) }
    );

    try {
        const transaction = await aptos.transaction.build.simple({
            sender: signer.accountAddress,
            data: {
                function: `${CONTRACT_ID}::greenback::create_user`,
                functionArguments: []
            },
        });

        const { hash: tx_hash } = await aptos.signAndSubmitTransaction({
            signer, transaction
        });

        return tx_hash;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function claimEarnings(
    privateKey: Uint8Array,
    amount: string
): Promise<string | null> {
    const signer = Account.fromPrivateKey(
        { privateKey: new Ed25519PrivateKey(privateKey) }
    );

    try {
        const transaction = await aptos.transaction.build.simple({
            sender: signer.accountAddress,
            data: {
                function: `${CONTRACT_ID}::greenback::claim_earnings`,
                functionArguments: [
                    amount
                ]
            },
        });

        const { hash: tx_hash } = await aptos.signAndSubmitTransaction({
            signer, transaction
        });

        return tx_hash;
    } catch (error) {
        console.log(error);
        return null;
    }
}


export async function mintCoupon(
    privateKey: Uint8Array,
    couponId: number,
    amount: number
): Promise<string | null> {
    const signer = Account.fromPrivateKey(
        { privateKey: new Ed25519PrivateKey(privateKey) }
    );

    try {
        const transaction = await aptos.transaction.build.simple({
            sender: signer.accountAddress,
            data: {
                function: `${CONTRACT_ID}::greenback::mint_coupon`,
                functionArguments: [
                    couponId,
                    amount
                ]
            },
        });

        const { hash: tx_hash } = await aptos.signAndSubmitTransaction({
            signer, transaction
        });

        return tx_hash;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function createProposal(
    privateKey: Uint8Array,
    daoAddress: string,
    title: string,
    description: string,
    image: string,
    proposed_amount: number,
    start_time_sec: number
): Promise<string | null> {
    const signer = Account.fromPrivateKey(
        { privateKey: new Ed25519PrivateKey(privateKey) }
    );

    const daoAccountAddress = AccountAddress.fromString(daoAddress);

    try {
        const transaction = await aptos.transaction.build.simple({
            sender: signer.accountAddress,
            data: {
                function: `${CONTRACT_ID}::donation_dao::create_proposal`,
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
            signer, transaction
        });

        return tx_hash;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function vote(
    privateKey: Uint8Array,
    daoAddress: string,
    proposalId: number,
    vote: boolean
): Promise<string | null> {
    const signer = Account.fromPrivateKey(
        { privateKey: new Ed25519PrivateKey(privateKey) }
    );

    const daoAccountAddress = AccountAddress.fromString(daoAddress);

    try {
        const transaction = await aptos.transaction.build.simple({
            sender: signer.accountAddress,
            data: {
                function: `${CONTRACT_ID}::donation_dao::vote`,
                functionArguments: [
                    daoAccountAddress,
                    proposalId,
                    vote
                ]
            },
        });

        const { hash: tx_hash } = await aptos.signAndSubmitTransaction({
            signer, transaction
        });

        return tx_hash;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function donate(
    privateKey: Uint8Array,
    daoAddress: string,
    amount: number
): Promise<string | null> {
    const signer = Account.fromPrivateKey(
        { privateKey: new Ed25519PrivateKey(privateKey) }
    );

    const daoAccountAddress = AccountAddress.fromString(daoAddress);

    try {
        const transaction = await aptos.transaction.build.simple({
            sender: signer.accountAddress,
            data: {
                function: `${CONTRACT_ID}::donation_dao::donate`,
                functionArguments: [
                    daoAccountAddress,
                    amount
                ]
            },
        });

        const { hash: tx_hash } = await aptos.signAndSubmitTransaction({
            signer, transaction
        });

        return tx_hash;
    } catch (error) {
        console.log(error);
        return null;
    }
}