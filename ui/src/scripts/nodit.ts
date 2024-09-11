import { TokenData, CurrentTokenOwnershipV2 } from "@/types";
import { AccountAddress } from "@aptos-labs/ts-sdk";
import axios from 'axios';
import { GCOUPON_ID, GNFT_ID } from "./constants";

const client = axios.create({
    baseURL: `https://api.testnet.aptoslabs.com/v1/graphql`,
    // baseURL: `https://aptos-testnet.nodit.io/${import.meta.env.VITE_NODIT_KEY}/v1/graphql`,
});

export async function getUserGNFTs(
    accountAddress: AccountAddress
): Promise<TokenData[]> {
    try {
        const response = await client.post('/', {
            query: `{
                current_token_ownerships_v2(
                    where: {owner_address: {_eq: "${accountAddress.toString()}"}, current_token_data: {collection_id: {_eq: "${GNFT_ID}"}}},
                    order_by: {amount: desc}
                ) {
                    current_token_data {
                        collection_id
                        token_name
                        description
                        token_uri
                        token_data_id
                    }
                    amount
                }
            }`
        });

        const tokens = response.data.data.current_token_ownerships_v2 as CurrentTokenOwnershipV2[];

        return tokens.map(token => token.current_token_data);
    } catch (error) {
        console.log(error);
        return [];
    }
}

export async function getUserGCoupons(
    accountAddress: AccountAddress
): Promise<TokenData[]> {
    try {
        const response = await client.post('/', {
            query: `{
                current_token_ownerships_v2(
                    where: {owner_address: {_eq: "${accountAddress.toString()}"}, current_token_data: {collection_id: {_eq: "${GCOUPON_ID}"}}},
                    order_by: {amount: desc}
                ) {
                    current_token_data {
                        collection_id
                        token_name
                        description
                        token_uri
                    }
                    amount
                }
            }`
        });

        const tokens = response.data.data.current_token_ownerships_v2 as CurrentTokenOwnershipV2[];

        return tokens.map(token => token.current_token_data);
    } catch (error) {
        console.log(error);
        return [];
    }
}