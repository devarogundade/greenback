<script setup lang="ts">
import Button from '@/components/buttons/Button.vue';
import ChevronRight from '@/components/icons/ChevronRight.vue';
import CopyIcon from '@/components/icons/CopyIcon.vue';
import { unpackDAO, getDAOProposals, voteDAO } from '@/scripts/greenback-contracts';
import { useKeylessAccounts } from '@/scripts/keyless-accounts';
import GcoinIcon from '@/components/icons/GcoinIcon.vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { collapseAddress } from '@/scripts/utils';
import { toCurrency, fromAptosUnits, getProposalState } from '@/scripts/utils';
import type { DAO, Proposal } from '@/types';
import { format as formatDate } from 'timeago.js';
import ProgressBox from '@/components/ProgressBox.vue';
import DaoDonate from '@/pops/DaoDonate.vue';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const route = useRoute();
const keylessAccount = useKeylessAccounts().keylessAccount;
const toast = useToast({ duration: 4000, position: 'top', dismissible: true });

const dao = ref<DAO | null>(null);
const proposals = ref<Proposal[]>([]);
const daoDonating = ref(false);
const loading = ref(false);
const voting = ref(false);

const refreshDAO = () => {
    setTimeout(async () => {
        dao.value = await unpackDAO(route.params.id as string);
    }, 2000);
};

const getDAO = async () => {
    loading.value = true;
    dao.value = await unpackDAO(route.params.id as string);
    if (dao.value) {
        const proposalIds = Array.from({
            length: dao.value.nextProposalId
        }, (_, i) => i + 1);

        getProposals(proposalIds);
    }
    loading.value = false;
};

const getProposals = async (proposalIds: number[]) => {
    proposals.value = await getDAOProposals(route.params.id as string, proposalIds);
};

const vote = async (proposalId: number, voteOption: boolean) => {
    if (voting.value) return;
    if (!dao.value) return;
    if (!keylessAccount || !keylessAccount.value) return;

    const txHash = await voteDAO(
        keylessAccount.value,
        dao.value.daoAddress,
        proposalId,
        voteOption
    );

    if (txHash) {
        toast.success('Vote casted.');

        if (dao.value) {
            const proposalIds = Array.from({
                length: dao.value.nextProposalId
            }, (_, i) => i + 1);

            getProposals(proposalIds);
        }
    } else {
        toast.success('Failed to cast vote.');
    }

    voting.value = false;
};

const getRatio = (a: number, b: number) => {
    return Number(a / (Number(a) + Number(b))) * 100;
};

onMounted(() => {
    getDAO();
});
</script>

<template>
    <div class="detail_view">
        <div class="progress" v-if="loading">
            <ProgressBox />
        </div>

        <div class="donate_header" v-if="dao">
            <div class="donate_title">
                <div class="donate_title_info">
                    <div class="donate_title_list">
                        <RouterLink to="/app/donate">
                            <h3>Donate (DAOs)</h3>
                        </RouterLink>
                        <ChevronRight :color="'var(--tx-semi)'" />
                        <h3>{{ dao.name }}</h3>
                    </div>
                    <div class="donate_address">
                        <p>{{ collapseAddress(dao.daoAddress) }}</p>
                        <CopyIcon :color="'var(--tx-semi)'" />
                    </div>
                </div>

                <Button @click="daoDonating = true" :text="'Donate'" />
            </div>

            <div class="dao_stats">
                <div class="dao_stat">
                    <h3>Available amount</h3>
                    <div class="dao_stat_amount">
                        <GcoinIcon />
                        <p>{{ toCurrency(fromAptosUnits(dao.availableAmount)) }}</p>
                    </div>
                </div>

                <div class="dao_stat">
                    <h3>Raised amount</h3>
                    <div class="dao_stat_amount">
                        <GcoinIcon />
                        <p>{{ toCurrency(fromAptosUnits(dao.raisedAmount)) }}</p>
                    </div>
                </div>
            </div>

            <div class="proposal_title">
                <h3>Proposals ({{ proposals.length }})</h3>

                <RouterLink :to="`/app/donate/${$route.params.id}/create`">
                    <Button :text="'New Proposal'" />
                </RouterLink>
            </div>

            <div class="proposals">
                <div class="proposal" v-for="proposal, index in proposals" :key="index">
                    <div class="proposal_status">
                        <p class="proposal_time">{{ formatDate(proposal.startTimeSec * 1000) }}</p>
                        <div class="proposal_state">{{ getProposalState(proposal.resolution) }}</div>
                    </div>

                    <div class="proposal_info">
                        <img :src="proposal.image" alt="">
                        <h3 class="title">{{ proposal.title }}</h3>
                        <p class="description">{{ proposal.description }}</p>
                    </div>

                    <div class="progress_info">
                        <p>Yes, agreed. ~ {{ getRatio(proposal.finalYesVotes, proposal.finalNoVotes) }}%</p>
                        <p>No, disagreed. ~ {{ getRatio(proposal.finalNoVotes, proposal.finalYesVotes) }}%</p>
                    </div>
                    <div class="progress_bar">
                        <div class="yes_bar"
                            :style="`width: ${getRatio(proposal.finalYesVotes, proposal.finalNoVotes)}%`"></div>
                        <div class="no_bar"
                            :style="`width: ${getRatio(proposal.finalNoVotes, proposal.finalYesVotes)}%`"></div>
                    </div>

                    <div class="proposer">
                        <p><span>
                                <GcoinIcon /> {{ toCurrency(fromAptosUnits(proposal.proposedAmount)) }}
                            </span>
                            ~ By {{ collapseAddress(dao.daoAddress) }}
                        </p>

                        <div class="vote">
                            <Button @click="vote(index + 1, true)" :text="'Yes'" />
                            <Button @click="vote(index + 1, false)" :text="'No'" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <DaoDonate @result="refreshDAO" @close="daoDonating = false" v-if="dao && daoDonating"
            :daoAddress="dao.daoAddress" />
    </div>
