<script setup lang="ts">
import Button from '@/components/buttons/Button.vue';
import MintCoupon from '@/pops/MintCoupon.vue';
import { ref, onMounted } from 'vue';
import type { GCOUPON } from '@/types';
import { getUserGCoupons } from '@/scripts/nodit';
import { useKeylessAccounts } from '@/scripts/keyless-accounts';
import { AccountAddress } from "@aptos-labs/ts-sdk";

const mintingPrompt = ref<boolean>(false);

const gcoupons = ref<GCOUPON[]>([]);

const getGNFTs = async (accountAddress: AccountAddress) => {
    gcoupons.value = await getUserGCoupons(accountAddress);
};

onMounted(() => {
    const keylessAccount = useKeylessAccounts().keylessAccount?.value;
    if (!keylessAccount) return;

    getGNFTs(keylessAccount.accountAddress);
});
</script>

<template>
    <div class="coupons_view">
        <div class="coupons_header">
            <div class="coupons_title">
                <h3>Coupons</h3>
                <Button :text="'Mint Coupon'" @click="mintingPrompt = true" />
            </div>
        </div>

        <MintCoupon @close="mintingPrompt = false" v-if="mintingPrompt" />
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
</style>