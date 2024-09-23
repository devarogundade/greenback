<script setup lang="ts">
import CloseIcon from '@/components/icons/CloseIcon.vue';
import GcoinIcon from '@/components/icons/GcoinIcon.vue';
import Button from '@/components/buttons/Button.vue';
import { fromAptosUnits } from '@/scripts/utils';
import { couponProviders } from '@/scripts/data';
import { ref } from 'vue';

const emit = defineEmits([
    'close', 'result'
]);

const activeProvider = ref(1);
</script>

<template>
    <div class="mint_coupon_container">
        <div class="close" @click="$emit('close')">
            <CloseIcon />
        </div>
        <div class="mint_coupon_box">
            <div class="title">
                <h3>Mint Coupon</h3>
            </div>

            <div class="options">
                <div class="providers">
                    <div v-for="provider in couponProviders" :key="provider.id"
                        :class="`provider ${activeProvider == provider.id ? 'provider_active' : ''}`"
                        @click="activeProvider = provider.id">
                        <div class="provider_name">
                            <img :src="provider.image" alt="">
                            <p>{{ provider.name }}</p>
                        </div>
                        <p class="provider_description">{{ provider.description }}</p>
                        <div class="provider_cost">
                            <GcoinIcon />
                            <p>{{ fromAptosUnits(provider.cost) }}</p>
                        </div>
                    </div>
                </div>

            </div>

            <div class="action">
                <Button :text="'Mint'" @click="emit('result', activeProvider)" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.mint_coupon_container {
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(225, 225, 225, 0.4);
    backdrop-filter: blur(2px);
}

.mint_coupon_box {
    width: 400px;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.2);
    background: var(--bg);
}

.title {
    height: 55px;
    border-bottom: 1px solid var(--bg-darkest);
    display: flex;
    align-items: center;
    padding: 0 20px;
}

.title h3 {
    color: var(--tx-normal);
    font-size: 16px;
    font-weight: 500;
}

.close {
    position: absolute;
    right: 20px;
    top: 20px;
    width: 40px;
    height: 40px;
    border-radius: 20px;
    background: var(--bg-darkest);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.options {
    padding: 20px;
    overflow: auto;
    height: 400px;
}

.providers {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.provider {
    background: var(--bg-dark);
    border: 1px solid var(--bg-darkest);
    padding: 10px;
    border-radius: 6px;
    cursor: pointer;
    transition: .2s;
    user-select: none;
}

.provider_active {
    border: 1px solid var(--primary);
}

.provider_name {
    display: flex;
    gap: 8px;
    align-items: center;
}

.provider_name img {
    width: 30px;
    height: 30px;
    border-radius: 4px;
    object-fit: cover;
}

.provider_name p {
    font-size: 16px;
    color: var(--tx-semi);
    font-weight: 500;
}

.provider_description {
    font-size: 12px;
    color: var(--tx-dimmed);
    margin-top: 4px;
}

.provider_cost {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 8px;
}

.provider_cost svg {
    width: 16px;
    height: 16px;
}

.provider_cost p {
    font-weight: 600;
    font-size: 14px;
    color: var(--primary-dark);
}

.action {
    display: flex;
    justify-content: center;
    padding: 10px 0;
}

.close svg {
    width: 30px;
    height: 30px;
}

.action button {
    width: 200px;
}
</style>