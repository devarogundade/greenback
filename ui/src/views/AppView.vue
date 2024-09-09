<script setup lang="ts">
import Button from '@/components/buttons/Button.vue';
import SideBar from '@/components/SideBar.vue';
import useEphemeralKeyPair from "@/scripts/ephemeral-keypair";
import { useKeylessAccounts } from '@/scripts/keyless-accounts';
import { watch } from 'vue';
import { useUserStore } from '@/stores/user-store';
import { getAccountAPTAmount, fundAccount } from '@/scripts/aptos-utils';
import { MIN_FAUCET_AMOUNT, FAUCET_AMOUNT } from '@/scripts/constants';
import { createUser, getUserAccount } from '@/scripts/greenback-contracts';
import { AccountAddress, KeylessAccount } from "@aptos-labs/ts-sdk";
import { borrowString } from '@/scripts/utils';
import { useToast } from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';

const toast = useToast({ duration: 4000, position: 'top', dismissible: true });

const ephemeralKeyPair = useEphemeralKeyPair();
const redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

const searchParams = new URLSearchParams({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    redirect_uri: `${window.location.origin}/auth/callback`,
    response_type: "id_token",
    scope: "openid email profile",
    nonce: ephemeralKeyPair.value.nonce,
});

redirectUrl.search = searchParams.toString();

const keylessAccount = useKeylessAccounts().keylessAccount;

const getAPTAmount = async (address: AccountAddress) => {
    const aptBalance = await getAccountAPTAmount(address);

    useUserStore.setState({ aptBalance });

    if (aptBalance && aptBalance > MIN_FAUCET_AMOUNT) {
        return;
    };

    const txHash = await fundAccount(address, FAUCET_AMOUNT);

    if (txHash) {
        getAPTAmount(address);
        toast.success('Faucet: your account has been funded with APT.');
    } else {
        toast.error('Faucet: failed to fund your account with APT.');
    }
};

const getUser = async (keylessAccount: KeylessAccount) => {
    const user = await getUserAccount(keylessAccount.accountAddress);

    if (user) {
        useUserStore.setState({ unclaimedEarnings: user[0] });
        useUserStore.setState({ withdrawnEarnings: user[1] });
        useUserStore.setState({ donatedEarnings: user[2] });
        useUserStore.setState({ cardId: borrowString(user[3].vec[0]) });
        return;
    }

    const tx_hash = await createUser(keylessAccount);

    if (tx_hash) {
        toast.error('Your greenback account has been created.');
        getUser(keylessAccount);
    } else {
        toast.error('Failed: to create your greenback account.');
    }
};

watch(useKeylessAccounts().accounts, async () => {
    const keylessAccount = useKeylessAccounts().keylessAccount?.value;
    if (!keylessAccount) return;

    getUser(keylessAccount);
    getAPTAmount(keylessAccount.accountAddress);
});
</script>

<template>
    <section>
        <div class="app_width">
            <div class="app">
                <SideBar class="sidebar" />
                <div></div>
                <div class="sandbox" v-if="keylessAccount?.accountAddress">
                    <RouterView />
                </div>
                <div class="login" v-else>
                    <div class="login_details">
                        <h3>Keyless Web3 Connect</h3>
                        <p>Sign in with your Google account to continue.</p>

                        <div class="action">
                            <a :href="redirectUrl.toString()">
                                <Button :text="'Sign in with Google'">
                                    <GoogleIcon />
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </section>
</template>

<style scoped>
.app {
    display: grid;
    width: 100%;
    grid-template-columns: 230px auto;
    height: 100vh;
}

.login {
    padding: 140px 40px;
    display: flex;
    justify-content: center;
}

.login_details {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.login_details h3 {
    color: var(--tx-semi);
    font-size: 30px;
    font-weight: 500;
}

.login_details p {
    color: var(--tx-dimmed);
    font-size: 16px;
    margin-top: 10px;
}

.login_details .action {
    margin-top: 40px;
}
</style>