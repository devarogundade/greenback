<script setup lang="ts">
import Button from '@/components/buttons/Button.vue';
import ChevronRight from '@/components/icons/ChevronRight.vue';
import CopyIcon from '@/components/icons/CopyIcon.vue';
import { unpackDAO, createProposal } from '@/scripts/greenback-contracts';
import { useKeylessAccounts } from '@/scripts/keyless-accounts';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { collapseAddress, fromAptosUnits, toAptosUnits } from '@/scripts/utils';
import { toDays } from '@/scripts/utils';
import { useUserStore } from '@/stores/user-store';
import type { DAO } from '@/types';
import Storage from '@/scripts/storage';
import ProgressBox from '@/components/ProgressBox.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const route = useRoute();
const router = useRouter();
const toast = useToast({ duration: 4000, position: 'top', dismissible: true });

const dao = ref<DAO | null>(null);

const loading = ref(false);
const submitting = ref(false);
const proposal = ref({
    title: '',
    description: '',
    image: '',
    image_preview: '',
    image_file: null as File | null,
    proposedAmount: undefined,
    startTime: new Date(),
});
const donatedAmount = useUserStore().donatedEarnings;
const keylessAccount = useKeylessAccounts().keylessAccount;

const getDAO = async () => {
    loading.value = true;
    dao.value = await unpackDAO(route.params.id as string);
    loading.value = false;
};

const selectImage = (event: any) => {
    const files = event.target.files;
    if (files.length > 0) {
        proposal.value.image_preview = URL.createObjectURL(files[0]);
        proposal.value.image_file = files[0];
    }
    else {
        proposal.value.image_file = null;
    }
};

const submitProposal = async () => {
    if (submitting.value) return;
    if (!dao.value) return;
    if (!keylessAccount || !keylessAccount.value) return;

    if (Number(donatedAmount.value) < dao.value.minRequiredProposerVotingPower) {
        toast.error('Insufficient voting power.');
        return;
    }

    if (proposal.value.title.length == 0) {
        toast.error('Title is required.');
        return;
    }

    if (proposal.value.description.length == 0) {
        toast.error('Description is required.');
        return;
    }

    if (!proposal.value.proposedAmount || proposal.value.proposedAmount == 0) {
        toast.error('Proposed amount is required.');
        return;
    }

    submitting.value = true;

    if (proposal.value.image_file) {
        const image_url = await Storage.awaitUpload(
            proposal.value.image_file,
            'dao_propsoal_' + dao.value.daoAddress + '_id_' + dao.value.nextProposalId
        );

        if (image_url) proposal.value.image = image_url;
    }

    const startTimeSecs = Number(proposal.value.startTime.getTime() / 1000).toFixed(0);

    const txHash = await createProposal(
        keylessAccount.value,
        dao.value.daoAddress,
        proposal.value.title,
        proposal.value.description,
        proposal.value.image,
        toAptosUnits(proposal.value.proposedAmount),
        parseInt(startTimeSecs)
    );

    if (txHash) {
        toast.success('Proposal submitted.');
        router.push(`/app/donate/${route.params.id}`);
    } else {
        toast.success('Failed to submit proposal.');
    }

    submitting.value = false;
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
                        <RouterLink :to="`/app/donate/${$route.params.id}`">
                            <h3>{{ dao.name }}</h3>
                        </RouterLink>
                        <ChevronRight :color="'var(--tx-semi)'" />
                        <h3>New Proposal</h3>
                    </div>
                    <div class="donate_address">
                        <p>{{ collapseAddress(dao.daoAddress) }}</p>
                        <CopyIcon :color="'var(--tx-semi)'" />
                    </div>
                </div>
            </div>

            <div class="dao_stats">
                <div class="dao_stat">
                    <h3>Min. voting power required</h3>
                    <div class="dao_stat_amount">
                        <p>{{ fromAptosUnits(dao.minRequiredProposerVotingPower) }}</p>
                    </div>
                </div>

                <div class="dao_stat">
                    <h3>Voting duration</h3>
                    <div class="dao_stat_amount">
                        <p>{{ toDays(dao.votingDuration).days }} days : {{ toDays(dao.votingDuration).hours }} hours</p>
                    </div>
                </div>

                <div class="dao_stat">
                    <h3>Resolve threshold</h3>
                    <div class="dao_stat_amount">
                        <p>{{ fromAptosUnits(dao.resolveThreshold) }}</p>
                    </div>
                </div>
            </div>

            <div class="proposal">
                <div class="input">
                    <p class="label">Title <span>*</span></p>
                    <input type="text" v-model="proposal.title">
                </div>

                <div class="input">
                    <p class="label">Description <span>*</span></p>
                    <textarea type="text" rows="5" v-model="proposal.description"></textarea>
                </div>

                <div class="input">
                    <p class="label">Proposed amount ($GCoin) <span>*</span></p>
                    <input type="number" placeholder="0.00" v-model="proposal.proposedAmount"></input>
                </div>

                <div class="input">
                    <p class="label">Start time <span>*</span></p>
                    <VueDatePicker v-model="proposal.startTime"></VueDatePicker>
                </div>

                <div class="input">
                    <p class="label">Image <span>*</span></p>
                    <input type="file" accept="image/*" @change="selectImage">
                </div>

                <div class="action">
                    <Button :loading="submitting" @click="submitProposal" :text="'Submit proposal'" />
                </div>
            </div>
        </div>
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
    grid-template-columns: repeat(3, 1fr);
    margin-top: 2%;
}

.dao_stat {
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    text-align: center;
}

.dao_stat:first-child {
    border-right: 1px solid var(--bg-darkest);
}

.dao_stat:nth-child(2) {
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

.proposal {
    width: 550px;
}

.input {
    margin-top: 30px;
}

.label {
    color: var(--tx-semi);
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 10px;
}

.label span {
    color: var(--sm-error);
}

.input input[type=text],
.input input[type=number] {
    height: 40px;
    border: 1px solid var(--bg-darkest);
    border-radius: 6px;
    padding: 0 10px;
    outline: none;
    width: 100%;
    font-size: 16px;
    color: var(--tx-normal);
}

.input textarea {
    border: 1px solid var(--bg-darkest);
    border-radius: 6px;
    padding: 10px;
    outline: none;
    width: 100%;
    resize: vertical;
    font-size: 16px;
    color: var(--tx-normal);
}

.action {
    margin-top: 40px;
}
</style>