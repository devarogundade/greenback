<script setup lang="ts">
import Button from '@/components/buttons/Button.vue';
import LogoIcon from '@/components/icons/LogoIcon.vue';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue';
import { useKeylessAccounts } from '@/scripts/useKeylessAccounts';
import useEphemeralKeyPair from "@/scripts/useEphemeralKeyPair";
import { collapseAddress } from '@/scripts/utils';

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
            <header>
                <div class="logo">
                    <RouterLink to="/">
                        <LogoIcon />
                    </RouterLink>
                </div>

                <div class="actions">
                    <div class="tabs">
                        <button class="tabs_item">
                            <p>Donate</p>
                            <div class="tabs_item_icon">
                                <ChevronDownIcon />
                            </div>
                            <div class="tabs_item_options">
                                <RouterLink to="/app/donate">
                                    <button class="tabs_item_options_item">
                                        <p>Explore DAOs</p>
                                    </button>
                                </RouterLink>
                                <RouterLink to="/app/donate/create">
                                    <button class="tabs_item_options_item">
                                        <p>Request new DAO</p>
                                    </button>
                                </RouterLink>
                            </div>
                        </button>

                        <RouterLink to="/app/inventory/coupons">
                            <button class="actions_item">
                                <p>Coupons</p>
                            </button>
                        </RouterLink>
                    </div>

                    <RouterLink to="/app/inventory/achievements">
                        <button class="tabs_item">
                            <p>Achievements</p>
                        </button>
                    </RouterLink>
                    <Button v-if="activeAccount" :text="collapseAddress(activeAccount?.accountAddress.toString())" />

                    <a :href="redirectUrl.toString()" v-else>
                        <Button :text="'Connect'" />
                    </a>
                </div>
            </header>
        </div>
    </section>
</template>

<style scoped>
section {
    border-image-source: linear-gradient(to left, transparent, var(--bg-darkest), transparent);
    border-bottom: 1px solid;
    border-image-slice: 1;
    position: fixed;
    width: 100%;
    left: 0;
    top: 0;
    z-index: 99;
    backdrop-filter: blur(6px);
    background: rgba(255, 255, 255, 0.6)
}

header {
    height: 90px;
    display: grid;
    grid-template-columns: 1fr 4fr;
    align-items: center;
}

.tabs {
    display: flex;
    align-items: center;
    gap: 30px;
}

.tabs_item {
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    position: relative;
    height: 40px;
    background: none;
    font-size: 14px;
    font-weight: 500;
    gap: 10px;
}

.tabs_item:hover .tabs_item_options {
    display: flex;
}

.tabs_item_icon {
    margin-top: 3px;
}

.tabs_item>p {
    color: var(--tx-semi);
}

.tabs_item_options {
    position: absolute;
    width: 200px;
    left: 0;
    top: 40px;
    flex-direction: column;
    background: var(--bg-dark);
    border: 1px solid var(--bg-darker);
    border-radius: 6px;
    display: none;
}

.tabs_item_options_item {
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 16px;
    height: 40px;
    background: none;
}

.tabs_item_options_item>p {
    color: var(--tx-semi);
}

.tabs_item_options_item:first-child {
    border-bottom: 1px solid var(--bg-darker);
}

.logo {
    display: flex;
    align-items: center;
}

.actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 30px;
}

.actions_item {
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    position: relative;
    height: 40px;
    background: none;
    font-size: 14px;
    font-weight: 500;
    gap: 10px;
}

.actions_item>p {
    color: var(--tx-semi);
}
</style>