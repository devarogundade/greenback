<script setup lang="ts">
import Button from '@/components/buttons/Button.vue';
import CheckBox from '@/components/buttons/CheckBox.vue';
import { onMounted, ref } from 'vue';
import type { RequestCardForm } from '@/types';
import { useKeylessAccounts } from '@/scripts/useKeylessAccounts';
import { getUserAccount } from '@/scripts/greenback-contracts';
import { requestCard } from '@/scripts/greenback-server';
import { useUserStore } from '@/stores/user-store';
import { useToast } from 'vue-toast-notification';
import { KeylessAccount } from "@aptos-labs/ts-sdk";
import { isEmail, borrowString } from '@/scripts/utils';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast({ duration: 4000, position: 'top', dismissible: true });

const requesting = ref(false);
const requestForm = ref<RequestCardForm>({
    user_address: '', // will be injected in onMounted
    name: '',
    email: '',
    location: '',
    color: 'green'
});
const cardId = useUserStore().card_id;

const selectColor = (color: 'green' | 'gray') => {
    requestForm.value.color = color;
};

const getUser = async (keylessAccount: KeylessAccount) => {
    const user = await getUserAccount(keylessAccount.accountAddress);

    if (user) {
        useUserStore.setState({ unclaimed_earnings: user[0] });
        useUserStore.setState({ withdrawn_earnings: user[1] });
        useUserStore.setState({ donated_earnings: user[2] });
        useUserStore.setState({ card_id: borrowString(user[3].vec[0]) });
    }
};

const request = async () => {
    if (requestForm.value.name.length == 0) {
        toast.error('Enter a valid name.');
        return;
    }

    if (!isEmail(requestForm.value.email)) {
        toast.error('Enter a valid email address.');
        return;
    }

    if (requestForm.value.location.length < 3) {
        toast.error('Enter a valid location.');
        return;
    }

    requesting.value = true;

    const result = await requestCard(requestForm.value);

    requesting.value = false;

    if (!result) {
        toast.error('Failed to request card.');
        return;
    }

    const keylessAccount = useKeylessAccounts().keylessAccount?.value;
    if (!keylessAccount) return;

    getUser(keylessAccount);

    toast.success('Successful: Check your mail!.');
};

onMounted(async () => {
    const keylessAccount = useKeylessAccounts().keylessAccount?.value;
    if (!keylessAccount) return;

    getUser(keylessAccount);
    requestForm.value.user_address = keylessAccount.accountAddress.toString();
});
</script>

<template>
    <div class="gcard">
        <div class="gcard_header">
            <div class="gcard_title">
                <h3>My GCard</h3>
            </div>
        </div>

        <div class="gcard_details" v-if="cardId">
            <img src="/images/gcards/green.png" alt="gcard">
        </div>

        <div class="gcard_request" v-if="!cardId">
            <div class="input">
                <p class="label">Color choice <span>*</span></p>
                <div class="colors">
                    <div class="color">
                        <img src="/images/gcards/green.png" alt="vending_machine">
                        <CheckBox @click="selectColor('green')" :checked="requestForm.color == 'green'" />
                    </div>

                    <div class="color">
                        <img src="/images/gcards/gray.png" alt="vending_machine">
                        <CheckBox @click="selectColor('gray')" :checked="requestForm.color == 'gray'" />
                    </div>
                </div>
            </div>

            <div class="input">
                <p class="label">Name <span>*</span></p>
                <input type="text" v-model="requestForm.name" placeholder="Alice">
            </div>

            <div class="input">
                <p class="label">Email address <span>*</span></p>
                <input type="email" v-model="requestForm.email" placeholder="alice@mail.com">
            </div>

            <div class="input">
                <p class="label">Location <span>*</span></p>
                <input type="text" v-model="requestForm.location" placeholder="025 Bay Street, New York.">
            </div>

            <div class="action" @click="request">
                <Button :loading="requesting" :text="'Request GCard'" />
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

.gcard_details img {
    width: 240px;
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