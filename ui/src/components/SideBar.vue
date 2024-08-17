<script setup lang="ts">
import { useRoute } from 'vue-router';
import DiscoverIcon from '@/components/icons/DiscoverIcon.vue';
import AirdropIcon from '@/components/icons/AirdropIcon.vue';
import BubbleIcon from '@/components/icons/BubbleIcon.vue';

const route = useRoute();
</script>

<template>
    <main>
        <div class="overflow">
            <div class="tab_items">
                <div class="tab_parent">
                    <RouterLink to="/app">
                        <div class="title">
                            <h3>My Activity</h3>
                            <DiscoverIcon
                                :color="(route.name as string)?.startsWith('app-activity') ? '#161618' : '#ABADAE'" />
                        </div>
                    </RouterLink>
                    <div class="tabs">
                        <RouterLink to="/app">
                            <div
                                :class="(route.name as string)?.startsWith('app-activity-overview') ? 'tab tab_active' : 'tab'">
                                Home
                            </div>
                        </RouterLink>
                        <RouterLink to="/app/activity/earnings">
                            <div
                                :class="(route.name as string)?.startsWith('app-activity-earnings') ? 'tab tab_active' : 'tab'">
                                Earnings
                            </div>
                        </RouterLink>
                    </div>
                </div>
                <div class="tab_parent">
                    <RouterLink to="/app/donate">
                        <div class="title">
                            <h3>Donate</h3>
                            <BubbleIcon
                                :color="(route.name as string)?.startsWith('app-donate') ? '#161618' : '#ABADAE'" />
                        </div>
                    </RouterLink>
                </div>
                <div class="tab_parent">
                    <RouterLink to="/app/inventory/coupons">
                        <div class="title">
                            <h3>Inventory</h3>
                            <AirdropIcon
                                :color="(route.name as string)?.startsWith('app-inventory') ? '#161618' : '#ABADAE'" />
                        </div>
                    </RouterLink>
                    <div class="tabs">
                        <RouterLink to="/app/inventory/coupons">
                            <div
                                :class="(route.name as string)?.startsWith('app-inventory-coupons') ? 'tab tab_active' : 'tab'">
                                Coupons
                            </div>
                        </RouterLink>
                        <RouterLink to="/app/inventory/achievements">
                            <div
                                :class="(route.name as string)?.startsWith('app-inventory-achievements') ? 'tab tab_active' : 'tab'">
                                Achievements 🏆
                            </div>
                        </RouterLink>
                    </div>
                </div>
                <div class="tab_parent">
                    <RouterLink to="/app/gcard">
                        <div class="title">
                            <h3>My GCard</h3>
                            <BubbleIcon
                                :color="(route.name as string)?.startsWith('app-gcard') ? '#161618' : '#ABADAE'" />
                        </div>
                    </RouterLink>
                </div>
            </div>
        </div>
    </main>
</template>

<style scoped>
main {
    height: calc(100vh - 90px);
    top: 90px;
    width: 230px;
    border-right: 1px solid var(--bg-darkest);
    position: fixed;
    z-index: 20;
    background: linear-gradient(to right, transparent, transparent, var(--bg-dark));
}

.overflow {
    height: 70vh;
    overflow-y: auto;
}

.overflow:hover::-webkit-scrollbar {
    display: block;
}

.overflow::-webkit-scrollbar {
    display: none;
    width: 3px;
}

.tab_items {
    display: flex;
    margin-top: 40px;
    flex-direction: column;
    gap: 36px;
    padding-bottom: 10px;
}

.tab_parent {
    display: flex;
    flex-direction: column;
}

.title {
    height: 50px;
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 16px;
    gap: 20px;
    justify-content: space-between;
}

.title h3 {
    font-weight: 500;
    font-size: 14px;
    color: var(--tx-normal);
}

.title span {
    padding: 4px 8px;
    font-size: 10px;
    color: var(--tx-dimmed);
    height: 20px;
    background: var(--primary-light);
    border-radius: 2px;
}

.tabs {
    width: 100%;
    margin-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.tab {
    height: 40px;
    font-weight: 500;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding: 0 20px;
    color: var(--tx-dimmed);
}

.tab_active {
    color: var(--tx-normal);
}
</style>