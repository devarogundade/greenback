<script setup lang="ts">
import Button from '@/components/buttons/Button.vue';
import SideBar from '@/components/SideBar.vue';
import useEphemeralKeyPair from "@/scripts/useEphemeralKeyPair";
import { useKeylessAccounts } from '@/scripts/useKeylessAccounts';

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

const activeAccount = useKeylessAccounts().activeAccount;
</script>

<template>
    <section>
        <div class="app_width">
            <div class="app">
                <SideBar class="sidebar" />
                <div></div>
                <div class="sandbox" v-if="activeAccount?.accountAddress">
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