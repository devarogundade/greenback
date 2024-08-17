<script setup lang="ts">
import Button from '@/components/buttons/Button.vue';
import ImportIcon from '@/components/icons/ImportIcon.vue';
import OutIcon from '@/components/icons/OutIcon.vue';
import CoinIcon from '@/components/icons/CoinIcon.vue';
import LovelyIcon from '@/components/icons/LovelyIcon.vue';
import GcoinIcon from '@/components/icons/GcoinIcon.vue';
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
                        <h3>1,392</h3>
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
                        <h3>0.00</h3>
                    </div>
                    <span>≡ 0.00 APT</span>
                </div>
            </div>
        </div>

        <div class="history_header">
            <h3>My activities history</h3>
            <Button :text="'Claim Earnings'">
                <ImportIcon />
            </Button>
        </div>

        <table>
            <thead>
                <tr>
                    <td>Txn. hash</td>
                    <td>Weight in grams</td>
                    <td>Reward</td>
                    <td>Timestamp</td>
                    <td></td>
                </tr>
            </thead>
            <tbody v-for="i in 5" :key="i">
                <tr>
                    <td>JK-{{ 9438 - i }}</td>
                    <td>{{ 11 - i }}</td>
                    <td>
                        <div class="coin">
                            <GcoinIcon />
                            <p>238</p>
                        </div>
                    </td>
                    <td>10 Mins ago</td>
                    <td>
                        <a href="" target="_blank">
                            <OutIcon />
                        </a>
                    </td>
                </tr>
            </tbody>
        </table>
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
    grid-template-columns: 1fr 1fr 1fr 1fr 0.2fr;
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

tbody:nth-child(odd) {
    background: var(--bg-dark)
}

tbody td {
    font-size: 14px;
    font-style: 500px;
    color: var(--tx-normal);
}

thead tr {
    border-bottom: 1px solid var(--bg-darkest);
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
</style>