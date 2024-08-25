<script setup lang="ts">
import CloseIcon from '@/components/icons/CloseIcon.vue';
import GcoinIcon from '@/components/icons/GcoinIcon.vue';
import Button from '@/components/buttons/Button.vue';
import { donateDAO } from '@/scripts/greenback-contracts';
import { useKeylessAccounts } from '@/scripts/useKeylessAccounts';
import { toCurrency, toAptosUnits } from '@/scripts/utils';
import { useUserStore } from '@/stores/user-store';
import { ref } from 'vue';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const emit = defineEmits(['close']);
const props = defineProps({ daoAddress: { type: String, required: true } });
const toast = useToast({ duration: 4000, position: 'top', dismissible: true });

const keylessAccount = useKeylessAccounts().keylessAccount?.value;
const unclaimedEarnings = useUserStore().unclaimedEarnings;
const amount = ref<number | undefined>(undefined);

const donate = async () => {
    if (!keylessAccount) return;

    if (!amount.value || amount.value == 0) {
        toast.error('Enter an amount.');
        return;
    }

    if (amount.value > unclaimedEarnings.value) {
        toast.error('Insufficient balance.');
        return;
    }

    const txHash = await donateDAO(
        keylessAccount,
        props.daoAddress,
        toAptosUnits(amount.value)
    );

    console.log(txHash);

    if (txHash) {
        toast.success('Donation sent.');
        emit('close');
    } else {
        toast.error('Failed to donate');
    }
};
</script>

<template>
    <div class="dao_donate_container">
        <div class="close" @click="$emit('close')">
            <CloseIcon />
        </div>
        <div class="dao_donate_box">
            <div class="title">
                <h3>Donate</h3>
            </div>

            <div class="donate">
                <div class="label">
                    <p>Enter amount</p>

                    <div class="balance">
                        <p>Bal: </p>
                        <div>
                            <GcoinIcon />
                            <p>{{ toCurrency(unclaimedEarnings) }}</p>
                        </div>
                    </div>
                </div>

                <div class="input">
                    <input type="number" v-model="amount" placeholder="0.00" />
                </div>

                <div class="action">
                    <Button :text="'Confirm'" @click="donate" />
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
.dao_donate_container {
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

.dao_donate_box {
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

.label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 20px;
    margin-top: 10px;
}

.label .balance {
    display: flex;
    align-items: center;
    gap: 10px;
}

.label>p {
    color: var(--tx-semi);
    font-size: 14px;
    font-weight: 500;
}

.label .balance>p {
    color: var(--tx-semi);
    font-size: 14px;
    font-weight: 500;
}

.balance svg {
    width: 16px;
    height: 16px;
}

.label .balance>div {
    display: flex;
    align-items: center;
    gap: 4px;
}

.label .balance>div p {
    color: var(--tx-normal);
    font-size: 14px;
    font-weight: 500;
}

.input {
    padding: 0 20px;
}

input {
    height: 45px;
    border: 1px solid var(--bg-darkest);
    border-radius: 6px;
    padding: 0 10px;
    font-size: 16px;
    font-weight: 500;
    width: 100%;
    outline: none;
    color: var(--tx-normal);
}

.action {
    display: flex;
    justify-content: flex-end;
    padding: 20px;
}
</style>