<script setup lang="ts">
import HomeHeader from '@/components/HomeHeader.vue';
import AppHeader from '@/components/AppHeader.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
  <main>
    <HomeHeader v-if="route.name == 'home'" />
    <AppHeader v-else />

    <RouterView />
  </main>
</template>