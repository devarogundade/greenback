import { daoAddresses } from './data';
import {
    AccountAddress,
    KeylessAccount,
} from "@aptos-labs/ts-sdk";
import { aptos, VITE_CONTRACT_ID } from "./constants";
import type { DAO, Proposal } from "@/types";

export async function createUser(keylessAccount: KeylessAccount): Promise<string | null> {
    try {
        const transaction = await aptos.transaction.build.simple({
            sender: keylessAccount.accountAddress,
            data: {
                function: `${VITE_CONTRACT_ID}::main::create_user`,
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
                function: `${VITE_CONTRACT_ID}::main::claim_earnings`,
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
                function: `${VITE_CONTRACT_ID}::main::mint_coupon`,
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

export async function donateDAO(
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
        return await aptos.view({
            payload: {
                function: `${VITE_CONTRACT_ID}::main::get_user`,
                functionArguments: [address]
            },
        });
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function getDAOs(daoAddresses: string[]): Promise<DAO[]> {
    const promises: Promise<DAO | null>[] = [];

    daoAddresses.forEach(daoAddress => promises.push(
        unpackDAO(daoAddress)
    ));

    const daos = await Promise.all(promises);
    return daos.filter(dao => dao != null);
}

export async function getDAOProposals(
    daoAddress: string,
    proposalIds: number[]
): Promise<Proposal[]> {
    try {
        const promises: Promise<Proposal | null>[] = [];

        proposalIds.forEach(proposalId => promises.push(
            unpackProposal(daoAddress, proposalId)
        ));

        const proposals = await Promise.all(promises);
        return proposals.filter(proposal => proposal != null);
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function unpackProposal(
    daoAddress: string,
    proposalId: number
): Promise<Proposal | null> {
    try {
        const response = (await aptos.view({
            payload: {
                function: `${VITE_CONTRACT_ID}::dao::unpack_proposal`,
                functionArguments: [proposalId, daoAddress]
            },
        }));

        const proposal: Proposal = {
            // @ts-ignore
            title: response[0],
            // @ts-ignore
            description: response[1],
            // @ts-ignore
            image: response[2],
            // @ts-ignore
            proposedAmount: response[3],
            // @ts-ignore
            startTimeSec: response[4],
            // @ts-ignore
            resolution: response[5],
            // @ts-ignore
            finalYesVotes: response[6],
            // @ts-ignore
            finalNoVotes: response[7]
        };

        return proposal;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function unpackDAO(daoAddress: string): Promise<DAO | null> {
    try {
        const response = (await aptos.view({
            payload: {
                function: `${VITE_CONTRACT_ID}::dao::unpack_dao`,
                functionArguments: [daoAddress]
            },
        }));

        const dao: DAO = {
            // @ts-ignore
            name: response[0],
            // @ts-ignore
            availableAmount: response[1],
            // @ts-ignore
            raisedAmount: response[2],
            // @ts-ignore
            resolveThreshold: response[3],
            // @ts-ignore
            votingDuration: response[4],
            // @ts-ignore
            minRequiredProposerVotingPower: response[5],
            // @ts-ignore
            nextProposalId: response[6],
            daoAddress
        };

        return dao;
    } catch (error) {
        console.log(error);
        return null;
    }
}