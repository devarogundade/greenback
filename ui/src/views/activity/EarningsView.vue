<script setup lang="ts">
import ProgressBox from '@/components/ProgressBox.vue';
import Button from '@/components/buttons/Button.vue';
import ImportIcon from '@/components/icons/ImportIcon.vue';
import OutIcon from '@/components/icons/OutIcon.vue';
import CoinIcon from '@/components/icons/CoinIcon.vue';
import LovelyIcon from '@/components/icons/LovelyIcon.vue';
import GcoinIcon from '@/components/icons/GcoinIcon.vue';
import { useUserStore } from '@/stores/user-store';
import { toCurrency } from '@/scripts/utils';
import { useKeylessAccounts } from '@/scripts/useKeylessAccounts';
import { KeylessAccount, AccountAddress } from "@aptos-labs/ts-sdk";
import { getUserAccount } from '@/scripts/greenback-contracts';
import { getUserActivities } from '@/scripts/greenback-server';
import { onMounted, ref } from 'vue';
import { borrowString } from '@/scripts/utils';
import type { Activity } from '@/types';
import { format as formatTime } from 'timeago.js';

const unclaimed_earnings = useUserStore().unclaimed_earnings;
const donated_earnings = useUserStore().donated_earnings;

const getUser = async (keylessAccount: KeylessAccount) => {
    const user = await getUserAccount(keylessAccount.accountAddress);

    if (user) {
        useUserStore.setState({ unclaimed_earnings: user[0] });
        useUserStore.setState({ withdrawn_earnings: user[1] });
        useUserStore.setState({ donated_earnings: user[2] });
        useUserStore.setState({ card_id: borrowString(user[3].vec[0]) });
    }
};

const getActivities = async (accountAddress: AccountAddress) => {
    loadingActivites.value = page.value == 1;
    const result = await getUserActivities(accountAddress, page.value);
    if (result && result.data) {
        activities.value = [...activities.value, ...result.data];
        lastPage.value = result.lastPage;
        totalActivities.value = result.total;
    }

    loadingActivites.value = false;
};

const showMoreActivites = () => {
    const keylessAccount = useKeylessAccounts().keylessAccount?.value;
    if (!keylessAccount) return;
    if (page.value >= lastPage.value) return;

    page.value = page.value += 1;
    getActivities(keylessAccount.accountAddress);
};

const loadingActivites = ref(false);
const activities = ref<Activity[]>([]);
const page = ref(1);
const lastPage = ref(0);
const totalActivities = ref(0);

onMounted(async () => {
    const keylessAccount = useKeylessAccounts().keylessAccount?.value;
    if (!keylessAccount) return;

    getUser(keylessAccount);
    getActivities(keylessAccount.accountAddress);
});
</script>

<template>
    <div class="earnings">
        <div class="title">
            <h3>Earnings</h3>
        </div>
        <div class="balance_wrapper">
            <div class="balance">
                <div class="balance_item">
                    <div class="balance_item_name">
                        <p>Balance</p>
                        <CoinIcon />
                    </div>
                    <div class="balance_item_value">
                        <GcoinIcon />
                        <h3>{{ toCurrency(unclaimed_earnings) }}</h3>
                    </div>
                    <span>≡ 2.47 APT</span>
                </div>

                <div class="balance_item">
                    <div class="balance_item_name">
                        <p>Donated</p>
                        <LovelyIcon />
                    </div>
                    <div class="balance_item_value">
                        <GcoinIcon :color="'var(--tx-semi)'" />
                        <h3>{{ toCurrency(donated_earnings) }}</h3>
                    </div>
                    <span>≡ 0.00 APT</span>
                </div>
            </div>
        </div>

        <div class="history_header">
            <h3>My activities history <span>({{ totalActivities }})</span></h3>
            <Button :text="'Claim Earnings'">
                <ImportIcon />
            </Button>
        </div>

        <div class="progress" v-if="loadingActivites">
            <ProgressBox />
        </div>

        <table v-if="!loadingActivites">
            <thead>
                <tr>
                    <td>Via</td>
                    <td>Weight (grams)</td>
                    <td>Reward</td>
                    <td>Timestamp</td>
                    <td></td>
                </tr>
            </thead>
            <tbody v-for="activity, index in activities" :key="index">
                <tr>
                    <td>{{ activity.channel }}</td>
                    <td>{{ activity.weight_in_gram }}</td>
                    <td>
                        <div class="coin">
                            <GcoinIcon />
                            <p>{{ toCurrency(activity.reward_amount) }}</p>
                        </div>
                    </td>
                    <td>{{ formatTime(activity.created_at) }}</td>
                    <td>
                        <a :href="`https://explorer.aptoslabs.com/txn/${activity.tx_hash}?network=testnet`"
                            target="_blank">
                            <OutIcon />
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="show_more" v-if="page < lastPage">
            <button class="action" @click="showMoreActivites">Show more</button>
        </div>
    </div>
</template>

<style scoped>
.earnings {
    padding: 130px 40px;
}

.title h3 {
    font-size: 40px;
    font-weight: 500;
    color: var(--tx-semi);
    text-align: center;
}

.balance_wrapper {
    display: flex;
    justify-content: center;
}

.balance {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(2, 300px);
    border: 1px solid var(--bg-darkest);
    justify-content: center;
    border-radius: 6px;
    width: fit-content;
}

.balance_item {
    padding: 16px 20px;
    text-align: center;
}

.balance_item_name {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.balance_item_value {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-top: 10px;
}

.balance_item_value svg {
    width: 20px;
    height: 20px;
}

.balance_item:first-child {
    border-right: 1px solid var(--bg-darkest);
}

.balance_item p {
    font-size: 14px;
    color: var(--tx-dimmed);
}

.balance_item h3 {
    font-size: 20px;
    color: var(--tx-dimmed);
    font-weight: 600;
    margin-top: 4px;
}

.balance_item:first-child h3 {
    color: var(--primary-dark);
}

.balance_item span {
    font-size: 14px;
    color: var(--tx-semi);
    margin-top: 4px;
    font-weight: 500;
}

.history_header {
    margin-top: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--bg-darkest);
    padding: 10px 0;
}

.history_header h3 {
    font-size: 18px;
    font-weight: 500;
    color: var(--tx-normal);
}

table {
    width: 100%;
    border-collapse: collapse;
}

table tr {
    display: grid;
    grid-template-columns: 0.5fr 1fr 1fr 1fr 0.2fr;
}

table tr td:not(:first-child) {
    text-align: right;
    justify-content: flex-end;
}

thead td {
    font-size: 16px;
    font-weight: 600;
    color: var(--tx-semi);
}

tbody td {
    font-size: 14px;
    font-style: 500px;
    color: var(--tx-normal);
    border-bottom: 1px solid var(--bg-darkest);
}

thead tr {
    background: var(--bg-dark);
}

td {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 10px;
}

.coin {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 4px;
}

.coin p {
    margin-top: 2px;
    font-weight: 600;
    color: var(--primary-dark)
}

.coin svg {
    width: 14px;
    height: 14px;
}

.show_more {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.show_more .action {
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    border: none;
    background: none;
    width: 120px;
    height: 30px;
    border: 1px solid var(--bg-darkest);
    border-radius: 4px;
    color: var(--tx-semi);
}

.progress {
    display: flex;
    justify-content: center;
    margin-top: 100px;
}
</style>