</template>


<style scoped>
.detail_view {
    padding: 140px 40px;
}

.donate_title {
    display: flex;
    justify-content: space-between;
}

.donate_title h3 {
    color: var(--tx-semi);
    font-size: 24px;
    font-weight: 500;
}

.progress {
    display: flex;
    justify-content: center;
    margin-top: 100px;
}

.donate_title_list {
    display: flex;
    align-items: center;
    gap: 10px;
}

.donate_title_list svg {
    width: 24px;
    height: 24px;
}

.donate_address {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 10px;
}

.donate_address p {
    color: var(--tx-dimmed);
    font-size: 16px;
    font-weight: 500;
}

.donate_address svg {
    margin-top: -4px;
    cursor: pointer;
}

.dao_stats {
    display: grid;
    border: 1px solid var(--bg-darkest);
    border-radius: 10px;
    grid-template-columns: repeat(2, 1fr);
    margin-top: 2%;
}

.dao_stat {
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.dao_stat:first-child {
    border-right: 1px solid var(--bg-darkest);
}

.dao_stat_amount {
    display: flex;
    align-items: center;
    gap: 4px;
}

.dao_stat>h3 {
    font-size: 16px;
    font-weight: 500;
    color: var(--tx-semi);
}

.dao_stat_amount svg {
    width: 24px;
    height: 24px;
}

.dao_stat_amount p {
    font-size: 24px;
    font-weight: 600;
    color: var(--tx-semi);
    margin-top: 4px;
}

.proposal_title {
    margin-top: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.proposal_title h3 {
    font-size: 24px;
    font-weight: 500;
    color: var(--tx-normal);
}

.proposals {
    margin-top: 20px;
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
}

.proposal {
    border: 1px solid var(--bg-darkest);
    padding: 20px;
    border-radius: 12px;
    width: 470px;
}

.proposal_status {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.proposal_time {
    font-size: 14px;
    font-weight: 500;
    color: var(--tx-dimmed);
}

.proposal_state {
    padding: 2px 4px;
    border: 1px solid var(--bg-darkest);
    border-radius: 6px;
    background: var(--bg-dark);
    font-size: 10px;
    font-weight: 500;
    color: var(--tx-semi);
}

.proposal_info {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--bg-darkest);
}

.proposal_info img {
    width: 100%;
    height: 180px;
    border-radius: 10px;
    object-fit: cover;
}

.proposal_info .title {
    margin-top: 10px;
    font-size: 24px;
    font-weight: 500;
    color: var(--tx-semi);
}

.proposal_info .description {
    margin-top: 10px;
    font-size: 14px;
    color: var(--tx-dimmed);
}

.progress_info {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--bg-darkest);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.progress_info p {
    font-size: 12px;
    font-weight: 500;
}

.progress_info p:first-child {
    color: var(--primary-dark);
}

.progress_info p:last-child {
    color: var(--tx-semi);
}

.progress_bar {
    margin-top: 10px;
    height: 8px;
    width: 100%;
    border-radius: 6px;
    background: var(--bg-dark);
    border: 1px solid var(--bg-darkest);
}

.yes_bar {
    height: 100%;
    border-radius: 6px;
    background: var(--primary-dark);
}

.no_bar {
    height: 100%;
    border-radius: 6px;
    background: var(--bg-dark);
}

.proposer {
    margin-top: 16px;
    padding-top: 16px;
    font-size: 14px;
    color: var(--tx-dimmed);
    border-top: 1px solid var(--bg-darkest);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.proposer svg {
    width: 14px;
    height: 14px;
}

.proposer span {
    font-weight: 600;
    color: var(--tx-semi);
}

.vote {
    display: flex;
    align-items: center;
    gap: 10px;

}
</style>