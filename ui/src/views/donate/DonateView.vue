<script setup lang="ts">
import Button from '@/components/buttons/Button.vue';
import ChevronRight from '@/components/icons/ChevronRight.vue';
import GcoinIcon from '@/components/icons/GcoinIcon.vue';
import { ref, onMounted } from 'vue';
import type { DAO } from '@/types';
import { daoAddresses } from '@/scripts/data';
import { getDAOs as getDAOsImpl } from '@/scripts/greenback-contracts';
import ProgressBox from '@/components/ProgressBox.vue';
import { toCurrency, fromAptosUnits } from '@/scripts/utils';

const daos = ref<DAO[]>([]);
const loading = ref(false);

const getDAOs = async () => {
    loading.value = true;
    daos.value = await getDAOsImpl(daoAddresses);
    loading.value = false;
};

onMounted(() => {
    getDAOs();
});
</script>

<template>
    <div class="donate_view">
        <div class="donate_header">
            <div class="donate_title">
                <h3>Donate (DAOs)</h3>
                <Button :text="'Request new DAO'" />
            </div>
        </div>

        <div class="progress" v-if="loading">
            <ProgressBox />
        </div>

        <div class="daos" v-if="!loading">
            <RouterLink v-for="dao, index in daos" :to="`/app/donate/${dao.daoAddress}`" :key="index">
                <div class="dao">
                    <div class="dao_name">
                        <p>{{ dao.name }}</p>
                    </div>

                    <div class="dao_detail">
                        <div class="proposals">
                            <p>Proposals</p>
                            <div class="proposals_info">
                                <p v-if="dao.nextProposalId == 0">No proposal</p>
                                <div class="images">
                                    <img v-if="dao.nextProposalId > 0" src="/images/logo.png" alt="">
                                    <img v-if="dao.nextProposalId > 1" src="/images/logo.png" alt="">
                                    <img v-if="dao.nextProposalId > 2" src="/images/logo.png" alt="">
                                </div>
                                <p>{{ dao.nextProposalId > 3 ? `+ ${dao.nextProposalId - 3}` : '' }}</p>
                            </div>
                        </div>

                        <Button :text="'View all'">
                            <ChevronRight />
                        </Button>
                    </div>

                    <div class="dao_raised_amount">
                        <p>Raised amount</p>
                        <div class="dao_raised_amount_info">
                            <GcoinIcon />
                            <p> {{ toCurrency(fromAptosUnits(dao.raisedAmount)) }}</p>
                        </div>
                    </div>
                </div>
            </RouterLink>
        </div>
    </div>
</template>

<style scoped>
.donate_view {
    padding: 140px 40px;
}

.donate_title {
    display: flex;
    justify-content: space-between;
}

.donate_title h3 {
    color: var(--tx-semi);
    font-size: 40px;
    font-weight: 500;
}

.progress {
    display: flex;
    justify-content: center;
    margin-top: 100px;
}

.daos {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    margin-top: 20px;
}

.dao {
    border: 1px solid var(--bg-darkest);
    padding: 16px;
    width: 303px;
    border-radius: 10px;
}

.dao_name {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
}

.dao_name>p {
    font-size: 16px;
    font-weight: 500;
    color: var(--tx-normal);
}

.dao_detail {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--bg-darker);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.proposals>p {
    font-size: 14px;
    font-weight: 500;
    color: var(--tx-semi);
}

.proposals_info {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-top: 2px;
}

.proposals_info>p {
    font-size: 14px;
    font-weight: 500;
    color: var(--tx-dimmed);
}

.proposals .images {
    display: flex;
    align-items: center;
}

.proposals img {
    width: 20px;
    height: 20px;
    object-fit: cover;
    border-radius: 12px;
    margin-left: -10px;
}

.proposals img:first-child {
    margin: 0;
}

.dao_raised_amount {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--bg-darker);
}

.dao_raised_amount>p {
    font-size: 14px;
    font-weight: 500;
    color: var(--tx-semi);
}


.dao_raised_amount svg {
    width: 16px;
    height: 16px;
}

.dao_raised_amount_info {
    display: flex;
    align-items: center;
    gap: 4px;
}

.dao_raised_amount_info p {
    font-size: 16px;
    font-weight: 500;
    color: var(--tx-semi);
    margin-top: 4px;
}
</style>