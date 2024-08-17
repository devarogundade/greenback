<script setup lang="ts">
// @ts-ignore
import { QrStream } from 'vue3-qr-reader';
import CloseIcon from '@/components/icons/CloseIcon.vue';

const emit = defineEmits([
    'close', 'result'
]);

const onDecode = (data: string | null) => {
    if (!data) return;

    emit('result', data);
    emit('close');
};
</script>

<template>
    <div class="qr_code_container">
        <div class="close" @click="$emit('close')">
            <CloseIcon />
        </div>
        <div class="qr_code_box">
            <QrStream @decode="onDecode" />
        </div>
    </div>
</template>

<style scoped>
.qr_code_container {
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

.qr_code_box {
    width: 320px;
    height: 380px;
    border-radius: 6px;
    overflow: hidden;
    box-shadow: 10px 10px 5px rgba(0, 0, 0, 0.2);
    background: var(--bg);
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

.close svg {
    width: 30px;
    height: 30px;
}
</style>