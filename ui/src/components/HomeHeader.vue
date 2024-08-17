<script setup lang="ts">
import Button from '@/components/buttons/Button.vue';
import OutIcon from '@/components/icons/OutIcon.vue';
import LogoIcon from '@/components/icons/LogoIcon.vue';
import ChevronDownIcon from '@/components/icons/ChevronDownIcon.vue';
</script>

<template>
    <section>
        <div class="app_width">
            <header>
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

                    <RouterLink to="/recycling-machine">
                        <button class="tabs_item">
                            <p>The Recycling Machine</p>
                        </button>
                    </RouterLink>
                </div>

                <div class="logo">
                    <RouterLink to="/">
                        <LogoIcon />
                    </RouterLink>
                </div>

                <div class="actions">
                    <a href="https://blogs.thegreenback.xyz" target="_blank">
                        <button class="actions_item">
                            <p>Blogs</p>
                            <OutIcon />
                        </button>
                    </a>

                    <RouterLink to="/gcoin">
                        <button class="actions_item">
                            <p>$GCoin</p>
                        </button>
                    </RouterLink>

                    <RouterLink to="/app">
                        <Button :text="'Launch App'" />
                    </RouterLink>
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
    position: sticky;
    top: 0;
    z-index: 99;
    backdrop-filter: blur(6px);
    background: rgba(255, 255, 255, 0.6)
}

header {
    height: 90px;
    display: grid;
    grid-template-columns: 2fr 1fr 2fr;
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
    justify-content: center;
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