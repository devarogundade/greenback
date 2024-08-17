<script setup lang="ts">
import { ref } from 'vue';
import { gnfts } from '@/scripts/data';

const gnftBalance = ref<number>(3);
</script>

<template>
    <div class="achievements_view">
        <div class="achievements_header">
            <div class="achievements_title">
                <h3>Achievements 🏆</h3>
            </div>

            <div class="gnfts">
                <div v-for="gnft, index in gnfts" :key="index"
                    :class="index < gnftBalance ? 'gnft' : 'gnft gnft_disabled'">
                    <img :src="gnft.image" :alt="gnft.name">
                    <div class="name">{{ gnft.name }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.achievements_view {
    padding: 140px 40px;
}

.achievements_title {
    display: flex;
    justify-content: space-between;
}

.achievements_title h3 {
    color: var(--tx-semi);
    font-size: 40px;
    font-weight: 500;
}

.gnfts {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    margin-top: 30px;
}

.gnft {
    width: 130px;
    height: 180px;
    border-radius: 6px;
    overflow: hidden;
    position: relative;
    cursor: pointer;
}

.gnft_disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.gnft img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.gnft .name {
    width: 100%;
    height: 100%;
    bottom: 0;
    left: 0;
    position: absolute;
    font-size: 14px;
    color: var(--bg);
    display: flex;
    align-items: flex-end;
    background: linear-gradient(to bottom, transparent, var(--tx-normal));
    padding: 10px;
}
</style>