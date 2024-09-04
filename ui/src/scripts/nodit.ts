import { GNFT, GCOUPON } from "@/types";
import { AccountAddress } from "@aptos-labs/ts-sdk";

export async function getUserGNFTs(
    accountAddress: AccountAddress
): Promise<GNFT[]> {
    return [];
}

export async function getUserGCoupons(
    accountAddress: AccountAddress
): Promise<GCOUPON[]> {
    return [];
}