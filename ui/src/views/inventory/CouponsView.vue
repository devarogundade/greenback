<script setup lang="ts">
import Button from '@/components/buttons/Button.vue';
import MintCoupon from '@/pops/MintCoupon.vue';
import { ref, onMounted } from 'vue';
import type { TokenData } from '@/types';
import { getUserGCoupons } from '@/scripts/nodit';
import { useKeylessAccounts } from '@/scripts/keyless-accounts';
import { mintCoupon } from '@/scripts/greenback-contracts';
import { AccountAddress } from "@aptos-labs/ts-sdk";
import ProgressBox from '@/components/ProgressBox.vue';

const mintingPrompt = ref<boolean>(false);
const loading = ref(false);
const minting = ref(false);
const gcoupons = ref<TokenData[]>([]);

const getGcoupons = async (accountAddress: AccountAddress) => {
    loading.value = true;
    gcoupons.value = await getUserGCoupons(accountAddress);
    loading.value = false;
};

const mintGcoupon = async (providerId: number) => {
    const keylessAccount = useKeylessAccounts().keylessAccount?.value;
    if (!keylessAccount) return;

    minting.value = true;
    await mintCoupon(keylessAccount, providerId);

    minting.value = false;

    getGcoupons(keylessAccount.accountAddress);
};

onMounted(() => {
    const keylessAccount = useKeylessAccounts().keylessAccount?.value;
    if (!keylessAccount) return;

    getGcoupons(keylessAccount.accountAddress);
});
</script>

<template>
    <div class="coupons_view">
        <div class="coupons_header">
            <div class="coupons_title">
                <h3>Coupons</h3>
                <Button :text="minting ? 'Minting..' : 'Mint Coupon'" @click="mintingPrompt = true" />
            </div>

            <MintCoupon @close="mintingPrompt = false" @result="mintGcoupon" v-if="mintingPrompt" />
        </div>

        <div class="progress" v-if="loading">
            <ProgressBox />
        </div>

        <div class="gcoupons" v-else>
            <div class="gcoupon" v-for="gcoupon, index in gcoupons" :key="index">
                <div class="image">
                    <img :src="gcoupon.token_uri" :alt="gcoupon.token_name">
                </div>
                <div class="detail">
                    <p class="name">{{ gcoupon.token_name }}</p>
                    <p class="description">{{ gcoupon.description }}</p>
                    <a :href="`https://explorer.aptoslabs.com/token/${gcoupon.token_data_id}/0?network=testnet`">
                        <Button :text="'Redeem'">
                            <OutIcon :color="'var(--bg)'" />
                        </Button>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.coupons_view {
    padding: 140px 40px;
}

.coupons_title {
    display: flex;
    justify-content: space-between;
}

.coupons_title h3 {
    color: var(--tx-semi);
    font-size: 40px;
    font-weight: 500;
}

.progress {
    display: flex;
    justify-content: center;
    margin-top: 100px;
}

.gcoupons {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    margin-top: 30px;
}

.gcoupon {
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    width: 240px;
    background: var(--bg-darker);
}

.gcoupon .image {
    width: 100%;
    height: 200px;
}

.image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.gcoupon .detail {
    padding: 20px;
    position: relative;
}

.name {
    font-size: 18px;
    font-weight: 500;
    color: var(--tx-normal);
}

.description {
    font-size: 14px;
    font-weight: 400;
    color: var(--tx-semi);
    margin-top: 4px;
    line-clamp: 3;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.detail button {
    width: 200px;
}

.detail button:hover {
    opacity: 1;
}

.detail a {
    position: absolute;
    left: 20px;
    bottom: -40px;
    transition: .2s;
    opacity: 0;
}

.gcoupon:hover .detail a {
    opacity: 1;
    bottom: 20px;
}
</style>