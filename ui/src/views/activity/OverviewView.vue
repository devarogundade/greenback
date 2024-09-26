<script setup lang="ts">
import ProgressBox from '@/components/ProgressBox.vue';
import Chart from '@/components/Chart.vue';
import Button from '@/components/buttons/Button.vue';
import ScanIcon from '@/components/icons/ScanIcon.vue';
import QrScanner from '@/pops/QrScanner.vue';
import { useUserStore } from '@/stores/user-store';
import { ref, onMounted, watch } from 'vue';
import { KeylessAccount } from "@aptos-labs/ts-sdk";
import { useKeylessAccounts } from '@/scripts/keyless-accounts';
import { getMetrics } from '@/scripts/greenback-server';

const metric = useUserStore().metric;
const loadingMetric = ref(false);

const getUserMetric = async (keylessAccount: KeylessAccount) => {
    loadingMetric.value = true;
    const metric = await getMetrics(keylessAccount.accountAddress);
    useUserStore.setState({ metric });
    loadingMetric.value = false;
};

interface ChartData {
    name: string;
    pl: number;
}

const data = ref<ChartData[]>([]);

const activeQrCode = ref(false);

onMounted(() => {
    const keylessAccount = useKeylessAccounts().keylessAccount?.value;
    if (!keylessAccount) return;

    getUserMetric(keylessAccount);
});

watch(
    metric,
    () => {
        if (metric.value) {
            data.value = metric.value?.reverse().map((m) => {
                return {
                    name: Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric'
                    }).format(new Date(m.date)),
                    pl: m.value * 100,
                };
            });
        }
    }
);
</script>

<template>
    <div class="overview">
        <div class="count_wrapper">
            <img src="https://img.freepik.com/free-vector/3d-green-gradient-recycle-sign_78370-826.jpg?t=st=1722726322~exp=1722729922~hmac=577afa87216937fd5967af00d672d283ecccdbd828b74cc179deaa2575108425&w=826"
                alt="">
            <h3>You have recycled <br> <span>{{ Number(data?.[data.length - 1]?.pl / 100).toFixed(0) || 0 }} plastic</span> bottles
                today!.</h3>
        </div>

        <div class="chart_wrapper">
            <ProgressBox v-if="loadingMetric" />
            <Chart v-else :data="data" :marker="true" />
        </div>

        <div class="scan">
            <Button :text="'Scan to recycle'" @click="activeQrCode = !activeQrCode">
                <ScanIcon />
            </Button>
        </div>

        <QrScanner @close="activeQrCode = false" v-if="activeQrCode" />
    </div>
</template>

<style scoped>
.overview {
    padding: 130px 40px;
}

.count_wrapper {
    display: flex;
    align-items: center;
    flex-direction: column;
}

.chart_wrapper {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    min-height: 200px;
}

.count_wrapper img {
    width: 60px;
}

.count_wrapper h3 {
    font-size: 35px;
    line-height: 45px;
    font-weight: 500;
    color: var(--tx-semi);
    text-align: center;
    width: 550px;
    max-width: 100%;
    margin-top: 20px;
}

.count_wrapper span {
    color: var(--primary-dark);
    font-weight: 600;
}

.scan {
    display: flex;
    justify-content: center;
    margin-top: 80px;
}
</style>