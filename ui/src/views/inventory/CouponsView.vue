<script setup lang="ts">
import Button from '@/components/buttons/Button.vue';
import MintCoupon from '@/pops/MintCoupon.vue';
import { ref } from 'vue';

const mintingPrompt = ref<boolean>(false);
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