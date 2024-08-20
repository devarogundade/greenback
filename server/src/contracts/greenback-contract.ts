/* eslint-disable prettier/prettier */

import {
    Account,
    AccountAddress,
    Aptos,
    AptosConfig,
    Network,
} from "@aptos-labs/ts-sdk";

export class GreenbackContract {
    private signer: Account;
    private config: AptosConfig;

    constructor() {
        this.signer = Account.fromDerivationPath({
            path: process.env.MNEMONIC_PATH,
            mnemonic: process.env.MNEMONIC
        });

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
                    function: `${process.env.CONTRACT_ID}::main::dispose_to_machine`,
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

    async updateUserCard(
        userAddress: string,
        cardId: string
    ): Promise<string | null> {
        try {
            const aptos = new Aptos(this.config);

            const userAccountAddress = AccountAddress.fromString(userAddress);

            const transaction = await aptos.transaction.build.simple({
                sender: this.signer.accountAddress,
                data: {
                    function: `${process.env.CONTRACT_ID}::main::update_user_card`,
                    functionArguments: [
                        userAccountAddress,
                        cardId
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