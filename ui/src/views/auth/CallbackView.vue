<script setup lang="ts">
import { useKeylessAccounts } from '@/scripts/keyless-accounts';
import ProgressBox from '@/components/ProgressBox.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref<boolean>(false);
const { switchKeylessAccount } = useKeylessAccounts.getState();

const fragmentParams = new URLSearchParams(window.location.hash.substring(1));
const idToken = fragmentParams.get("id_token");

async function deriveAccount(idToken: string | null) {
    if (!idToken) {
        router.push('/');
        return;
    }

    // This is a workaround to prevent firing twice due to strict mode
    if (loading.value) return;
    loading.value = true;

    try {
        await switchKeylessAccount(idToken);
        router.push('/app');
    } catch (error) {
        router.push('/');
    }
}

onMounted(() => {
    deriveAccount(idToken);
});
</script>

<template>
    <div class="callback_view">
        <ProgressBox v-if="loading" />
    </div>
</template>

<style scoped>
.callback_view {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>