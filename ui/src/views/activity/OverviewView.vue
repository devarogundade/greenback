<script setup lang="ts">
import Chart from '@/components/Chart.vue';
import Button from '@/components/buttons/Button.vue';
import ScanIcon from '@/components/icons/ScanIcon.vue';
import QrScanner from '@/pops/QrScanner.vue';
import { ref } from 'vue';

const data = [
    { name: 'Monday', pl: 1000, avg: 500, inc: 300 },
    { name: 'Tuesday', pl: 2000, avg: 900, inc: 400 },
    { name: 'Wednesday', pl: 400, avg: 400, inc: 500 },
    { name: 'Thursday', pl: 3100, avg: 1300, inc: 700 },
    { name: 'Friday', pl: 200, avg: 100, inc: 200 },
    { name: 'Yesterday', pl: 600, avg: 400, inc: 300 },
    { name: 'Today', pl: 500, avg: 90, inc: 100 }
];

const activeQrCode = ref(false);
</script>

<template>
    <div class="overview">
        <div class="count_wrapper">
            <img src="https://img.freepik.com/free-vector/3d-green-gradient-recycle-sign_78370-826.jpg?t=st=1722726322~exp=1722729922~hmac=577afa87216937fd5967af00d672d283ecccdbd828b74cc179deaa2575108425&w=826"
                alt="">
            <h3>You have recycled <br> <span>5 plastic</span> bottles today!.</h3>
        </div>

        <div class="chart_wrapper">
            <Chart :data="data" :marker="true" />
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