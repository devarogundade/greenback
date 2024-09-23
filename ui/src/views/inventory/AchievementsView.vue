<script setup lang="ts">
import Button from '@/components/buttons/Button.vue';
import { ref, onMounted } from 'vue';
import type { TokenData } from '@/types';
import { getUserGNFTs } from '@/scripts/nodit';
import { useKeylessAccounts } from '@/scripts/keyless-accounts';
import { AccountAddress } from "@aptos-labs/ts-sdk";
import OutIcon from '@/components/icons/OutIcon.vue';
import ProgressBox from '@/components/ProgressBox.vue';

const loading = ref(false);
const gnfts = ref<TokenData[]>([]);

const getGNFTs = async (accountAddress: AccountAddress) => {
    loading.value = true;
    gnfts.value = await getUserGNFTs(accountAddress);
    loading.value = false;
};

onMounted(() => {
    const keylessAccount = useKeylessAccounts().keylessAccount?.value;
    if (!keylessAccount) return;

    getGNFTs(keylessAccount.accountAddress);
});
</script>

<template>
    <div class="achievements_view">
        <div class="achievements_header">
            <div class="achievements_title">
                <h3>Achievements 🏆</h3>
            </div>
        </div>

        <div class="progress" v-if="loading">
            <ProgressBox />
        </div>

        <div class="gnfts" v-else>
            <div class="gnft" v-for="gnft, index in gnfts" :key="index">
                <div class="image">
                    <img :src="gnft.token_uri" :alt="gnft.token_name">
                </div>
                <div class="detail">
                    <p class="name">{{ gnft.token_name }}</p>
                    <p class="description">{{ gnft.description }}</p>
                    <a :href="`https://explorer.aptoslabs.com/token/${gnft.token_data_id}/0?network=testnet`">
                        <Button :text="'View'">
                            <OutIcon :color="'var(--bg)'" />
                        </Button>
                    </a>
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

.progress {
    display: flex;
    justify-content: center;
    margin-top: 100px;
}

.gnfts {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    margin-top: 30px;
}

.gnft {
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    width: 240px;
    background: var(--bg-darker);
}

.gnft .image {
    width: 100%;
    height: 200px;
}

.image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.gnft .detail {
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

.gnft:hover .detail a {
    opacity: 1;
    bottom: 20px;
}
</style>