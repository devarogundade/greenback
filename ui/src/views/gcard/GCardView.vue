<script setup lang="ts">
import Button from '@/components/buttons/Button.vue';
import CheckBox from '@/components/buttons/CheckBox.vue';
import { ref } from 'vue';
import type { OrderForm } from '@/types';

const orderForm = ref<OrderForm>({
    name: '',
    email: '',
    location: '',
    color: 'green'
});

const selectColor = (color: 'green' | 'gray') => {
    orderForm.value.color = color;
};
</script>

<template>
    <div class="gcard">
        <div class="gcard_header">
            <div class="gcard_title">
                <h3>My GCard</h3>
            </div>
        </div>

        <div class="gcard_request">
            <div class="input">
                <p class="label">Color choice <span>*</span></p>
                <div class="colors">
                    <div class="color">
                        <img src="/images/gcards/green.png" alt="vending_machine">
                        <CheckBox @click="selectColor('green')" :checked="orderForm.color == 'green'" />
                    </div>

                    <div class="color">
                        <img src="/images/gcards/gray.png" alt="vending_machine">
                        <CheckBox @click="selectColor('green')" :checked="orderForm.color == 'gray'" />
                    </div>
                </div>
            </div>

            <div class="input">
                <p class="label">Name <span>*</span></p>
                <input type="text" v-model="orderForm.name" placeholder="Alice">
            </div>

            <div class="input">
                <p class="label">Email address <span>*</span></p>
                <input type="email" v-model="orderForm.email" placeholder="alice@mail.com">
            </div>

            <div class="input">
                <p class="label">Location <span>*</span></p>
                <input type="text" v-model="orderForm.location" placeholder="025 Bay Street, New York.">
            </div>

            <div class="action">
                <Button :text="'Request GCard'" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.gcard {
    padding: 140px 40px;
}

.gcard_title h3 {
    color: var(--tx-semi);
    font-size: 40px;
    font-weight: 500;
}

.gcard_request {
    width: 400px;
}

.input {
    margin-top: 20px;
}

.gcard_request .action {
    margin-top: 20px;
}

.label {
    font-size: 14px;
    font-weight: 500;
    color: var(--tx-normal);
}

.input span {
    color: rgba(255, 0, 102, 0.6);
}

.input input {
    margin-top: 10px;
    width: 100%;
    height: 44px;
    padding: 0 14px;
    border-radius: 6px;
    border: 1px solid var(--tx-dimmed);
    color: var(--tx-normal);
    font-size: 14px;
    font-weight: 500;
    outline: none;
}

.input input::placeholder {
    color: var(--tx-dimmed);
}

.colors {
    display: flex;
    gap: 20px;
    margin-top: 10px;
}

.color {
    width: 150px;
    cursor: pointer;
}

.color img {
    width: 100%;
}
</style>