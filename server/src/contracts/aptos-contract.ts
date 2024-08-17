/* eslint-disable prettier/prettier */

import {
    Account,
    AccountAddress,
    Aptos,
    AptosConfig,
    Ed25519PrivateKey,
    Network,
} from "@aptos-labs/ts-sdk";

export class AptosContract {
    private signer: Account;
    private config: AptosConfig;

    constructor() {
        const privateKey = new Ed25519PrivateKey(process.env.PRIVATE_KEY);
        this.signer = Account.fromPrivateKey({ privateKey });

        this.config = new AptosConfig({ network: Network.TESTNET });
    }

    async disposeToMachine(
        machineId: number,
        userAddress: string,
        totalGram: number
    ): Promise<string | null> {
        try {
            const aptos = new Aptos(this.config);

            const userAccountAddress = AccountAddress.fromString(userAddress);

            const transaction = await aptos.transaction.build.simple({
                sender: this.signer.accountAddress,
                data: {
                    function: `${process.env.CONTRACT_ID}::greenback::dispose_to_machine`,
                    functionArguments: [
                        userAccountAddress,
                        machineId,
                        totalGram
                    ]
                },
            });

            const { hash: tx_hash } = await aptos.signAndSubmitTransaction({
                signer: this.signer,
                transaction
            });

            return tx_hash;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    async mintGnftToUser(
        userAddress: string,
        amount: number
    ): Promise<string | null> {
        try {
            const aptos = new Aptos(this.config);

            const userAccountAddress = AccountAddress.fromString(userAddress);

            const transaction = await aptos.transaction.build.simple({
                sender: this.signer.accountAddress,
                data: {
                    function: `${process.env.CONTRACT_ID}::greenback::mint_gnft_to_user`,
                    functionArguments: [
                        userAccountAddress,
                        amount
                    ]
                },
            });

            const { hash: tx_hash } = await aptos.signAndSubmitTransaction({
                signer: this.signer,
                transaction
            });

            return tx_hash;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}