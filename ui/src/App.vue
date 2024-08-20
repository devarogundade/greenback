<script setup lang="ts">
import HomeHeader from '@/components/HomeHeader.vue';
import AppHeader from '@/components/AppHeader.vue';
import { useRoute } from 'vue-router';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FS_API_KEY,
  authDomain: import.meta.env.VITE_FS_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FS_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FS_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FS_MSG_SENDER_ID,
  appId: import.meta.env.VITE_FS_APP_ID,
  measurementId: import.meta.env.VITE_FS_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

getAnalytics(app);
const route = useRoute();
</script>

<template>
  <main>
    <HomeHeader v-if="route.name == 'home'" />
    <AppHeader v-else />

    <RouterView />
  </main>
</template>